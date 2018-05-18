var m = require('mithril')
var vars = require('../variables')

var schemas = {}
var examples = {}
let currentModel = null


function loadModel(vnode) {
  if (schemas[vnode.attrs.model]) {
    return null
  }
  m.request({
    url: 'https://schema.opencrypto.io/models/'+vnode.attrs.model+'.json'
  }).then(data => {
    schemas[vnode.attrs.model] = data
  })
}

function loadExample(vnode) {
  if (examples[vnode.attrs.model]) {
    return null
  }
  m.request({
    url: 'https://schema.opencrypto.io/examples/models/'+vnode.attrs.model+'.json'
  }).then(data => {
    examples[vnode.attrs.model] = data
  })
}

var SchemaObject = {
  view: function(vnode) {
    let schema = vnode.attrs.schema
    let props = schema.properties

    let example = examples[vnode.attrs.model]

    return m('div', [
      m('.content', schema.description),
      Object.keys(props).map(p => {
        let prop = props[p]
        return m('.box', [
          m('.columns', [
            m('.column.is-3', [
              m('.subtitle', p),
            ]),
            m('.column.is-2', [
              m('i', prop.type)
            ]),
            m('.column.is-4', [
              m('div', prop.title)
            ]),
          ]),
          m('div', prop.description),
          function() {
            if (!example) {
              return null
            }
            return m('.columns', { style: "padding-top: 1rem;" }, [
              m('.column.is-12', [
                m('pre', JSON.stringify(example[p], null, 2))
              ]),
            ])
          }(),
        ])
      })
    ])
  }
}

module.exports = {
  oninit: function(vnode) {
    loadModel(vnode)
    loadExample(vnode)
    currentModel = vnode.attrs.model
  },
  onupdate: function(vnode) {
    if (vnode.attrs.model != currentModel) {
      loadModel(vnode)
      loadExample(vnode)
      currentModel = vnode.attrs.model
    }
  },
  view: function(vnode) {
    return m('div', [
      function() {
        let schema = schemas[vnode.attrs.model]
        if (!schema) {
          return m('div', [
            m('h2.title', vars.models[vnode.attrs.model].name),
            m('div', 'Loading schema ..')
          ])
        }
        return m('div', [
          m('.columns', [
            m('.column.is-8', m('h2.title', schema.title)),
            m('.column.is-4',
              m('.is-pulled-right', [
                m("a", { href: 'https://schema.opencrypto.io/models/' + vnode.attrs.model + '.json' },  "Schema source"),
                m("span", ", "),
                m("a", { href: 'https://schema.opencrypto.io/examples/models/' + vnode.attrs.model + '.json' },  "Example source"),
              ])
            ),
          ]),
          m(SchemaObject, { schema, model: vnode.attrs.model })
        ])
      }(),
    ])
  }
}

