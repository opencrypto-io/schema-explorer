
const markdown = require('../lib/markdown')
const changelogLib = require('../lib/changelog')

const isLocal = window.location.hostname === 'localhost'

var changelog = null

module.exports = {
  oninit: (vnode) => {
    this.bundlePromise = vnode.attrs.bundle()
    this.bundlePromise.then((bundle) => {
      this.bundle = bundle
      m.redraw()
    })
    changelogLib.load().then(data => {
      changelog = data
      m.redraw()
    })
  },
  view: (vnode) => {
    if (!this.bundle || !changelog) {
      return m('div', 'Loading ..')
    }
    return m('#changelog', [
      m('.title.is-3', 'Changelog'),
      changelog.map(tag => {
        if (!isLocal && tag.version === 'Unreleased') {
          return null
        }
        return m('.content', [
          m('.title.is-5', m('a', { class: 'silent', href: `https://github.com/opencrypto-io/schema/tree/${tag.version}` }, tag.version)),
          m('ul', tag.changes.map(ch => {
            return m('li', m.trust(markdown.render(ch)))
          }))
        ])
      })
    ])
  }
}
