var m = require('mithril')
var vars = require('../variables')

module.exports = {
  view: function(vnode) {
    return m('div', [
      m('nav.navbar.is-white', [
        m('div.container', [
          m('div.navbar-brand', m('a.navbar-item.brand-text', { href: '#!/' }, 'Opencrypto Schema')),
        ])
      ]),
      m('.container', [
        m('.columns', [
          m('.column.is-2', [
            m('aside.menu', [
              m('p.menu-label', 'General'),
              m('ul.menu-list', [
                m('li', m('a', { href: '#/' }, 'Introduction')),
              ]),
              m('p.menu-label', 'Core schema'),
              m('ul.menu-list', [
                m('li', m('a', { href: '#!/schema/core' }, 'Core')),
              ]),
              m('p.menu-label', 'Schemas'),
              m('ul.menu-list', Object.keys(vars.models).map(mk => {
                if (mk == 'core') return null;
                return m('li', m('a', { href: '#!/schema/' + mk }, vars.models[mk].name))
              }))
            ])
          ]),
          m('.column.is-10', vnode.children)
        ])
      ])
    ])
  }
}
