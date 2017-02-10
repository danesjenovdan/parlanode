import Vue from 'vue';
import Card from './Card.vue';

const app = new Vue(Card);

// the default export should be a function
// which will receive the context of the render call
export default (cardData) => {
  app.loadData(cardData);
  const promise = new Promise((resolve) => { resolve(app); });
  return promise;
};
