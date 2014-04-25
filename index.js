var concat = require('concat-stream')

var get_dependencies = require('./lib/get-dependencies')
  , get_description = require('./lib/get-description')

module.exports = setup

function setup(unpm) {
  var dependents = {}

  unpm.backend.createMetaStream().pipe(concat(build_initial))
  unpm.router.add('get', '/-/_view/dependedUpon', serve_dependents)

  function build_initial(data) {
    var deps = {}

    var module_deps
      , current
      , module
      , dep

    for(var i = 0, l = data.length; i < l; ++i) {
      module = data[i]
      module_deps = get_dependencies(module)

      for(var j = 0, k = module_deps.length; j < k; ++j) {
        dep = module_deps[j]
        deps[dep] = deps[dep] || []
        deps[dep].push({
            name: module.key
          , description: get_description(module)
        })
      }
    }

    unpm.backend.set('unpm-dependents', deps)
    unpm.backend.on('setMeta', update_deps)

    function update_deps(name, data, old_data) {
      var old_deps = get_dependencies(old_data)
        , new_deps = get_dependencies(data)

      for(var i = 0, l = old_deps.length; i < l; ++i) {
        if(new_deps.indexOf(old_deps[i]) === -1) {
          if(!deps[old_deps[i]]) continue
          deps[old_deps[i]].splice(deps[old_deps[i]].indexOf(name), 1)
        }
      }

      for(var i = 0, l = new_deps.length; i < l; ++i) {
        deps[new_deps[i]] = deps[new_deps[i]] || []
        if(deps[new_deps[i]].indexOf(name) === -1) {
          deps[new_deps[i]].push(name)
        }
      }

      unpm.backend.set('unpm-dependents', deps)
    }
  }

  function serve_dependents(context, route, respond) {
    var start = route.query.startkey
      , module

    // to mirror official npm query of `["modulename"]`
    module = start.slice(2, -2)

    if(!module) return respond.not_found()

    unpm.backend.get('unpm-dependents', serve_deps)

    function serve_deps(err, data) {
      if(err || !data || !data[module]) return respond.not_found()

      respond(null, 200, {rows: data[module].map(to_output)})
    }

    function to_output(el) {
      return {key: [module, el.name, el.description], value: 1}
    }
  }
}
