import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import layout from '../components/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: layout,
    redirect: '/data',
    meta: { hasChildren: false, title: '资料中心' },
    children: [
      {
        path: 'data',
        name: 'Data',
        component: Home,
        meta: { title: '资料中心', icon: 'database' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
