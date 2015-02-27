module.exports = getDeps

function getDeps(module) {
  var current

  if(!module || !module.value || !module.value.versions || !module.key ||
      !module.value['dist-tags'] || !module.value['dist-tags'].latest) {
        return []
      }

  current = module.value['dist-tags'].latest

  return Object.keys(module.value.versions[current].dependencies || {})
}
