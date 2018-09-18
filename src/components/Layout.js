
let savedRoute = null
let searchq = null

const setSearch = (value) => {
  searchq = value
  value = value.trim()
  if (value === "") {
    if (savedRoute) {
      m.route.set(savedRoute)
    }
    return null
  }
  const current = m.route.get()
  if (!current.startsWith('/search/') || savedRoute === null) {
    savedRoute = current
  }
  m.route.set(`/search/${encodeURI(value)}`)
}

module.exports = {
  oninit: (vnode) => {
    if (vnode.attrs.q) {
      searchq = vnode.attrs.q
    }
    this.bundlePromise = vnode.attrs.bundle()
    this.bundlePromise.then((bundle) => {
      this.bundle = bundle
      m.redraw()
    })
  },
  onupdate: (vnode) => {
    if (searchq) {
      setTimeout(() => {
        if (!m.route.get().startsWith('/search/')) {
          searchq = ''
          m.redraw()
        }
      }, 100)
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
                  m('a.navbar-item.has-dropdown.is-hoverable', [
                    m('a.navbar-link', 'Documentation'),
                    m('.navbar-dropdown', [
                      m('a.navbar-item', { href: '/', oncreate: m.route.link, class: m.route.get() === '/' ? 'selected' : null }, 'Introduction'),
                      m('.navbar-divider'),
                      m('a.navbar-item', { href: '/changelog', oncreate: m.route.link, class: m.route.get() === '/changelog' ? 'selected' : null }, 'Changelog'),
                    ])
                  ]),
                  //m('span.navbar-item', { style: 'font-size: 8px; color: silver;'  }, ' ● '),
                  m('.navbar-item', m('input.input.is-rounded', { placeholder: 'Search for prop ..', style: 'width: 10em;', oninput: m.withAttr('value', setSearch), value: searchq })),
                  //m('span.navbar-item', { style: 'font-size: 8px; color: silver;'  }, ' ● '),
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
                    m('a.navbar-link', 'Other models'),
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
        m('.container.page-content', function() {
          if (true) {
            return m('#page', vnode.children)
          }
          return m('div', { style: 'padding: 2em;' }, 'Loading ..')
        }())
      ])
    ])
  }
}
