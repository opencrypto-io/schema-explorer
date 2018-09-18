const Layout = require('./components/Layout')

const Homepage = require('./components/Homepage')
const Schema = require('./components/Schema')
const Changelog = require('./components/Changelog')

const root = document.getElementById('schema-explorer')

const isLocal = window.location.hostname === 'localhost'
const bundleUrl = isLocal ?
  '/schema/build/bundle.json' : 'https://schema.opencrypto.io/build/bundle.json'

var loadedBundle = null
var loadingBundle = null
var bundlePromise = null

function bundle() {
  if (loadedBundle) {
    return Promise.resolve(loadedBundle)
  }
  if (loadingBundle) {
    return bundlePromise
  }
  loadingBundle = true
  bundlePromise  = new Promise(resolve => {
    m.request(bundleUrl, { background: true }).then(data => {
      loadedBundle = data
      loadedBundle.isLocal = isLocal
      loadingBundle = false
      console.log('Loaded from: %s', bundleUrl)
      resolve(loadedBundle)
    })
  })
  return bundlePromise
}

m.route(root, '/', {
  '/': { render: (vnode) => m(Layout, { bundle }, m(Homepage, { bundle })) },
  '/model/:id': { render: (vnode) => m(Layout, { bundle }, m(Schema, { bundle, id: vnode.attrs.id })) },
  '/changelog': { render: (vnode) => m(Layout, { bundle }, m(Changelog, { bundle })) },
})
