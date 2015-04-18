define({

  data: function() {
    return {
      isOpen: false
    }
  },

  ready: function() {
    this.$el.addEventListener('click', function(event) {
      if (event.target.classList.contains('overlay')) {
        this.close();
      }
    }.bind(this))

    document.body.addEventListener('keyup', function(event) {
      if (event.keyCode === 27) { // Escape
        this.close();
      }
    }.bind(this))
  },

  methods: {
    open: function() {
      this.$data.isOpen = true
      this.$el.classList.add('active')
      this.$el.style.display = 'block'
      this.$emit.apply(this, ['open'].concat(arguments))
    },

    close: function() {
      this.$data.isOpen = false
      this.$el.classList.remove('active')
      this.$emit.apply(this, ['close'].concat(arguments))

      // wait for css animation
      setTimeout(function() {
        this.$el.style.display = 'none'
      }.bind(this), 300)
    }
  }
})
