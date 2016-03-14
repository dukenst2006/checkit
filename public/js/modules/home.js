define([
  'vue',
  'services/auth',
  'services/firebase',
  'text!./home.html',
  'directives/editor',
  'directives/colorize'
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

  var gridItemsContainer, editor, closeCtrl

  return Vue.component('dashboard', {

    inherit: true,

    template: template,

    filters: {
      formatNotif: function(notif) {
        return '<i>[' + new Date(notif[1]).toLocaleString() + ']</i> ' + notif[0]
      }
    },

    data: function() {
      if (!Auth.user.uid) throw new Error('must be logged')

      this.ref = firebase.child('checks').child(Auth.user.uid)

      return {
        checksLoaded: false,
        check: { name: null, code: null, status: null, output: null, pending: null, error: null, notifs: [] },
        checks: firebase.collection(this.ref)
      }
    },

    ready: function() {
      gridItemsContainer = document.querySelector('.items')
      editor = document.querySelector('.editor')
      closeCtrl = editor.querySelector('.editor-close')

      this.ref.once('value', function() {
        this.$data.checksLoaded = true
      }.bind(this))

      this.checkListener = function(snap) {
        var updated = snap.val()
        if (updated) {
          this.$data.check.status = updated.status
          this.$data.check.pending = updated.pending
          this.$data.check.notifs = updated.notifs
          this.$data.check.output = updated.output
          this.$data.check.error = updated.error
        }
      }.bind(this)
    },

    beforeDestroy: function() {
      if (this.$data.check && this.$data.check.id) {
        this.ref.child(this.$data.check.id).off('value', this.checkListener)
      }
    },

    methods: {

      onEditorKeypress: function(event) {
        if (event.keyCode === 13 && event.metaKey) {
          event.preventDefault()
          this.saveCheck()
        }
      },

      saveCheck: function() {
        var check = this.$data.check

        requestAnimationFrame(function() {
          check.pending = true

          // reset check
          if (check.status === 'fail') {
            check.output = check.error = ''
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
            this.$data.check = Object.assign({}, this.$data.checks[this.$data.checks.length - 1])
            this.ref.child(this.$data.check.id).on('value', this.checkListener)
            this.pushQueue()
            document.querySelector('.__current').classList.remove('__current')
          }.bind(this))
        }
      },

      deleteCheck: function() {
        if (!confirm('Are you sure you want to delete it?')) return false

        this.hideEditor()
        this.ref.child(this.$data.check.id).remove()
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
        var classList = this.$$.editorMessage.classList
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

        this.$data.check = check ? Object.assign({}, check) : {
          name: 'Checking something ..',
          code: [
            "// exemple of an assertion, documentation here : https://nodejs.org/api/assert.html",
            "assert.ok(true, 'this assertion pass');",
            "",
            "// console.log() is useful to print/debug any value",
            "console.log('this will be printed in the output window');"
          ].join('\n'),
          error: '',
          output: '',
          status: ''
        }

        item.classList.add('__current')
        item.parentNode.appendChild(placeholder)

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

        if (this.checkListener && this.$data.check.id) {
          this.ref.child(this.$data.check.id).off('value', this.checkListener)
        }

        editor.classList.remove('__show')
        closeCtrl.classList.remove('__show')

        //this.$data.check = {}

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
          left: isNew ? gridItem.offsetLeft - 5 : gridItem.offsetLeft,
          top: isNew ? gridItem.offsetTop - 5 :  gridItem.offsetTop,
          width: isNew
            ? (gridItem.offsetWidth + 10) / gridItemsContainer.offsetWidth
            : gridItem.offsetWidth / (gridItemsContainer.offsetWidth - 20),
          height: isNew
            ? (gridItem.offsetHeight + 10) / (viewPortY() - 70)
            : gridItem.offsetHeight / (viewPortY() - 70)
        }
      }
    }
  })
})
