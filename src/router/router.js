/* eslint-disable prettier/prettier */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const commonRoutes = [
  {
    path: "/login",
    name: "Login",
    // component: () =>import("@/views/pages/backmanager/finance/zhlsjl.vue")
    component: () =>import("@/views/login.vue")
  },
  
  
  {
    path: "/",
    name: "homeL",
    "redirect": "/home",
    component: () => import("@/views/home/home.vue"),
    "meta": {
      "title": "首页",
      "icon": "el-icon-s-custom"
    },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home.vue"),
        "meta": {
          "title": "欢迎",
          "icon": "el-icon-s-custom"
        },
      },
      {
        path: "/404",
        name: "404",
        component: () =>import("@/views/404.vue")
      },
    ],


  },
  { path: '/', redirect: '/home' },
]

const createRouter = () => new Router({
  routes: commonRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
