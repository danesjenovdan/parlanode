/* globals Vue window */
import Card from './card.vue';

// eslint-disable-next-line no-underscore-dangle
const app = new Vue(Object.assign({}, Card, { cardData: window.__INITIAL_STATE__ }));

app.$mount('#app');
