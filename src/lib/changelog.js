
const isLocal = window.location.hostname === 'localhost'
const changelogUrl = isLocal ?
  '/schema/build/changelog.json' : 'https://schema.opencrypto.io/build/changelog.json'

var changelog = null

module.exports = {
  load () {
    return m.request(changelogUrl).then((data) => {
      return data
    })
  }
}
