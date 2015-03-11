define(['vue', 'md5'], function(Vue, md5) {
  return Vue.filter('gravatar', function(email, size) {
    return 'http://www.gravatar.com/avatar/' + md5(email) + '.jpg?s=' + (size || 80)
  })
})
