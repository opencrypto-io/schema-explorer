const Layout = require('./components/Layout')

const Homepage = require('./components/Homepage')
const Schema = require('./components/Schema')

const root = document.getElementById('schema-explorer')

const bundleUrl = window.location.hostname === 'localhost' ?
  '/schema/build/bundle.json' : 'https://schema.opencrypto.io/build/bundle.json'

var loadedBundle = null
var loadingBundle = null

function bundle() {
  if (!loadedBundle && !loadingBundle) {
    loadingBundle = true
    m.request(bundleUrl, { background: true }).then(data => {
      loadedBundle = data
      loadingBundle = false
      console.log('Loaded from: %s', bundleUrl)
      m.redraw()
    })
  }
  return loadedBundle
}

m.route(root, '/', {
  '/': { render: (vnode) => m(Layout, { bundle }, m(Homepage, { bundle })) },
  '/model/:id': { render: (vnode) => m(Layout, { bundle }, m(Schema, { bundle, id: vnode.attrs.id })) }
})
