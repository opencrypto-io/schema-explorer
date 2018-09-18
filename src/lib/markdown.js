const converter = new showdown.Converter()

module.exports = {
  render (text) {
    return converter.makeHtml(text)
  }
}
