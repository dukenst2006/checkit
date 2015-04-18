define([
  'vue',
  'services/firebase',
  'services/test-helper',
  'text!./home.html',
  'directives/editor',
  'directives/colorize'
], function(Vue, firebase, testHelper, template) {

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

  var gridItemsContainer, content, closeCtrl

  return Vue.component('dashboard_home', {

    layout: 'dashboard',

    inherit: true,

    template: template,

    data: function() {
      return {
        test: { name: null, code: '' },
        testHelper: testHelper,
        tests: firebase.collection(firebase.child('tests'))
      }
    },

    ready: function() {
      gridItemsContainer = document.querySelector('.items')
      content = document.querySelector('.content')
      closeCtrl = content.querySelector('.close-button')
    },

    methods: {

      submit: function(event) {
        event.preventDefault()
        firebase.child('tests').push(this.$data.test)
        this.hideContent()
      },

      loadContent: function(event, test) {
        var item = event.target.closest('.item') || event.target
        var placeholder = document.createElement('div')

        placeholder.classList.add('placeholder')
        placeholder.classList.add('__trans-in')

        placeholder.style.transform = placeholder.style.WebkitTransform = (
          'translate3d(' + item.offsetLeft + 'px, ' + item.offsetTop + 'px, 0px)' +
          'scale3d(' + item.offsetWidth / gridItemsContainer.offsetWidth + ',' + item.offsetHeight / viewPortY()  + ',1)'
        );

        if (!test) {
          this.$data.test = {
            code: '',
            name: 'Please explain HERE what your test do'
          }
        }

        requestAnimationFrame(function() {
          item.classList.add('current-grid-item')
          item.parentNode.appendChild(placeholder);

          requestAnimationFrame(function() {
            placeholder.style.WebkitTransform = placeholder.style.transform = 'translate3d(0px, ' + scrollY() + 'px, 0px)';
          })
        })

        onTransitionEnd(placeholder, function() {
          placeholder.classList.remove('__trans-in');
          placeholder.classList.add('__trans-out');

          content.style.top = scrollY() + 'px';
          content.classList.add('__show');
          closeCtrl.classList.add('__show');

          if (!test) {
            content.querySelector('input').select()
          }
        })
      },

      hideContent: function() {
        var placeholder = document.querySelector('.placeholder')
        var gridItem = document.querySelector('.current-grid-item')

        content.classList.remove('__show');
        closeCtrl.classList.remove('__show');

        requestAnimationFrame(function() {
          placeholder.style.WebkitTransform = placeholder.style.transform = (
            'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) ' +
            'scale3d(' + gridItem.offsetWidth / gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight / viewPortY() + ',1)'
          )
        })

        onTransitionEnd(placeholder, function() {
          content.parentNode.scrollTop = 0
          placeholder.parentNode.removeChild(placeholder)
          gridItem.classList.remove('current-grid-item')
        })
      }
    }
  })
})

