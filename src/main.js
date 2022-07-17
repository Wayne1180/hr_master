import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Components from '@/components'

import * as directives from '@/directives'

import * as filters from '@/filters'

import i18n from '@/lang'
import checkPermission from './mixin/checkPermission'

import '@/icons' // icon
import '@/permission' // permission control
import { options } from 'runjs'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  //element本身支持i18n的处理
  //此时i18n就会根据当前的locale属性去寻找对应的显示内容
  i18n: (key, value) => i18n.t(key) //t方法 会去对应的语言包里寻找对应的内容
})

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) //注册自定义指令
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) //注册自定义的过滤器
})

//注册自定义组件
Vue.use(Components)

//全局混入检查对象
Vue.mixin(checkPermission)   //表示所有的组件都拥有了检查的方法

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
