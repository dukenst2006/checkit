define([
  'vue',
  'services/firebase',
  'services/test-helper',
  'text!./home.html'
], function(Vue, firebase, testHelper, template) {

  function scrollY() {
    return window.pageYOffset || window.document.documentElement.scrollTop;
  }

  function viewPortY() {
    var client = window.document.documentElement.clientHeight;
    var inner = window.innerHeight;
    return client < inner ? inner : client;
  }

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
      this.gridItemsContainer = document.querySelector('.items')
      this.content = document.querySelector('.content')
      this.closeCtrl = this.content.querySelector('.close-button')
    },

    methods: {

      submit: function(event) {
        event.preventDefault()
        firebase.child('tests').push(this.$data.test)
        this.hideContent()
      },

      loadContent: function(event, test) {
        var item = event.target.closest('.item')
        var dummy = document.createElement('div')

        dummy.classList.add('placeholder')
        dummy.classList.add('__trans-in')

        dummy.style.transform = dummy.style.WebkitTransform = (
          'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px)' +
          'scale3d(' + item.offsetWidth/this.gridItemsContainer.offsetWidth + ',' + item.offsetHeight/ viewPortY()  + ',1)'
        );

        this.gridItemsContainer.appendChild(dummy);

        if (!test) {
          this.$data.test = {
            code: '',
            name: 'Please explain HERE what your test do'
          }
        }

        item.classList.add('current')

        setTimeout(function() {
          dummy.style.WebkitTransform = dummy.style.transform = 'translate3d(0px, ' + scrollY() + 'px, 0px)';
        }, 25);

        setTimeout(function() {
          dummy.classList.remove('__trans-in');
          dummy.classList.add('__trans-out');

          this.content.style.top = scrollY() + 'px';
          this.content.classList.add('__show');
          this.closeCtrl.classList.add('__show');

          if (!test) {
            this.content.querySelector('input').select()
          }

        }.bind(this), 500);
      },

      hideContent: function() {
        var gridItem = this.gridItemsContainer.querySelector('.current')

        this.content.classList.remove('__show');
        this.closeCtrl.classList.remove('__show');

        setTimeout(function() {
          var dummy = this.gridItemsContainer.querySelector('.placeholder');

          dummy.style.WebkitTransform = dummy.style.transform = (
            'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) ' +
            'scale3d(' + gridItem.offsetWidth/this.gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight/viewPortY() + ',1)'
          )

          setTimeout(function() {
            this.content.parentNode.scrollTop = 0
            this.gridItemsContainer.removeChild(dummy)
            gridItem.classList.remove('current')
          }.bind(this), 500)
        }.bind(this), 25)
      }
    }
  })
})

