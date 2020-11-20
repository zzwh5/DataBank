<template>
  <a-layout id="components-layout-demo-responsive" style="height: 100vh">
    <a-layout-sider
      v-model="collapsed"
      width="15vw"
      breakpoint="lg"
      @collapse="onCollapse"
    >
      <div class="logo"></div>
      <SlideBar :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{
          background: '#fff',
          padding: '0',
          position: 'fixed',
          zIndex: 1,
          width: '100%'
        }"
      >
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
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
export default {
  components: {
    SlideBar
  },
  data() {
    return {
      collapsed: false
    }
  },
  created() {},
  methods: {
    onCollapse(collapsed, type) {
      // console.log(collapsed, type)
    },
    onBreakpoint(broken) {
      // console.log(broken)
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
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
