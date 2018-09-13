
module.exports = {
  oninit: (vnode) => {
    this.bundle = vnode.attrs.bundle()
  },
  onupdate: (vnode) => {
    if (this.bundle !== vnode.attrs.bundle()) {
      this.bundle = vnode.attrs.bundle()
      m.redraw()
    }
  },
  view: (vnode) => {
    return m('div', [
      m('div', { 'style': 'padding-bottom: 5em;' },  [
        m('nav#navbar.navbar', [
          m('.container', [
            m('.navbar-brand', [
              m('a.navbar-item', { href: 'https://data.opencrypto.io/' }, [
                m('#logo'),
                m('#logo-text', [
                  m('span.thin', 'Open'),
                  'Crypto',
                  m('span.green', 'Data'),
                ])
              ])
            ]),
            m('.navbar-menu', [
              m('.navbar-start', [
                m('a.navbar-item', { href: 'https://data.opencrypto.io' }, 'Homepage'), 
                m('a.navbar-item', { href: 'https://explorer.opencrypto.io' }, 'Explorer'), 
                m('a.navbar-item.current', { href: 'https://schema.opencrypto.io' }, 'Schema'), 
              ]),
              m('.navbar-end', [
                m('a.navbar-item', { href: '#' }, 'How to contribute?'), 
                m('a.navbar-item', { href: '#' }, 'FAQ'), 
              ])
            ])
          ])
        ]),
        m('nav#subbar.navbar', [
          m('.container', [
            m('.navbar-menu', [
              m('.navbar-start', (() => {
                let arr = [
                  m('a.navbar-item', { href: '/', oncreate: m.route.link, class: m.route.get() === '/' ? 'selected' : null }, 'Introduction'),
                  m('span.navbar-item', { style: 'font-size: 8px; color: silver;'  }, ' ● ')
                ]
                if (!this.bundle) {
                  return arr
                }
                let allmodels = Object.keys(this.bundle.models)
                let models = allmodels.filter((mk) => {
                  let model = this.bundle.models[mk]
                  return model.path.length < 3
                }).map(mk => {
                  let model = this.bundle.models[mk]
                  let href = `/model/${mk}`
                  return m('a.navbar-item', { href, oncreate: m.route.link, class: m.route.get() === href ? 'selected' : null }, model.name)
                })
                //console.log(models)
                let omodels = allmodels.filter(mk => {
                  let model = this.bundle.models[mk]
                  return model.path.length >= 3
                })
                if (omodels.length > 0) {
                  models.push(m('.navbar-item.has-dropdown.is-hoverable', [
                    m('a.navbar-link', 'Other'),
                    m('.navbar-dropdown', omodels.map(mk => {
                      let model = this.bundle.models[mk]
                      let href = `/model/${mk}`
                      return m('a.navbar-item', { href, oncreate: m.route.link, class: m.route.get() === href ? 'selected' : null }, model.name)
                    }))
                  ]))
                }
                return arr.concat(models)
              })()),
              m('.navbar-end', (() => {
                if (!this.bundle) {
                  return null
                }
                return m('.navbar-item', [
                  m('div.select.is-rounded', [
                    m('select', [
                      m('option', this.bundle.isLocal ? `v${this.bundle.meta.version} (local)` : `v${this.bundle.meta.version} (latest)`)
                    ])
                  ])
                ])
              })())
            ])
          ])
        ]),
        m('.container', function() {
          if (true) {
            return m('#page', vnode.children)
          }
          return m('div', { style: 'padding: 2em;' }, 'Loading ..')
        }())
      ])
    ])
  }
}
