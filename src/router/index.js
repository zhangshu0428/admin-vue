import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/login';
import home from '@/views/home';
import users from '@/views/users/users';
import rights from '@/views/rights/rights';
import roles from '@/views/rights/roles';
import categories from '@/views/goods/categories';
import goods from '@/views/goods/goods';

Vue.use(Router);

export default new Router({
  routes: [
    { name: 'login', path: '/login', component: login },
    {
      name: 'home',
      path: '/',
      component: home,
      children: [
        { name: 'users', path: '/users', component: users },
        { name: 'rights', path: '/rights', component: rights },
        { name: 'roles', path: '/roles', component: roles },
        { name: 'categories', path: '/categories', component: categories },
        { name: 'goods', path: '/goods', component: goods }
      ]
    }
  ]
});
