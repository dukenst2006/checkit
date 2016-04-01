# Check It

```
CheckIt is a free service who executes Javascript code every 10 minutes to check whatever you want.
```

_Created by [@julesbou](https://twitter.com/julesbou). If you have feedback, send to [contact@check-it.io](mailto:contact@check-it.io)._

## Get started

Here's an example where you want to check when your website is down.

```js
// request() allows you to send http requests
request('http://example.com', function (err, resp, body) {

  // if response is not succesfull
  if (!err && resp.statusCode != 200) {

    // send notification (can send an email if enabled on settings page)
    notify('domain "example.com" is down');

  }

  done();
});
```

See more examples [here](https://check-it.io/)

## Methods

List of methods you can use:

Method | Description
--- | ---
`notify(message)` | send a notification
`log(args..)` | useful to debug
`once(key, callback)` | for a given key it will execute callback only once
`request(url, callback)` | send an http request, [see `request()` module](https://github.com/request/request)
`parseXml(str, callback)` | shortcut method of [`xml2js.parseString()`](https://github.com/Leonidas-from-XIV/node-xml2js)
`moment()` | [momentjs library](http://momentjs.com/docs/)
`done()` | required if your code is asynchronous, place it at the very end of your code execution

_You would like to see a method added here? [Create an issue and tell us](https://github.com/julesbou/checkit-help/issues/new)._

## Useful things to know

- Code can NOT take more than `10 seconds` to complete, else it will be timed-out.
- There's a mail limit set to `20`, meaning you can't receive more than `20 mails` per 24h.
- Undo/Redo in code editor doesn't works, this is a known bug.
- `notify()` send a mail only if in previous run it wasn't called.

## Troubleshooting

If you find difficulties here's a couple of steps to help you:

- Be sure `done()` is called if your code is asynchronous.
- Be sure `notify()` is called when your condition is met.
- Add as many `log()` as you want to debug.
- If you're using `request()` and expect a json response be sure to set `json` option to true.

If you still encounter difficulties or have any question, send us a mail at [contact@check-it.io](mailto:contact@check-it.io)
