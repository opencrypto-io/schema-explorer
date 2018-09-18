var searchResult = null
var currentq = null
var searching = false

function sObject (modelId, model, q, path = []) {
  if (model.$id && path.length > 0) { return [] }
  if (!model.properties) { return [] }

  var res = []
  Object.keys(model.properties).forEach(pk => {
    const pv = model.properties[pk]
    const re = new RegExp(q, 'i')
    if (pk.match(re) || (pv.title && pv.title.match(re)) || (pv.description && pv.description.match(re))) {
      res.push({ model: pk, property: pk, value: pv.title, description: pv.description })
    }
    let cr = []
    switch (pv.type) {
      case 'object':
        cr = sObject(pk, pv, q, path.concat(modelId))
        if (cr.length > 0) {
          cr.forEach(ccr => {
            res.push({ model: pk, description: ccr.description, property: [ pk, ccr.property ].join('.') })
          })
        }
        break
      case 'array':
        if (pv.items && pv.items.type === 'object') {
          cr = sObject(pk + '[]', pv.items, q, path.concat(modelId, '[]'))
        }
        if (cr.length > 0) {
          cr.forEach(ccr => {
            res.push({ model: pk, description: ccr.description, property: [ pk + '[]', ccr.property ].join('.') })
          })
        }
        break
    }
  })
  return res
}

function searchModel (model, q) {
  //console.log('searching model "%s" for query "%s"', model.id, q)
  let type = model.type || 'object'
  return sObject(model.id, model.schema, q)
}

function doSearch (bundle, q) {
  console.log('dosearch')
  currentq = q

  let res = []
  Object.keys(bundle.models).forEach(mk => {
    let model = bundle.models[mk]
    res = res.concat(searchModel(model, q).map(r => { r.model = mk; return r }))
  })

  searchResult = res
  searching = false
  m.redraw()
}

module.exports = {
  oninit (vnode) {
    searching = true
    this.bundlePromise = vnode.attrs.bundle()
    this.bundlePromise.then((bundle) => {
      this.bundle = bundle
      m.redraw()
    })
    .then(() => doSearch(this.bundle, vnode.attrs.q))
  },
  onupdate (vnode) {
    if (searching) {
      return null
    }
    this.bundlePromise.then(() => {
      if (vnode.attrs.q !== currentq) {
        doSearch(this.bundle, vnode.attrs.q)
      }
    })
  },
  view (vnode) {
    let res = null
    const re = new RegExp(currentq, 'i')
    const highlight = (str) => {
      if (!str) return str
      return m.trust(str.replace(re, (s) => `<span class="sf">${s}</span>`))
    }
    if (searchResult && this.bundle) {
      if (searchResult.length === 0) {
        res = m('div', 'Nothing found')
      } else {
        res = m('.content', m('ul', searchResult.map(sr => {
          return m('li.box', [
            m('b', { class: 'far fa-'+this.bundle.models[sr.model].schema['fa-icon'], style: 'margin-right: 0.5em' }),
            m('a', { href: `/model/${sr.model}`, oncreate: m.route.link, class: 'silent' }, `${sr.model}`),
            m('span', ' → '),
            m('span', highlight(sr.property)),
            m('div', { style: 'color: rgb(153, 153, 153)' }, m('span', highlight(sr.description)))
          ])
        })))
      }
    }
    return m('#search', [
      m('.title.is-5', 'Search for "'+vnode.attrs.q+'"'),
      res ? res : m('div', 'Loading ..')
    ])
  }
}
