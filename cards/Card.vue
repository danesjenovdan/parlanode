<template>
  <div id="app">You have been here for {{ counter }} seconds. {{ cardData }}</div>
</template>

<script>
export default {
  data() {
    return {
      cardData: { a: 1},
      counter: 9,
    }
  },
  created() {
    const vm = this;
    setInterval(() => {
      vm.counter += 1;
    }, 1000);
  },
  methods: {
    loadData(cardData) {
      this.cardData = cardData
    }
  }
}
</script>

<style>
body {
  color: red;
}
</style>
