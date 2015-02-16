var concat = require('concat-stream')

var getDependencies = require('./lib/get-dependencies')
  , getDescription = require('./lib/get-description')

module.exports = setup

function setup(unpm) {
  var dependents = {}

  unpm.backend.createMetaStream().pipe(concat(buildInitial))
  unpm.router.add('get', '/-/_view/dependedUpon', serveDependents)

  function buildInitial(data) {
    var deps = {}

    var moduleDeps
      , current
      , module
      , dep

    for(var i = 0, l = data.length; i < l; ++i) {
      module = data[i]
      moduleDeps = getDependencies(module)

      for(var j = 0, k = moduleDeps.length; j < k; ++j) {
        dep = moduleDeps[j]
        deps[dep] = deps[dep] || []
        deps[dep].push({
            name: module.key
          , description: getDescription(module)
        })
      }
    }

    unpm.backend.set('unpm-dependents', deps)
    unpm.backend.on('setMeta', updateDeps)

    function updateDeps(name, data, oldData) {
      var oldDeps = getDependencies(oldData)
        , newDeps = getDependencies(data)

      for(var i = 0, l = oldDeps.length; i < l; ++i) {
        if(newDeps.indexOf(oldDeps[i]) === -1) {
          if(!deps[oldDeps[i]]) continue
          deps[oldDeps[i]].splice(deps[oldDeps[i]].indexOf(name), 1)
        }
      }

      for(var i = 0, l = newDeps.length; i < l; ++i) {
        deps[newDeps[i]] = deps[newDeps[i]] || []
        if(deps[newDeps[i]].indexOf(name) === -1) {
          deps[newDeps[i]].push(name)
        }
      }

      unpm.backend.set('unpm-dependents', deps)
    }
  }

  function serveDependents(respond, route) {
    var start = route.query.startkey
      , module

    // to mirror official npm query of `["modulename"]`
    module = start.slice(2, -2)

    if(!module) return respond.notFound()

    unpm.backend.get('unpm-dependents', serveDeps)

    function serveDeps(err, data) {
      if(err || !data || !data[module]) return respond.notFound()

      respond(null, 200, {rows: data[module].map(toOutput)})
    }

    function toOutput(el) {
      return {key: [module, el.name, el.description], value: 1}
    }
  }
}
