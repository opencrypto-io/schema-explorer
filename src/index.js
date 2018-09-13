const Layout = require('./components/Layout')

const Homepage = require('./components/Homepage')
const Schema = require('./components/Schema')

const root = document.getElementById('schema-explorer')

m.route(root, '/', {
  '/': { render: (vnode) => m(Layout, m(Homepage, vnode.attrs)) },
  '/model/:id': { render: (vnode) => m(Layout, m(Schema, vnode.attrs)) }
})
