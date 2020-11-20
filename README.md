# project

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

<!--  ····· -->
<!-- 创建完项目之后 -->
<!-- 1、按需引入antd cnpm install ant-design-vue --save -->
<!-- 1）先下载 npm i babel-plugin-import --save-dev -->
<!-- 2）在.babelrc文件中配置对应的插件引入 -->
<!--
  "plugins": [
      [
          "import",
          {
              "libraryName": "ant-design-vue",
              "libraryDirectory": "lib",
              "style": "css"
          }
      ]
  ]
 -->
 <!-- 3)其次就是创建一个until/import文件来放这个按需引入的组件文件 -->
 <!-- 2、 引入eslint和prettierrc校验 -->
 <!-- 3、 配置vue.config.js文件 -->
 <!-- 4、 侧边栏组件 src/components/slideBar -->
 <!-- 5、 对于路由配置这里每个大的路由的component都是layout如果大的路由下面的子路由还有子路由就是在大陆有的子路由里面写上 <router-view></router-view> -->
