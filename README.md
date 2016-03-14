# Check and Notifiy

- Check if a (twitter|github|...) username is free
- Test when a website goes down

- Test when a retweet is RT more than x times
- Test when a tweet have a reply, ...

- Test when a website become free
- Test when torvalds publish a new post on g+ (to be the first to comment)

- When there's full moon
- When webiste become famous (trafic +300% for example)

- When new StackOverflow question

# Install

```
# export env file (should run this manually after editting config/env file)
export $(cat config/env | xargs)
```

# IDEAS

- badge like github

# TODO

- rename test -> check
- notify() send mail
- 'isPending' in a new field
- remove 'done()' for sync tests
- when test open and editing, duplicate it (but don't run it) (maybe)
- test.output max length
- trim code, name
- move js/directives/editor to mixin
- add security tests for queue
- fix skipped test in chrome
