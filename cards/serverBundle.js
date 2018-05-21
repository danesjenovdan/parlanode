import Vue from 'vue';
import request from 'request';
import SearchDropdown from 'parlassets/components/SearchDropdown.vue';
import Card from 'cardPath/card.vue';

global.$ = {
  getJSON(url, callback) {
    request(url, (error, response, body) => {
      if (error) throw error;
      callback(JSON.parse(body));
    });
  },
  get(url, callback) {
    request(url, (error, response, body) => {
      if (error) throw error;
      callback(body);
    });
  },
};
Vue.component('SearchDropdown', SearchDropdown);

// the default export should be a function
// which will receive the context of the render call
export default (context) => {
  // console.log('logging what came in');
  // console.log(context);

  // const cardState = JSON.parse(JSON.stringify(context.parlaState));

  // THIS NEEDS A REWORK BECAUSE BRAINFUCK
  context.state = {
    data: context.data,
    cardData: context.cardData,
    parlaState: context.parlaState,
  };

  // console.log('logging what goes out');
  // console.log(context);

  const app = new Vue(Object.assign({}, Card, { cardData: context }));
  return new Promise(resolve => resolve(app));
};
