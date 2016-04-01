define([
  'vue'
], function(Vue) {

  function ago(timestamp) {
    var seconds = Math.floor((new Date() - new Date(timestamp)) / 1000)
    var interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
      return interval + ' years'
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + ' months'
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + ' days'
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + ' hours'
    }
    interval = Math.floor(seconds / 60)
    if (interval > 1) {
      return interval + ' minutes'
    }
    return Math.floor(seconds) + ' seconds'
  }

  return Vue.directive('ago', {

    bind: function() {
      this.interval = setInterval(function() {
        if (this.timestamp) {
          this.el.innerText = ago(this.timestamp)
        }
      }.bind(this), 1000)
    },

    update: function (timestamp) {
      this.timestamp = timestamp
      this.el.innerText = ago(timestamp)
    },

    unbind: function() {
      clearInterval(this.interval)
    }

  })
})
