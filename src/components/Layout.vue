<template>
  <a-layout id="components-layout-demo-responsive" style="height: 100vh">
    <a-layout-sider
      v-model="collapsed"
      width="15vw"
      breakpoint="lg"
      @collapse="onCollapse"
    >
      <div class="logo">文件管理中心</div>
      <SlideBar :collapsed="collapsed" :currentRoute="current_route" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{
          background: '#fff',
          padding: '0',
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'space-between',
          'box-sizing': 'border-box'
        }"
      >
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />

        <a-dropdown
          v-if="userInfo.username"
          style="margin-right: 22em"
          :trigger="['click']"
        >
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            {{ userInfo.username }} <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="0" @click="login_out"> 退出登录 </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          marginTop: '84px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px'
        }"
      >
        <transition name="slide-fade">
          <router-view />
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import SlideBar from '@/components/SlideBar.vue'
import { post } from '@/request/http'
import { message } from 'ant-design-vue'
export default {
  components: {
    SlideBar
  },
  data() {
    return {
      collapsed: false,
      current_route: {},
      // 用户信息
      userInfo: {
        username: ''
      }
    }
  },
  watch: {
    $route: {
      deep: true,
      handler: function (val, oldv) {
        // this.current_route = val
        let current_name = ''
        if (val.name == 'WebData' || val.name == 'Data') {
          current_name = val.name
        } else {
          current_name = val.meta.parentName
        }
        const routes = this.$router.options.routes.filter((v) => v.path == '/')
        this.current_route = routes[0].children.filter(
          (v) => v.name == current_name
        )[0]
      }
    }
  },
  created() {
    let current_name = ''
    if (this.$route.name == 'WebData' || this.$route.name == 'Data') {
      current_name = this.$route.name
    } else {
      current_name = this.$route.meta.parentName
    }
    const routes = this.$router.options.routes.filter((v) => v.path == '/')
    this.current_route = routes[0].children.filter(
      (v) => v.name == current_name
    )[0]
    if (localStorage.getItem('userInfo')) {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }
  },
  methods: {
    onCollapse(collapsed, type) {
      // console.log(collapsed, type)
    },
    onBreakpoint(broken) {
      // console.log(broken)
    },
    // 退出登录
    login_out() {
      const that = this
      localStorage.clear()
      post('/user/quit').then((res) => {
        if (res.code != 200) {
          message.error('系统系统，请稍后重试')
          return false
        }
        setTimeout(() => {
          that.$router.push({
            path: '/login'
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.slide-fade {
  position: absolute;
  left: 0;
  right: 0;
}
.slide-fade-enter-active {
  transition: all 1.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(2, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  left: 0;
  right: 0;
  transform: translateX(50px);
  opacity: 0;
}

#components-layout-demo-responsive .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-responsive .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.5);
  margin: 16px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
