const isProd = (process.env.NODE_ENV === 'production')

module.exports = {
  transpileDependencies: !isProd, // re-compile dependencies for production
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/_colors.scss";
          @import "@/styles/_master.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    config.performance.maxAssetSize(1_000_000)
  }
}