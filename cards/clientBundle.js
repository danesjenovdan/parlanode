/* globals Vue window */

// eslint-disable-next-line
import Card from 'card';

// eslint-disable-next-line no-underscore-dangle
const app = new Vue(Object.assign({}, Card, { cardData: window.__INITIAL_STATE__ }));

app.$mount('#app');
