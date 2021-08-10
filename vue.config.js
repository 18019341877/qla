const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    port: 9191,
    open: true, //是否自动弹出浏览器页面
    host: "localhost",
    https: false,   //是否使用https协议
    hotOnly: true, //是否开启热更新
    proxy: {'/api':{
        target: "http://localhost:8080/ac-product",
        changeOrigin:true,
        pathRewrite:{
            '^/api':''
        }
    }}
  },
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
  },
  publicPath: './' // 导出 正式环境路径 使用 ././  测试 使用 ./  
}
