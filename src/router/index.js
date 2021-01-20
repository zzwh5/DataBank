import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import WebData from '../views/web_data.vue'
import layout from '../components/Layout.vue'
import Preview from '../views/pewview.vue'

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
        component: Home,
        meta: { title: '资料中心', icon: 'database' }
      },
      {
        path: 'webData',
        name: 'WebData',
        component: WebData,
        meta: { title: '资料中心', icon: 'database' }
      }
    ]
  },
  {
    path: '/preview',
    name: 'Preview',
    component: Preview,
    meta: { title: '预览文件', icon: 'database' }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
