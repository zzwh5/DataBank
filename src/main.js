import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 重置库
import './assets/style/reset.css'

// antd的组件库
import './util/import'

// 引入打印组件
// import Print from 'vue-print-nb'
// Vue.use(Print); //注册
// 路由进度条
// 导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置滚动条
NProgress.configure({ showSpinner: false, ease: 'ease', speed: 1500 })
// const whiteList = ['/user']
// 在路由守卫里去监控路由变化，从而触发进度条
// 路由变化时
router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start()

  next()
})

router.afterEach(() => {
  // 进度条结束
  NProgress.done()
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
