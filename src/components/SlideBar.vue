<!--  -->
<template>
  <div>
    <a-menu
      :default-selected-keys="[currentRoute.path]"
      :default-open-keys="[currentRoute.path]"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
    >
      <a-menu-item :key="currentRoute.path" @click="goRoute(currentRoute.path)">
        <a-icon type="database" />
        <span> {{ currentRoute.meta.title }}</span>
      </a-menu-item>
      <!-- <template v-for="item in Routes">
        <template v-if="item.meta.hasChildren"> -->
      <!--  vue组件自己调用自己  -->
      <!-- <sub-Menu :key="item.path" :menuInfo="item" :goRoute="goRoute" />
        </template>
        <template v-else>
          <a-menu-item :key="item.path" @click="goRoute(item.path)">
            <a-icon type="database" />
            <span> {{ item.meta.title }}</span>
          </a-menu-item>
        </template>
      </template> -->
    </a-menu>
  </div>
</template>

<script>
// 引入 submenu组件 \
// import SubMenu from './SubMenu'
// 引入 Menu组件
// import { Menu } from 'ant-design-vue'
// const SubMenu = {
//   template: `
//       <a-sub-menu :key="menuInfo.path" v-bind="$props" v-on="$listeners">
//         <span slot="title">
//           {{ menuInfo.meta.title }}
//         </span>
//        <template v-for="v in menuInfo.children">
//           <template v-if="v.meta.hasChildren">
//             <!--  vue组件自己调用自己  -->
//             <sub-Menu :key="v.path" :item="v" />
//           </template>
//           <template v-else>
//             <a-menu-item :key="v.path" @click="goRoute(v.path)">
//               {{ v.meta.title }}
//             </a-menu-item>
//           </template>
//         </template>
//       </a-sub-menu>
//     `,
//   name: 'SubMenu',
//   // must add isSubMenu: true
//   isSubMenu: true,
//   props: {
//     ...Menu.SubMenu.props,
//     // Cannot overlap with properties within Menu.SubMenu.props
//     menuInfo: {
//       type: Object,
//       default: () => ({})
//     },
//     goRoute: {
//       type: Function
//     }
//   }
// }
export default {
  components: {
    // SubMenu
  },
  props: {
    collapsed: {
      type: Boolean
    },
    currentRoute: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      // 路由数组
      Routes: []
    }
  },
  watch: {},
  created() {
    // console.log(this.$router.options.routes)
    this.Routes = this.$router.options.routes.filter(
      (v) => v.meta.title != '登录'
    )
    console.log(this.Routes)
  },
  methods: {
    // 路由跳转
    goRoute(path) {
      if (path == '/') {
        path = '/data'
      }
      console.log(path)
      if (this.$route.path != '/' + path) {
        this.$router.push({
          path: path
        })
      }
    }
  }
}
</script>


<style  scoped lang='scss'>
// ant-menu-item
/deep/.ant-menu-inline {
  .ant-menu-item {
    display: flex;
    align-items: center;
    span {
      a {
        color: rgba(255, 255, 255, 0.65);
        &:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>
