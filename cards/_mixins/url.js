export default {
  computed: {
    url() {
      const cardData = this.$options.cardData.cardData;
      return `https://glej.parlameter.si/${cardData.group}/${cardData.method}/`;
    },
  },
};
