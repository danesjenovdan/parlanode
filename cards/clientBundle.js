/* eslint-disable */
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';

const app = new Vue(Object.assign({}, Card, { cardData: window.__INITIAL_STATE__ }));

app.$mount(`#${cardData._id}`);
