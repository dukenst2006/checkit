define([
  'vue',
  'rainbow',
  'behave'
], function(Vue, Rainbow, Behave) {

  var startsWithNewLineReg = /^(\r\n|\n|\r)*/g
  var newLineReg = /\r\n|\r|\n/

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

    update: function(newVal, oldVal) {
      Vue.nextTick(this.colorize.bind(this))
    },

    colorize: function() {
      // https://github.com/ccampbell/rainbow/issues/177
      var breaksCount

      function fixCode(code) {
        breaksCount = code.match(startsWithNewLineReg)[0].split(newLineReg).length - 1
        return code.replace(startsWithNewLineReg, '')
      }

      function revertFixCode(code) {
        return breaksCount ? new Array(breaksCount + 1).join('\r\n') + code : code
      }

      Rainbow.color(fixCode(this.textareaEl.value), 'javascript', function(colorized) {
        this.codeEl.innerHTML = revertFixCode(colorized)
      }.bind(this))
    }
  })
})
