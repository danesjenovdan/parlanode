import Vue from 'vue';
import SearchDropdown from 'parlassets/components/SearchDropdown.vue';
import Card from './card.vue';

const app = new Vue(Card);
Vue.component('SearchDropdown', SearchDropdown);

// the default export should be a function
// which will receive the context of the render call
export default (cardData) => {
  app.loadData(cardData);

  return new Promise((resolve) => {
    resolve(app);
  });
};
