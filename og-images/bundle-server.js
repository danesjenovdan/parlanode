import Vue from 'vue';
/* eslint-disable import/no-unresolved */
import og from '~/og.vue';
/* eslint-enable import/no-unresolved */

// the default export should be a function
// which will receive the context of the render call
export default (context) => {
  const app = new Vue({
    ...og,
    context: {
      params: context.params,
      urls: context.urls,
      env: process.env,
    },
  });
  return new Promise(resolve => resolve(app));
};
