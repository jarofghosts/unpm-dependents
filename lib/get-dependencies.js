module.exports = get_deps

function get_deps(module) {
  if(!module.value.versions || !module.key || !module.value['dist-tags'] ||
      !module.value['dist-tags'].latest) return []

  current = module.value['dist-tags'].latest

  return Object.keys(module.value.versions[current].dependencies || {})
}
