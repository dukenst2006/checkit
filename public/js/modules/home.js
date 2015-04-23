define([
  'vue',
  'services/auth',
  'services/firebase',
  'text!./home.html',
  'directives/editor',
  'directives/colorize'
], function(Vue, Auth, firebase, template) {

  function scrollY() {
    return window.pageYOffset || window.document.documentElement.scrollTop;
  }

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

      return {
        testsLoaded: false,
        test: { name: null, code: '' },
        tests: firebase.collection(firebase.child('tests').child(Auth.user.uid))
      }
    },

    compiled: function() {
      firebase.child('tests').child(Auth.user.uid).on('value', function() {
        this.$data.testsLoaded = true
      }.bind(this))
    },

    ready: function() {
      gridItemsContainer = document.querySelector('.items')
      editor = document.querySelector('.editor')
      closeCtrl = editor.querySelector('.editor-close')
    },

    methods: {

      submit: function(event) {
        event.preventDefault()
        var ref = firebase.child('tests').child(Auth.user.uid)

        if (this.$data.test.id) {
          ref.child(this.$data.test.id).set(this.$data.test)
        } else {
          ref.push(this.$data.test)
        }

        this.hideEditor()
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

        this.$data.test = test || {
          code: '',
          name: 'Please explain HERE what your test do'
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

        editor.classList.remove('__show');
        closeCtrl.classList.remove('__show');

        this.$data.test = {}

        onTransitionEnd(placeholder, function() {
          //editor.parentNode.scrollTop = 0
          placeholder.parentNode.removeChild(placeholder)
          item.classList.remove('__current')
        })

        var coords = this.itemCoords(item)

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
