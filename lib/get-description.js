module.exports = get_description

function get_description(module) {
  if(!module.value['dist-tags'] || !module.value['dist-tags'].latest ||
      !module.value.versions) return ''

  var current = module.value['dist-tags'].latest

  return module.value.versions[current].description || ''
}
