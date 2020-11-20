<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false
    }
  },
  created() {},
  methods: {
    onCollapse(collapsed, type) {
      console.log(collapsed, type)
    },
    onBreakpoint(broken) {
      console.log(broken)
    }
  }
}
</script>
<style lang="scss">
html {
  font-size: 10px !important;
}

// 滚动条样式
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
}
</style>
