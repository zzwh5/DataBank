import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import WebData from '../views/web_data.vue'
import Data from '../views/Data.vue'
import layout from '../components/Layout.vue'
// import Preview from '../views/pewview.vue'
import Login from "../views/login.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: layout,
    redirect: '/data',
    meta: { hasChildren: true, title: '资料中心' },
    children: [
      {
        path: 'data',
        name: 'Data',
        component: Data,
        redirect: '/data/index',
        meta: { title: '资料中心', icon: 'database' },
        children: [
          {
            path: '/data/index',
            name: 'DataIndex',
            component: Home,
            meta: { title: '资料中心', icon: 'database', parentName: 'Data' }
          },
          {
            path: '/data/user',
            name: 'DataUser',
            component: User,
            meta: { title: '用户管理', icon: 'user', parentName: 'Data' }
          }
        ]
      },
      {
        path: 'webData',
        name: 'WebData',
        component: WebData,
        meta: { title: '资料中心', icon: 'database' },
        children: [
          {
            path: '/webData/index',
            name: 'WebDataIndex',
            component: WebData,
            meta: { title: '资料中心', icon: 'database', parentName: 'WebData' }
          }
        ]
      }
    ]
  },
  // {
  //   path: '/preview',
  //   name: 'Preview',
  //   component: Preview,
  //   meta: { title: '预览文件', icon: 'database' }
  // },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', icon: 'database' }
  }
]
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
