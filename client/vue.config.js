const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/_config.scss')]
    }
  },
  // remove default prefetch
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
  },

  outputDir: path.resolve(__dirname, '../server/public')
}
