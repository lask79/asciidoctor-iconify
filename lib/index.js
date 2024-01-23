const toProc = require('./util/to-proc')

const registerAntoraExtension = require('./antora/extension')

function register (registry, context) {
  if (context?.playbook) {
    registerAntoraExtension(registry, context)
    return
  }

  if (!registry) return this.register('iconify', createExtensionGroup())
  registry.$groups().$store('iconify', toProc(createExtensionGroup()))
  return registry
}

function registerInlineMacro (context) {
  context.inlineMacro('iconify', function () {
    const self = this
    self.positionalAttributes('size')
    const defaultSize = '1em'
    const sizeMap = { '1x': '17px', lg: defaultSize, '2x': '34px', '3x': '50px', '4x': '68px', '5x': '85px' }

    self.process(function (parent, target, attrs) {
      const size = handleSize(attrs.size || attrs.height, defaultSize, sizeMap)
      const flip = handleFlip(attrs.flip)
      const title = handleTitle(attrs.title)
      const rotate = handleRotate(attrs.rotate)
      const role = handleRole(attrs.role)
      const result = `<iconify-icon inline icon="${target}"${size}${flip}${title}${rotate}${role}></iconify-icon>`
      const updatedResult = handleLink(attrs.link, attrs.window, result)
      return self.createInlinePass(parent, updatedResult)
    })
  })
}

function handleSize (sizeAttr, defaultSize, sizeMap) {
  let size
  if (sizeAttr && (sizeAttr.trim().endsWith('px') || sizeAttr.trim().endsWith('em'))) {
    size = sizeAttr
  } else if (sizeAttr && sizeMap[sizeAttr]) {
    size = sizeMap[sizeAttr]
  } else {
    size = defaultSize
  }

  return size ? ` height="${size}"` : ''
}

function handleFlip (flipAttr) {
  if (flipAttr && !['horizontal', 'vertical'].includes(flipAttr)) {
    throw new Error('flip attribute must be horizontal or vertical')
  }

  return flipAttr ? ` flip="${flipAttr}"` : ''
}

function handleTitle (titleAttr) {
  return titleAttr ? ` title="${titleAttr}"` : ''
}

function handleLink (linkAttr, windowAttr, result) {
  if (linkAttr) {
    const link = linkAttr.trim()

    const window = windowAttr ? ` target="${windowAttr}"` : ' target="_blank"'
    return `<a class="image" href="${link}"${window}>${result}</a>`
  }

  return result
}

function handleRotate (rotateAttr) {
  // support only 90, 180, 270
  if (rotateAttr && ![90, 180, 270].includes(parseInt(rotateAttr, 10))) {
    throw new Error('rotate attribute must be 90, 180, or 270')
  }
  return rotateAttr ? ` rotate="${rotateAttr}deg"` : ''
}

function handleRole (roleAttr) {
  return roleAttr ? ` class="${roleAttr}"` : ''
}

function registerDocInfoProcessor (context) {
  context.docinfoProcessor(function () {
    const self = this
    self.atLocation('footer')
    self.process(function (doc) {
      return '<script src="https://cdn.jsdelivr.net/npm/iconify-icon@1.0.8/dist/iconify-icon.min.js"></script>'
    })
  })
}

function createExtensionGroup () {
  return function () {
    registerInlineMacro(this)
    registerDocInfoProcessor(this)
  }
}

module.exports = { register }
