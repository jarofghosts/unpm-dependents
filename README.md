&mu;npm-dependents
====

provides dependedUpon for [&mu;npm](http://npm.im/unpm)

## usage

```js
var unpm = require('unpm')
var dependents = require('unpm-dependents')

var unpm_instance = unpm()
dependents(unpm_instance)
```

## notes

adds a resource that responds to GET requests at `/-/_view/dependedUpon/`. in
order to maintain parity with npm, GET requests to this resource must inclue
*at least* `startkey` as a query parameter. `startkey` specifies the module for
which you want dependencies, and its value must be a JSON array with the module
name as its only element. it should look like: `["modulename"]`.

## license

MIT
