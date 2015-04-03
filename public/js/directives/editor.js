define([
  'vue',
  'rainbow',
  'behave'
], function(Vue, Rainbow, Behave) {

  return Vue.directive('editor', {

    bind: function() {
      this.textareaEl = this.el.querySelector('textarea')
      this.preEl = this.el.querySelector('pre')

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
      Rainbow.color(this.textareaEl.value, 'javascript', function(colorized) {
        this.preEl.innerHTML = colorized
      }.bind(this))
    }
  })
})
