import url from 'mixins/url';

export default {
  mixins: [url],
  computed: {
    generatedCardUrl() {
      return `${this.url}?customUrl=${encodeURIComponent(this.$options.cardData.cardData.dataUrl)}
        ${Object.keys(this.urlParameters).length > 0 ? `&state=${encodeURIComponent(JSON.stringify(this.urlParameters))}` : ''}`;
    },
  },
};
