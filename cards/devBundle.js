/* eslint-disable */
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';
import data from 'cardPath/data.json';
import state from 'stateJson';
import urlsData from '../assets/urls.json';
import vocab from '../assets/vocab.json';

const fakeCardData = {
  cardData: {
    data,
    state,
    cardData: Object.assign({
      altHeader: false,
    }, cardData),
    urlsData,
    vocab
  }
}

const app = new Vue(Object.assign({}, Card, fakeCardData));

app.$mount('#app');
