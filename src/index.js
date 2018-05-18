var m = require('mithril')
var Layout = require('./views/Layout')

var SchemaController = require('./views/Schema')
var HomepageController = require('./views/Homepage')

m.route(document.getElementById('content'), "/", {
  "/": {
    render: function(vnode) {
      return m(Layout, m(HomepageController, vnode.attrs))
    }
  },
  "/schema/:model": {
    render: function(vnode) {
      return m(Layout, m(SchemaController, vnode.attrs))
    }
  }
})
