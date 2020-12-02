const path = require('path')

module.exports = {
  // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '文件管理中心'
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },

  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  configureWebpack: {
    // externals: {
    //   // AMap: 'AMap', // 高德地图配置
    //   T: 'T' // 天地图
    //   // BMap: 'BMap', // 百度地图配置
    // }
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    }
  },
  // configureWebpack: (config) => {
  //   if (process.env.NODE_ENV === 'production') {
  //     // 生产环境
  //     config.mode = 'production'
  //   } else {
  //     // 开发环境
  //     config.mode = 'development'
  //   }
  // },
  // webpack-dev-server 相关配置
  devServer: {
    // host: 'localhost',
    // port: 8080,
    open: true,
    hot: true,
    // http 代理配置
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {},
  pwa: {
    iconPaths: {
      favicon32: './favicon.jpg',
      favicon16: './favicon.jpg',
      appleTouchIcon: './favicon.jpg',
      maskIcon: './favicon.jpg',
      msTileImage: './favicon.jpg'
    }
  }
}
