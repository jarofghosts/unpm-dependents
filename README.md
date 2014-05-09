&mu;npm-dependents
====

middleware providing dependedUpon for [&mu;npm](http://npm.im/unpm)

## usage

add `unpm-dependents` to your unpm middleware.

## notes

adds a resource that responds to GET requests at `/-/view/dependedUpon/`. in order to maintain parity with npm, GET
requests to this resource must inclue *at least* `startkey` as a query parameter. `startkey` specifies the module for which you want dependencies, and its value must be a JSON array with the module name as its only element. It should look like: `["modulename"]`.

## license

MIT
