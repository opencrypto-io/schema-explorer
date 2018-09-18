
const changelogLib = require('../lib/changelog')
const markdown = require('../lib/markdown')

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
    if (!this.bundle) {
      return m('div', 'Loading')
    }
    let modelViewPath = (modelId, root = false) => {
      let model = this.bundle.models[modelId]
      let submodels = []
      Object.keys(this.bundle.models).forEach((mod) => {
        if (this.bundle.models[mod].parent === modelId) {
          submodels.push(mod)
        }
      })
      return m('li', [
        !root ? m('i', { class: 'fa-li far fa-level-up', style: 'transform: rotate(90deg);' }) : null,
        m('div', m('a', { href: `/model/${modelId}`, oncreate: m.route.link }, [
          model.schema['fa-icon'] ? m('b', { class: 'far fa-'+model.schema['fa-icon'], style: 'margin-right: 0.5em; color: #808080;' }) : null,
          model.name,
        ])),
        !submodels ? null : m('ul.fa-ul', { style: root ? 'margin-left: 3em;' : '' }, submodels.map((sm) => {
          return modelViewPath(sm)
        }))
      ])
    }

    return m('#homepage', [
      m('.level', [
        m('.level-left', [
          m('.title.is-3', [
            m('b','OpenCrypto Schema'),
            ` v${this.bundle.meta.version}`
          ]),
        ]),
      ]),
      m('.tile.is-parent', [
        m('.tile.oc-box.is-5', [
          m('.content', [
            m('div', m('b', 'Models:')),
            m('ul.schema-structure.main', Object.keys(this.bundle.models).map((mod) => {
              if (this.bundle.models[mod].parent) {
                return null
              }
              return modelViewPath(mod, true)
            })),
          ])
        ]),
        m('.tile', [
          m('.content', [
            m('.title.is-4', [
              'Schemas for structured cryptocurrency-related data in ',
              m('a', { href: 'https://json-schema.org/' }, 'JSON Schema'),
              ' standard'
            ]),
            m('p', 'We created this schema, because we need normalized way how to create, transfer and store data about crypto-assets and related ecosystem.'),
            m('p', 'Schema is divided to models by their purpose and it\'s designed to be easy to understand and to encompass all data properties that is needed.'),
            m('p', 'Open-sourced under MIT license.'),
            m('p', [
              'If you miss some property or have another issue to discuss, you can create a new ',
              m('a', { href: 'https://github.com/opencrypto-io/schema/issues' }, 'Schema Issue'),
              ' on GitHub.',
            ]),
            m('p', { style: 'margin-top: 2em; font-size: 1.2em;' }, [
              m('a', { href: 'https://github.com/opencrypto-io/schema'}, [
                m('i', { class: 'fab fa-github', style: 'margin-right: 0.5em;' }),
                'GitHub repository',
              ])
            ])
          ])
        ]),
      ]),
      !changelog ? null : m('#changelog', [
        m('.title.is-4', 'Changelog'),
        changelog.slice(0,2).map(tag => {
          if (!isLocal && tag.version === 'Unreleased') {
            return null
          }
          return m('.content', [
            m('.title.is-5', tag.version),
            m('ul', tag.changes.map(ch => {
              return m('li', m.trust(markdown.render(ch)))
            }))
          ])
        }),
        m('p', m('a', { href: '/changelog', oncreate: m.route.link }, 'Show full Changelog'))
      ])
      
    ])
  }
}
