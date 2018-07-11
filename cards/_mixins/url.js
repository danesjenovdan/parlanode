export default {
  computed: {
    url() {
      return `${this.slugs.urls.glej}/${process.env.CARD_NAME}/`;
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
