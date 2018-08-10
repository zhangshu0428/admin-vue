import axios from 'axios';
const myAxios = {};
myAxios.install = function (Vue) {
  // 将axios配置为全局的，不用每次都导入
  Vue.prototype.$http = axios;
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
};
export default myAxios;
