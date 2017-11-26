export default {
  computed: {
    url() {
      const cardData = this.$root.$options.cardData.cardData;
      return `https://glej.parlameter.si/${cardData.group}/${cardData.method}/`;
    },
  },
};
