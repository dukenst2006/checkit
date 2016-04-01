(function(examples) {
  var $title, $editor, $next, $demo

  var exampleIndex = 0

  function addEventListener($el, eventName, handler) {
    if ($el.addEventListener) {
      $el.addEventListener(eventName, handler, false)
    } else {
      $el.attachEvent('on' + eventName, handler)
    }
  }

  function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      scrollTo(element, to, duration - 10);
    }, 10);
  }

  // ----

  function init() {
    $title = document.querySelector('.demo-title')
    $editor = document.querySelector('.demo-editor pre')
    $next = document.querySelector('.next')
    $demo = document.querySelector('.demo')

    addEventListener(document.querySelector('.btn-demo'), 'click', showDemo)
  }


  function showDemo() {
    $demo.style.display = 'block'
    addEventListener($next, 'click', nextExample)

    if (window.ga) {
      ga('send', 'event', 'App', 'show-example')
    }


    setTimeout(function() {
      run(examples[0])
      scrollTo(document.body, $demo.offsetTop, 400)
    }, 700)
  }

  function nextExample() {
    $next.classList.remove('__show')
    run(examples[exampleIndex])
  }

  function run(example) {
    $title.classList.remove('in')
    $editor.innerHTML = ''

    setTimeout(function() {
      $title.classList.add('in')
      $title.innerHTML = example.name.replace(/`([^`]+)`/g, '<code>$1</code>')

      setTimeout(function() {
        Rainbow.color(example.code, 'javascript', function(colorized) {
          write($editor, colorized, 40)
        })

        setTimeout(function() {
          $next.classList.add('__show')
        }, 2000)
      }, 600)
    }, 400)

    if (examples[exampleIndex + 1]) exampleIndex++
    else exampleIndex = 0
  }

  function write(element, code, delay) {
    var splitter = document.createElement('div')
    splitter.innerHTML = code
    var i = 0, nodes = splitter.childNodes
    var interval = setInterval(function() {
      var shift = nodes.item(i)
      element.innerHTML += shift.outerHTML || shift.nodeValue
      i++
      if (!nodes.item(i)) clearInterval(interval)
    }, delay)
  }

  document.addEventListener('DOMContentLoaded', init)
})(window.CHECKIT_EXAMPLES);
