/* eslint-disable */
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';
import sampleData from 'cardPath/data.json';
import urlsData from '../assets/urls.json';
import vocab from '../assets/vocab.json';

const fakeCardData = {
  cardData: {
    data: sampleData,
    state: {
      generator: true
    },
    cardData: Object.assign({
      altHeader: false,
    }, cardData),
    urlsData,
    vocab
  }
}

const app = new Vue(Object.assign({}, Card, fakeCardData));

app.$mount('#app');
