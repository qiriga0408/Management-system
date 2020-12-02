import router from './router/router'
import { resetRouter } from './router/router'
// import { Message } from 'element-ui'
import axios from 'axios'
const _import = require('@/router/_import_' + process.env.NODE_ENV)//获取组件的方法
import Layout from '@/views/home/home' //Layout 是架构组件，不在后台返回，在文件里单独引入
import threeView from '@/views/home/threeView' //threeView 是架构组件，不在后台返回，在文件里单独引入
import store from "./store";
import setToken from "@/http";

let _time = localStorage.getItem('ot')
    if(_time){
      if(new Date().getTime()-_time>0.5*60000){
        localStorage.clear()
      }
    }

var getRouter //用来获取后台拿到的路由
// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
  if (getObjArr("token") && getObjArr("router")) {
    setToken.getInstance().setToken(getObjArr("token"))
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (hasMenus) {
        next()
      } else {
        try {
          // axios.get('https://www.easy-mock.com/mock/5d4ab95a334a102e1be864a0/example/mockRouterData').then(res => {
          // })
          getRouter = getObjArr('router')//后台拿到路由
          let unfound = { path: '*', redirect: '/404', hidden: true }
          getRouter.push(unfound)
          saveObjArr('router', getRouter) //存储路由到localStorage
          routerGo(to, next)//执行路由跳转方法
          // next({path: to.path || '/'})
        } catch (error) {
          // 退出登陆 清除用户资料
          localStorage.removeItem('token')
          // 重设路由
          resetRouter()
          next({path:'/login',query:{redirect:to.fullPath}})
        }
      }
    }
  } else {
    hasMenus = false
    if (to.path === '/login') {
      next()
    } else {
      next({path:'/login',query:{redirect:to.fullPath}})
    }
  }
  if (getObjArr('models')) {
    store.commit("setQx", getObjArr('models'));
  }
})

function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter) //过滤路由
  console.log('过滤路由', getRouter)
  router.addRoutes(getRouter) //动态添加路由
  // console.log(router)
  hasMenus = true
  store.commit("setRouterData", getRouter)//将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({ ...to, replace: true })
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
  localStorage.setItem(name, JSON.stringify(data))
}

function getObjArr(name) { //localStorage 获取数组对象的方法
  return JSON.parse(window.localStorage.getItem(name));
}

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {//Layout组件特殊处理
        route.component = Layout
      } else if (route.component === 'threeView') {
        route.component = threeView
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
