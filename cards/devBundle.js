/* eslint-disable */
import Vue from 'vue';
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';
import data from 'cardPath/data.json';
import state from 'cardPath/state.json';

const fakeCardData = {
  cardData: {
    data,
    state,
    cardData: {
      altHeader: false,
      ...cardData,
    },
  }
}

const app = new Vue(Object.assign({}, Card, fakeCardData));

app.$mount('#app');
