define([
  'vue',
  'rainbow',
  'behave'
], function(Vue, Rainbow, Behave) {

  // https://github.com/ccampbell/rainbow/issues/177
  var codeToFix

  function fixCode(code) {
    var startsWithNewLine = /^(\r\n|\n|\r)/gm
    codeToFix = startsWithNewLine.test(code)
    return code.replace(startsWithNewLine, '')
  }

  function revertFixCode(code) {
    return codeToFix ? '\r\n' + code : code
  }

  return Vue.directive('editor', {

    bind: function() {
      this.textareaEl = this.el.querySelector('.editor-textarea')
      this.preEl = this.el.querySelector('.editor-pre')
      this.codeEl = this.el.querySelector('.editor-code')

      this.editor = new Behave({
        textarea: this.textareaEl,
        tabSize: 2,
        softTabs: true,
        autoIndent: true
      })

      this.textareaEl.addEventListener('keydown', this.colorize.bind(this))
      this.textareaEl.addEventListener('keyup', this.colorize.bind(this))

      // synchronize scroll
      this.textareaEl.addEventListener('scroll', function(event) {
        this.preEl.scrollTop = this.textareaEl.scrollTop
      }.bind(this))
    },

    colorize: function() {
      Rainbow.color(fixCode(this.textareaEl.value), 'javascript', function(colorized) {
        this.codeEl.innerHTML = revertFixCode(colorized)
      }.bind(this))
    }
  })
})
