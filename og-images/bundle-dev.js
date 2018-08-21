import Vue from 'vue';
/* eslint-disable import/no-unresolved */
import og from '~/og.vue';
import params from '~/params.json';
/* eslint-enable import/no-unresolved */

window.app = new Vue({
  ...og,
  context: {
    params,
    env: process.env,
  },
});

window.app.$mount('#app');
