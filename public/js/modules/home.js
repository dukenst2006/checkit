define([
  'vue',
  'services/auth',
  'services/firebase',
  'text!./home.html',
  'directives/editor',
  'directives/colorize'
], function(Vue, Auth, firebase, template) {

  function viewPortY() {
    var client = window.document.documentElement.clientHeight;
    var inner = window.innerHeight;
    return client < inner ? inner : client;
  }

  function whichTransitionEvent(){
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for (var t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
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
    function (callback) { window.setTimeout(callback, 1000 / 60); }

  var gridItemsContainer, editor, closeCtrl

  return Vue.component('dashboard', {

    inherit: true,

    template: template,

    data: function() {
      if (!Auth.user.uid) return

      this.ref = firebase.child('tests').child(Auth.user.uid)

      return {
        testsLoaded: false,
        newName: null,
        test: { name: null, code: null, status: null, output: null, error: null },
        tests: firebase.collection(this.ref)
      }
    },

    ready: function() {
      gridItemsContainer = document.querySelector('.items')
      editor = document.querySelector('.editor')
      closeCtrl = editor.querySelector('.editor-close')

      this.ref.on('value', function() {
        this.$data.testsLoaded = true
      }.bind(this))
    },

    computed: {
      newName: {
        get: function() {
          return this.$data.test.name
        },
        set: function(name) {
          this.$data.newName = name
        }
      }
    },

    methods: {

      saveTest: function(andClose) {
        var test = this.$data.test

        // reset test
        test.status = 'pending'
        test.output = test.error = ''

        // fix test.code not always updated
        test.code = this.$el.querySelector('textarea').value

        // when backend loop is running this field keeps being updated,
        // we create a virtual property to let user being able to edit it.
        test.name = this.$data.newName

        if (test.id) {
          this.ref.child(test.id).set({
            name: test.name,
            code: test.code
          }, function() {
            this.pushQueue()
            andClose && this.hideEditor()
          }.bind(this))
        }

        else {
          this.ref.push(test).once('value', function() {
            this.$data.test = this.$data.tests[this.$data.tests.length - 1]
            this.pushQueue()
            document.querySelector('.__current').classList.remove('__current')
            andClose && this.hideEditor()
          }.bind(this))
        }
      },

      deleteTest: function() {
        if (!confirm('Are you sure you want to delete it?')) return false

        this.hideEditor()
        this.ref.child(this.$data.test.id).remove()
      },

      pushQueue: function() {
        firebase.child('queue').push([Auth.user.uid, this.$data.test.id])
      },

      loadEditor: function(event, test) {
        var item = event.target.closest('.item') || event.target
        var placeholder = document.createElement('div')

        placeholder.classList.add('placeholder')

        var coords = this.itemCoords(item)

        placeholder.style.transform = placeholder.style.WebkitTransform = (
          'translate3d(' + coords.left + 'px, ' + coords.top + 'px, 0px) ' +
          'scale3d(' + coords.width + ',' + coords.height + ',1)'
        );

        this.scrollTop = document.body.scrollTop
        document.body.scrollTop = 0
        document.body.classList.add('no-scroll')

        this.$data.test = test || {
          name: 'Please explain HERE what your test do',
          code: '',
          error: '',
          output: '',
          status: ''
        }

        item.classList.add('__current')
        item.parentNode.appendChild(placeholder);

        setTimeout(function() {
          placeholder.classList.add('__trans-in')
        }, 25)

        onTransitionEnd(placeholder, function() {
          requestAnimationFrame(function() {
            placeholder.style.WebkitTransform =
              placeholder.style.transform =
              'translate3d(0px, 0px, 0px)';
          })

          onTransitionEnd(placeholder, function() {
            placeholder.classList.remove('__trans-in');
            placeholder.classList.add('__trans-out');

            editor.classList.add('__show');
            closeCtrl.classList.add('__show');

            if (!test) {
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

        // new test, pick last one
        if (!item) {
          var items = document.querySelectorAll('.item.__saved')
          item = items[items.length - 1]
        }

        editor.classList.remove('__show');
        closeCtrl.classList.remove('__show');

        //this.$data.test = {}

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
