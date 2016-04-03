// TITLE Check for new posts on `martinfowler.com`

// fetch RSS feed
request('http://martinfowler.com/feed.atom', function(err, resp, body) {
  if (err) throw err;

  if (resp.statusCode == 200) {
    // get list of posts
    parseXml(body, function(err, result) {
      // date of last post
      var lastPostDate = result.feed.entry[0].updated[0];
      // is last post today?
      if (moment(lastPostDate).isSame(new Date(), 'day')) {
        // send notification/email
        notify('New post on martinfowler.com');
      } else {
        log('No new post on martinfowler.com');
      }
      done();
    });
  } else done();
});
