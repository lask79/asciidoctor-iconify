'use strict'

const ospath = require('path')
const { name: packageName } = require('../../package.json')
const { partialFile } = require('./utils/asset-utils')

module.exports = function (context, { playbook, config }) {
  const logger = context.getLogger(packageName)

  logger.info('Start extension')
  logger.info(' > Register asciidoctor-iconify')
  playbook.asciidoc.extensions.push('asciidoctor-iconify')

  context.on('uiLoaded', async ({ playbook, uiCatalog }) => {
    logger.info('Handle UICatalog files ...')

    const extensionContext = {
      logger,
    }

    const { uiOutputDir, cacheDir = './.cache/antora' } = getDirectories(playbook)
    extensionContext.playbook = playbook
    extensionContext.uiCatalog = uiCatalog
    extensionContext.uiOutputDir = uiOutputDir
    extensionContext.cacheDir = cacheDir
    extensionContext.extensionCacheDir = ospath.join(cacheDir, '..', packageName)

    await processAssets(extensionContext)
  })

  function getDirectories (playbook) {
    return {
      uiOutputDir: playbook.ui.outputDir,
      cacheDir: playbook.runtime.cacheDir,
    }
  }

  async function processAssets (extensionContext) {
    copyIconfiyHbs(extensionContext)
  }

  function copyIconfiyHbs (extensionContext) {
    const { uiCatalog, uiOutputDir, logger } = extensionContext

    const basename = 'iconify-scripts.hbs'
    const assetDir = 'partials'

    partialFile(packageName, uiCatalog, logger, uiOutputDir, assetDir, basename)
  }
}
