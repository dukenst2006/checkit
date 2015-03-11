define([
  'backbone',
  'config'
], function(Backbone, Config) {

  var Router = Backbone.Router.extend({

    initialize: function() {
      this.on('route', function(routeName, routeArgs) {
        this.routeName = routeName
        this.routeArgs = routeArgs
      })
    },

    start: function() {
      require(Config.MODULES, function() {
        var opts = { pushState: Config.PUSH_STATE }

        // fix to have router working with urls like http://fb-seed.dev/index.html
        if (/\/[a-z0-9]+(.html)$/.exec(location.pathname)) {
          opts.root = location.pathname
          opts.pushState = false
        }

        Backbone.$ = Zepto
        Backbone.history.start(opts)
      })
    },

    generateUrl: function(routeName) {
      var route = _.findWhere(Config.ROUTES, { name: routeName })

      if (!route) {
        console.warn('app: route "' + routeName + '" not found')
        return '#'
      }

      return '/' + route.url
    },

    navigateTo: function(routeName) {
      this.navigate(this.generateUrl(routeName), true)
    }

  })

  var routes = {}

  Config.ROUTES.forEach(function(route) {
    routes[route.url] = route.name
  })

  var router = new Router({ routes: routes })

  $(document).on('click', 'a:not([data-bypass])', function (event) {
    var href = $(this).attr('href')

    if (/https?\:\/\//.exec(href) || /^\/\//.exec(href)) {
      return
    }

    if (/^\/(js|css|lib|var)/.exec(href)) {
      return
    }

    event.preventDefault()
    router.navigate(href, true)
  })

  return router

})
