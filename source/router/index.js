import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import PageNotFoundPage from '../components/not-found-page.vue';
import FirstPage from '../components/first-page.vue';
import SecondPage from '../components/second-page.vue';

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: [
    {
      path: '/firstPage',
      component: FirstPage,
    },
    {
      path: '/secondPage',
      component: SecondPage,
    },
    {
      path: '*',
      component: PageNotFoundPage,
    },
  ],
});
