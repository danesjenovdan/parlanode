import Card from './card.vue';

const app = new Vue(Object.assign({}, Card, { cardData: window.__INITIAL_STATE__ }));

app.$mount('#app');
