export default {
  computed: {
    url() {
      const { cardData } = this.$root.$options.cardData;
      return `https://glej.parlameter.si/${cardData.group}/${cardData.method}/`;
    },
  },
  methods: {
    encodeQueryData(data) {
      return `?${Object.keys(data)
        .reduce((a, k) => {
          a.push(`${k}=${encodeURIComponent(data[k])}`);
          return a;
        }, [])
        .join('&')}`;
    },
  },
};
