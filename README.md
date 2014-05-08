&mu;npm-dependents
====

middleware providing dependedUpon for [&mu;npm](http://npm.im/unpm)

## usage

add `unpm-dependents` to your unpm middleware.

## notes

adds `/-/view/dependedUpon/` endpoint. in order to maintain parity with npm,
you must provide *at least* `startkey` as a parameter, which should look like:
`["modulename"]`.

## license

MIT
