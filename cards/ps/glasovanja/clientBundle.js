import Card from './card.vue';

const app = new Vue(Card);

app.loadData(window.__INITIAL_STATE__);
app.$mount('#app');
