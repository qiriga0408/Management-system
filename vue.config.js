/* eslint-disable prettier/prettier */
// vue.config.js 配置说明
// 这里只列一部分，具体配置惨考文档啊
module.exports = {
    // baseUrl  type:{string} default:'/' 
    // 将部署应用程序的基本URL
    // 将部署应用程序的基本URL。
    // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
    // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.

    publicPath: process.env.NODE_ENV === 'production'? '/': '/', //baseUrl从 Vue CLI 3.3 起已弃用，请使用publicPath。
    // baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',

    // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'

    // outputDir: 'dist',

    // pages:{ type:Object,Default:undfind } 
/*
  构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
  个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
  的字符串，
  注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
*/
    // pages: {
        // index: {
            // entry for the page
            // entry: 'src/index/main.js',
            // the source template
            // template: 'public/index.html',
            // output as dist/index.html
            // filename: 'index.html'
        // },
        // when using the entry-only string format,
        // template is inferred to be `public/subpage.html`
        // and falls back to `public/index.html` if not found.
        // Output filename is inferred to be `subpage.html`.
        // subpage: 'src/subpage/main.js'
    // },

    //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
    lintOnSave: false,
    // productionSourceMap：{ type:Bollean,default:true } 生产源映射
    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,
    // devServer:{type:Object} 3个属性host,port,https
    // 它支持webPack-dev-server的所有选项
    devServer: {
        port: 8085, // 端口号
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: 'http://161.117.179.158:8182', //对应自己的接口 www.ybk.com   http://192.168.55.142:8085    https://wgfkg.ttoah.com   
                changeOrigin: true,
                // secure: false,
                ws: true,

                pathRewrite: {
                  '^/api':''
                }
            },
        }
    }
}