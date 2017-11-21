export default {
  computed: {
    url() {
      const cardData = this.$options.cardData.cardData;
      return `https://glej.parlameter.si/${cardData.group}/${cardData.method}/`;
    }
  },
  methods: {
      encodeQueryData (data) {
          console.log(data,'asd', Object.keys(data))
          return '?' + Object.keys(data)
              .reduce((a, k) => {
                  a.push(k + '=' + encodeURIComponent(data[k]));
                  return a;
              },[])
              .join('&')
      }
  }
};
