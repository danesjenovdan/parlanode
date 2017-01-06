// This ain't a production file, it's only used for demo/dev purposes along with index.html in root.

import Vue from 'vue';

import SearchDropdown from './SearchDropdown.vue';
import Tabs from './Tabs.vue';
import Tab from './Tab.vue';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: {
    SearchDropdown,
    Tab,
    Tabs,
  },
  data: {
    foo: 1,
    testGroups: [
      { label: 'lihi', items: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19] },
      { label: 'sodi', items: [2, 4, 6, 8, 10, 12, 14, 16, 18] },
    ],
    testItems: [
      { id: 1, label: 'Abecedni seznam', selected: false, count: '0' },
      { id: 2, label: 'Prisotnost na sejah DZ', selected: false, count: '123' },
      { id: 3, label: 'Prisotnost na glasovanjih sej DZ', selected: false },
      { id: 4, label: 'Besedni zaklad', selected: false },
      { id: 5, label: 'Št. izgovorjenih besed', selected: false },
      { id: 6, label: 'Št. govorov na sejo', selected: false },
      { id: 7, label: 'Privzdignjeno besedje', selected: false },
      { id: 8, label: 'Preprosto besedje', selected: false },
      { id: 9, label: 'Problematično besedje', selected: false },
      { id: 10, label: 'Abecedni seznam', selected: false },
      { id: 11, label: 'Prisotnost na sejah DZ', selected: false },
      { id: 12, label: 'Prisotnost na glasovanjih sej DZ', selected: false },
      { id: 13, label: 'Besedni zaklad', selected: false },
      { id: 14, label: 'Št. izgovorjenih besed', selected: false },
      { id: 15, label: 'Št. govorov na sejo', selected: false },
      { id: 16, label: 'Privzdignjeno besedje', selected: false },
      { id: 17, label: 'Preprosto besedje', selected: false },
      { id: 18, label: 'Problematično besedje', selected: false },
      { id: 19, label: 'Banane', selected: false },
    ],
  },
  computed: {
    itemsSelected() {
      return this.testItems.filter(item => item.selected).length;
    },
  },
});
