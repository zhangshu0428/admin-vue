import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/login';
import home from '@/views/home';
import users from '@/views/users/users';
import rights from '@/views/rights/rights';

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
        { name: 'rights', path: '/rights', component: rights }
      ]
    }
  ]
});
