// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/commom/style/reset.css'
import MyHttpServer from '@/plugins/http'

import MyBread from '@/commom/breadcrumb/breadcrumb.vue'
import moment from 'moment'
Vue.use(ElementUI)
Vue.use(MyHttpServer)
Vue.config.productionTip = false

// 数据处理过滤器全局
Vue.filter('fmtdate', v => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */

Vue.component(MyBread.name, MyBread)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
