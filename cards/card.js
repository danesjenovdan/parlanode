(function () {
  var createApp = function (cardData) {
    // ---------------------
    // BEGIN NORMAL APP CODE
    // ---------------------
    // Main Vue instance must be returned and have a root
    // node with the id "app", so that the client-side
    // version can take over once it loads.
    return new Vue({
      template: '<div id="app">You have been here for {{ counter }} seconds. {{ cardData }}</div>',
      data: {
        cardData: cardData,
        counter: 0
      },
      created: function () {
        var vm = this
        setInterval(function () {
          vm.counter += 1
        }, 1000)
      }
    })
    // -------------------
    // END NORMAL APP CODE
    // -------------------
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createApp
  } else {
    this.app = createApp(window.__INITIAL_STATE__)
  }
}).call(this)
