var currentId = null
var schema = null
var schemaCache = {}
var exampleCache = {}
var example = null

module.exports = {
  oninit: (vnode) => {
    this.bundlePromise = vnode.attrs.bundle()
    this.bundlePromise.then((bundle) => {
      this.bundle = bundle
      this.model = this.bundle.models[vnode.attrs.id]
      m.redraw()
    })
  },
  onupdate: (vnode) => {
    if (this.model && this.model.id !== vnode.attrs.id) {
      this.model = this.bundle.models[vnode.attrs.id]
      m.redraw()
    }
  },
  view: (vnode) => {
    if (!this.model) {
      return m('div', 'Loading ...')
    }
    const schema = this.model.schema
    return m('div', [
      m('h2.my-title', [
        schema['fa-icon'] ? m('i', { class: 'far fa-'+schema['fa-icon'], style: 'margin-right: 0.5em;' }) : null,
        schema.title
      ]),
      m('.path', this.model.path.map(p => {
        var out = [ m('a', { href: `/model/${p}`, oncreate: m.route.link }, this.bundle.models[p].name) ]
        if (p !== this.model.id) {
          out.push(m('b', { style: 'padding: 0 0.4em;' }, ' → '))
        }
        return out
      })),
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
          this.model.example[pk] ? m('pre.example', jsyaml.dump(this.model.example[pk])) : null,
        ])
      }))
    ])
  }
}
