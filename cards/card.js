// const fs = require('fs');

// /* globals Vue window */
// (() => {
//   const createApp = cardData =>
//     // ---------------------
//     // BEGIN NORMAL APP CODE
//     // ---------------------
//     // Main Vue instance must be returned and have a root
//     // node with the id "app", so that the client-side
//     // version can take over once it loads.
//     new Vue({
//       template: fs.readFileSync(`${__dirname}/template.html`, 'utf-8'),
//       data: {
//         cardData,
//         counter: 9,
//       },
//       created() {
//         const vm = this;
//         setInterval(() => {
//           vm.counter += 1;
//         }, 1000);
//       },
//     });
//     // -------------------
//     // END NORMAL APP CODE
//     // -------------------

//   if (typeof module !== 'undefined' && module.exports) {
//     module.exports = createApp;
//   } else {
//     // eslint-disable-next-line no-underscore-dangle
//     this.app = createApp(window.__INITIAL_STATE__);
//   }
// }).call(this);
