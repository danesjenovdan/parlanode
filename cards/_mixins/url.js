export default {
  computed: {
    url() {
      const { cardData } = this.$root.$options.cardData;
      return `${this.slugs.urls.glej}/${cardData.group}/${cardData.method}/`;
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
