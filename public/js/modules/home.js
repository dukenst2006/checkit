define([
  'vue',
  'services/auth',
  'services/firebase',
  'text!./home.html',
  'directives/ago',
  'directives/editor'
], function(Vue, Auth, firebase, template) {

  function viewPortY() {
    var client = window.document.documentElement.clientHeight
    var inner = window.innerHeight
    return client < inner ? inner : client
  }

  function whichTransitionEvent(){
    var el = document.createElement('fakeelement')
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for (var t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t]
      }
    }
  }

  function onTransitionEnd(el, cb) {
    var transitionEvent = whichTransitionEvent()
    if (transitionEvent) {
      var once = function() {
        cb()
        el.removeEventListener(transitionEvent, once)
      }
      el.addEventListener(transitionEvent, once)
    } else {
      setTimeout(cb, 1000 / 60)
    }
  }

  window.requestAnimationFrame =
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function (callback) { window.setTimeout(callback, 1000 / 60) }

  var main, gridItemsContainer, editor, closeCtrl

  return Vue.component('dashboard', {

    inherit: true,

    template: template,

    filters: {
      formatName: function(name) {
        return name ? name.replace(/`([^`]+)`/g, '<code>$1</code>') : ''
      },
      formatNotif: function(notif) {
        return '<i>[' + new Date(notif[1]).toLocaleString() + ']</i> ' + notif[0]
      }
    },

    data: function() {
      if (!Auth.user.uid) throw new Error('must be logged')

      this.ref = firebase.child('checks').child(Auth.user.uid)

      return {
        checksLoaded: false,
        check: {},
        //check: { name: null, code: null, status: null, output: null, pending: null, error: null, notifs: [] },
        checks: firebase.collection(this.ref)
      }
    },

    ready: function() {
      main = document.querySelector('main')
      gridItemsContainer = document.querySelector('.items')
      editor = document.querySelector('.editor')
      closeCtrl = editor.querySelector('.editor-close')

      this.ref.once('value', function() {
        this.$data.checksLoaded = true
      }.bind(this))

      this.checkListener = function(snap) {
        var updated = snap.val()
        if (updated) {
          this.$data.check.ago = updated.ago
          this.$data.check.status = updated.status
          this.$data.check.pending = updated.pending
          this.$data.check.output = updated.output
          this.$data.check.error = updated.error
          this.$data.check.notifs = updated.notifs
        }
      }.bind(this)

      document.addEventListener('keydown', function(event) {
        if (this.$data.check.name && event.keyCode == 27) { // ESC
          this.hideEditor()
        }
      }.bind(this))
    },

    beforeDestroy: function() {
      if (this.$data.check && this.$data.check.id) {
        this.ref.child(this.$data.check.id).off('value', this.checkListener)
      }
    },

    methods: {

      openSettingsModal: function() {
        // TODO fixme settingsmodal => settingsModal
        this.$refs.settingsmodal.open()
      },

      onTextareaKeydown: function(event) {
        if (event.keyCode === 90 && event.metaKey) { // z
          event.preventDefault()
        } else {
          this.onKeydown(event)
        }
      },

      onKeydown: function(event) {
        if (event.keyCode === 13 && event.metaKey) { // ENTER
          event.preventDefault()
          this.saveCheck()
        }
      },

      saveCheck: function() {
        var check = this.$data.check

        requestAnimationFrame(function() {
          check.pending = true

          // reset check
          if (check.status === 'error') {
            //check.output = check.error = ''
          }
        })

        // fix check.code not always updated
        check.code = this.$el.querySelector('textarea').value

        if (check.id) {
          this.ref.child(check.id).update({
            name: check.name,
            code: check.code
          }, function() {
            this.pushQueue()
          }.bind(this))
        }

        else {
          this.ref.push(check).once('value', function() {
            this.$data.check = Object.assign({}, this.$data.check, this.$data.checks[this.$data.checks.length - 1])
            this.ref.child(this.$data.check.id).on('value', this.checkListener)
            this.pushQueue()
            document.querySelector('.__current').classList.remove('__current')
          }.bind(this))
        }
      },

      deleteCheck: function() {
        if (!confirm('Are you sure you want to delete it?')) return false

        this.ref.child(this.$data.check.id).remove()
        this.$data.check = {}
        this.hideEditor()
      },

      pushQueue: function() {
        firebase.child('queue').push([Auth.user.uid, this.$data.check.id])
      },

      toggleEditorMessageStatus: function() {
        this._toggleEditorMessage('__expand-status', '__expand-history')
      },

      toggleEditorMessageHistory: function() {
        this._toggleEditorMessage('__expand-history', '__expand-status')
      },

      _toggleEditorMessage: function(paneVisible, paneHidden) {
        // TODO fixme editormessage => editorMessage
        var classList = this.$els.editormessage.classList
        classList.remove(paneHidden)

        if (!classList.contains('__expand')) {
          classList.add('__expand')
        }

        if (classList.contains(paneVisible)) {
          classList.remove('__expand')
        }

        classList.toggle(paneVisible)
      },

      loadEditor: function(event, check) {
        var item = event.target.closest('.item') || event.target
        var placeholder = document.createElement('div')

        main.classList.add('__editor')
        placeholder.classList.add('placeholder')

        var coords = this.itemCoords(item)

        placeholder.style.transform = placeholder.style.WebkitTransform = (
          'translate3d(' + coords.left + 'px, ' + coords.top + 'px, 0px) ' +
          'scale3d(' + coords.width + ',' + coords.height + ',1)'
        )

        this.scrollTop = document.body.scrollTop
        document.body.scrollTop = 0
        document.body.classList.add('no-scroll')

        if (check) {
          this.ref.child(check.id).on('value', this.checkListener)
        }

        this.$data.check = check ? Object.assign({
          error: '',
          output: '',
          notifs: []
        }, check) : {
          name: 'Checking something ..',
          code: '',
          ago: '',
          pending: false,
          notifs: [],
          error: '',
          output: '',
          status: ''
        }

        item.classList.add('__current')
        item.parentNode.parentNode.appendChild(placeholder)

        setTimeout(function() {
          placeholder.classList.add('__trans-in')
        }, 25)

        onTransitionEnd(placeholder, function() {
          requestAnimationFrame(function() {
            placeholder.style.WebkitTransform =
              placeholder.style.transform =
              'translate3d(0px, 0px, 0px)'
          })

          onTransitionEnd(placeholder, function() {
            placeholder.classList.remove('__trans-in')
            placeholder.classList.add('__trans-out')

            editor.classList.add('__show')
            closeCtrl.classList.add('__show')

            if (!check) {
              editor.querySelector('input').select()
            }

            // force flex repaint
            // https://code.google.com/p/chromium/issues/detail?id=401185
            requestAnimationFrame(function() {
              editor.querySelector('input').style.display = 'block'
              requestAnimationFrame(function() {
                editor.querySelector('input').style.display = 'flex'
              })
            })
          })
        })
      },

      hideEditor: function() {
        var placeholder = document.querySelector('.placeholder')
        var item = document.querySelector('.__current')

        // new check, pick last one
        if (!item) {
          var items = document.querySelectorAll('.item.__saved')
          item = items[items.length - 1]
        }

        // check removal
        if (!this.$data.check.id) {
          item = document.querySelector('.check-something .btn')
        }

        if (this.checkListener && this.$data.check.id) {
          this.ref.child(this.$data.check.id).off('value', this.checkListener)
        }

        this.$data.check = {}

        main.classList.remove('__editor')
        editor.classList.remove('__show')
        closeCtrl.classList.remove('__show')

        var coords = this.itemCoords(item)

        document.body.scrollTop = this.scrollTop
        document.body.classList.remove('no-scroll')

        onTransitionEnd(placeholder, function() {
          placeholder.parentNode.removeChild(placeholder)
          item.classList.remove('__current')
        })

        requestAnimationFrame(function() {
          placeholder.style.WebkitTransform = placeholder.style.transform = (
            'translate3d(' + coords.left + 'px, ' + coords.top + 'px, 0px) ' +
            'scale3d(' + coords.width + ',' + coords.height + ',1)'
          )
        })
      },

      itemCoords: function(gridItem) {
        var isNew = ! gridItem.classList.contains('item')

        return {
          left: isNew ? gridItem.offsetLeft : gridItem.offsetLeft,
          top: isNew ? gridItem.offsetTop :  gridItem.offsetTop,
          width: isNew
            ? (gridItem.offsetWidth + 4) / gridItemsContainer.offsetWidth
            : gridItem.offsetWidth / (gridItemsContainer.offsetWidth - 20),
          height: isNew
            ? (gridItem.offsetHeight) / Math.min(viewPortY() - 70, 800)
            : gridItem.offsetHeight / Math.min(viewPortY() - 70, 800)
        }
      }
    }
  })
})
