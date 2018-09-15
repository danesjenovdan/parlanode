import Vue from 'vue';
/* eslint-disable import/no-unresolved */
import og from '~/og.vue';
import params from '~/params.json';
import urls from '../data/urls.json';
/* eslint-enable import/no-unresolved */

window.app = new Vue({
  ...og,
  context: {
    params,
    urls,
    env: process.env,
  },
});

window.app.$mount('#app');
