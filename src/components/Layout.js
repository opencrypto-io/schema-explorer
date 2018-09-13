
module.exports = {
  oninit: () => {
    this.schemaMap = null

    const url = window.location.hostname === 'localhost' ?
      '/schema/build/map.json' : 'https://schema.opencrypto.io/build/map.json'

    m.request(url).then(data => {
      this.schemaMap = data
      console.log('Loaded from: %s', url)
      m.redraw()
    })
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
                if (!this.schemaMap) {
                  return arr
                }
                //console.log(schemaMap.models)
                let models = Object.keys(this.schemaMap.models).map(mk => {
                  let model = this.schemaMap.models[mk]
                  let href = `/model/${mk}`
                  return m('a.navbar-item', { href, oncreate: m.route.link, class: m.route.get() === href ? 'selected' : null }, model.name)
                })
                //console.log(models)
                return arr.concat(models)
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
