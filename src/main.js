// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css';
import moment from 'moment';
import myAxios from '@/plugins/myAxios';
import MyBreadcrumb from '@/components/MyBreadcrumb';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(myAxios);
// 创建全局过滤器
Vue.filter('fmtDate', (value, fmtString) => {
  return moment(value).format(fmtString);
});
// 创建全局面包屑组件
Vue.component(MyBreadcrumb.name, MyBreadcrumb);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
