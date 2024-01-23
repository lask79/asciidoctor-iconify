const { describe, it, expect, beforeAll } = require('@jest/globals')
const matchers = require('jest-extended')
expect.extend(matchers)
const path = require('path')

const asciidoctor = require('@asciidoctor/core')()
const asciidoctorIconify = require('../lib/index.js')

function loadAsciiDoc (text, registry) {
  return asciidoctor.convert(text, { extension_registry: registry })
}

describe('Registration', () => {
  it('should register the extension', () => {
    const registry = asciidoctor.Extensions.create()

    expect(registry.getGroups()).toStrictEqual({})
    asciidoctorIconify.register(registry)
    expect(registry.getGroups()).toHaveProperty('iconify')
  })
})

describe('Full Test', () => {
  it('should render full page', () => {
    const registry = asciidoctor.Extensions.create()
    asciidoctorIconify.register(registry)

    const input = path.join(__dirname, 'inputs/index.adoc')

    asciidoctor.convertFile(input, {
      extension_registry: registry,
      standalone: true,
      safe: 'safe',
      attributes: { linkcss: false },
    })
  })
})

describe('inline macro - iconify:<target>[<attributes>]', () => {
  let registry

  beforeAll(() => {
    registry = asciidoctor.Extensions.create()
    asciidoctorIconify.register(registry)
  })

  describe('default', () => {
    it('renders with default settings', () => {
      const input = 'iconify:cil:locomotive[]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em"></iconify-icon>'
      )
    })
  })

  describe('size', () => {
    it('renders with height 16px', () => {
      const input = 'iconify:cil:locomotive[16px]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="16px"></iconify-icon>'
      )
    })

    it('renders with 2em', () => {
      const input = 'iconify:cil:locomotive[2em]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="2em"></iconify-icon>'
      )
    })

    it('renders with height size 1x = 17px', () => {
      const input = 'iconify:cil:locomotive[1x]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="17px"></iconify-icon>'
      )
    })

    it('renders with height size 2x = 34px', () => {
      const input = 'iconify:cil:locomotive[2x]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="34px"></iconify-icon>'
      )
    })

    it('renders with height size 3x = 50px', () => {
      const input = 'iconify:cil:locomotive[3x]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="50px"></iconify-icon>'
      )
    })

    it('renders with height size 4x = 68px', () => {
      const input = 'iconify:cil:locomotive[4x]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="68px"></iconify-icon>'
      )
    })

    it('renders with height size 5x = 85px', () => {
      const input = 'iconify:cil:locomotive[5x]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="85px"></iconify-icon>'
      )
    })

    it('renders with height attribute = 40px', () => {
      const input = 'iconify:cil:locomotive[height=40px]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="40px"></iconify-icon>'
      )
    })
  })

  describe('flip', () => {
    it('renders with flip=horizontal', () => {
      const input = 'iconify:cil:locomotive[flip=horizontal]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em" flip="horizontal"></iconify-icon>'
      )
    })

    it('renders with flip=vertical', () => {
      const input = 'iconify:cil:locomotive[flip=vertical]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em" flip="vertical"></iconify-icon>'
      )
    })

    it('throws error when flip value is not supported', () => {
      const input = 'iconify:cil:locomotive[flip=something]'
      const doc = () => loadAsciiDoc(input, registry)

      expect(doc).toThrowError('flip attribute must be horizontal or vertical')
    })
  })

  describe('title', () => {
    it('renders with title', () => {
      const input = 'iconify:cil:locomotive[title=locomotive]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em" title="locomotive"></iconify-icon>'
      )
    })
  })

  describe('link', () => {
    it('renders with link', () => {
      const input = 'iconify:cil:locomotive[link=https://www.google.com]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<a class="image" href="https://www.google.com" target="_blank"><iconify-icon inline icon="cil:locomotive" height="1em"></iconify-icon></a>'
      )
    })

    it('renders with link with target _self', () => {
      const input = 'iconify:cil:locomotive[link=https://www.google.com, window="_self"]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<a class="image" href="https://www.google.com" target="_self"><iconify-icon inline icon="cil:locomotive" height="1em"></iconify-icon></a>'
      )
    })
  })

  describe('rotate', () => {
    it('renders with rotate=90', () => {
      const input = 'iconify:cil:locomotive[rotate=90]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em" rotate="90deg"></iconify-icon>'
      )
    })

    it('renders with rotate=180', () => {
      const input = 'iconify:cil:locomotive[rotate=180]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em" rotate="180deg"></iconify-icon>'
      )
    })

    it('renders with rotate=270', () => {
      const input = 'iconify:cil:locomotive[rotate=270]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em" rotate="270deg"></iconify-icon>'
      )
    })

    it('throws error when rotate value is not supported', () => {
      const input = 'iconify:cil:locomotive[rotate=45]'
      const doc = () => loadAsciiDoc(input, registry)

      expect(doc).toThrowError('rotate attribute must be 90, 180, or 270')
    })
  })

  describe('role', () => {
    it('renders with role=red', () => {
      const input = 'iconify:cil:locomotive[role=red]'
      const doc = loadAsciiDoc(input, registry)

      expect(doc).toContain(
        '<iconify-icon inline icon="cil:locomotive" height="1em" class="red"></iconify-icon>'
      )
    })
  })
})
