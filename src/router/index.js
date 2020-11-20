import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import layout from '../components/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: layout,
    redirect: '/home',
    meta: { hasChildren: false, title: '首页' },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: { title: '首页' }
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
