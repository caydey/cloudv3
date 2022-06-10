const isProd = (process.env.NODE_ENV === 'production')

module.exports = {
  transpileDependencies: !isProd, // re-compile dependencies for production
  productionSourceMap: false,
  filenameHashing: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/_colors.scss";
          @import "@/styles/_master.scss";
        `
      }
    }
  }
}