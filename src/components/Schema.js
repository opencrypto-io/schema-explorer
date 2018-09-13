var currentId = null
var schema = null
var schemaCache = {}
var exampleCache = {}
var example = null

function loadSchema(vnode) {
  currentId = vnode.attrs.id
  const prefix = window.location.hostname === 'localhost' ?
    '/schema' : 'https://schema.opencrypto.io'
  const url = prefix + `/build/deref/${vnode.attrs.id}.json`
  const exampleUrl = prefix + `/examples/models/${vnode.attrs.id}.json`
  if (schemaCache[currentId]) {
    schema = schemaCache[currentId]
    example = exampleCache[currentId]
    m.redraw()
    return true
  }
  Promise.all([
    m.request(url, { background: true }),
    m.request(exampleUrl, { background: true }),
  ]).then(output => {
    console.log('Loaded from: %s', url)
    schema = schemaCache[currentId] = output[0]
    console.log('Loaded from: %s', exampleUrl)
    example = exampleCache[currentId] = output[1]
    m.redraw()
  })
}

module.exports = {
  oninit: (vnode) => {
    currentId = vnode.attrs.id
    loadSchema(vnode)
  },
  onupdate (vnode) {
    if (vnode.attrs.id !== currentId) {
      loadSchema(vnode)
    }
  },
  view: (vnode) => {
    if (!schema) {
      return m('div', 'Loading ...')
    }
    return m('div', [
      m('h2.title', schema.title),
      m('.description', schema.description), 
      m('.props', Object.keys(schema.properties).map(pk => {
        let po = schema.properties[pk]
        return m('.custom-box', [
          m('div', [
            m('b', pk),
            m('span', '   '),
            m('i', { style: 'padding-left: 0.5em; color: #999999;' }, '{' +po.type + '}')
          ]),
          po.title ? m('div', { style: 'color: #999999;' }, po.title + (po.description ? ' - ' + po.description : '')) : null,
          example && example[pk] ? m('pre.example', JSON.stringify(example[pk], null, 2)) : null,
        ])
      }))
    ])
  }
}
