var m = require('mithril')
var showdown = require('showdown')
//var vars = require('../variables')

var converter = new showdown.Converter()
var readme = null

module.exports = {
  oninit: function() {
    m.request({
      url: 'https://opencrypto-io.github.io/schema/README.md',
      deserialize: value => {return value},
    }).then(data => {
      readme = data
    })
  },
  view: function() {
    if (!readme) {
      return m('div', 'Loading ..')
    }
    return m('.content', m.trust(converter.makeHtml(readme)))
  }
}
