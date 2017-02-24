import Vue from 'vue';
import SearchDropdown from 'parlassets/components/SearchDropdown.vue';
// eslint-disable-next-line
import Card from 'card';

Vue.component('SearchDropdown', SearchDropdown);

// the default export should be a function
// which will receive the context of the render call
export default (cardData) => {
  const app = new Vue(Object.assign({}, Card, { cardData }));

  return new Promise(resolve => resolve(app));
};
