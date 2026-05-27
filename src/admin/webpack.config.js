const WebpackBar = require("webpackbar")

module.exports = (config, webpack) => {
  config.plugins = config.plugins.filter(
    (plugin) => !(plugin instanceof WebpackBar)
  )
  return config
}
