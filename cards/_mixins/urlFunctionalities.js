import url from 'mixins/url';

export default {
  mixins: [url],
  computed: {
    generatedCardUrl() {
      const id = (this.$options.cardData.data.person && this.$options.cardData.data.person.id)
        || (this.$options.cardData.data.party && this.$options.cardData.data.party.id);
      const customUrl = `${this.$options.cardData.cardData.dataUrl}${id ? `/${id}` : ''}`;
      return `${this.url}?customUrl=${encodeURIComponent(customUrl)}${Object.keys(this.urlParameters).length > 0 ? `&state=${encodeURIComponent(JSON.stringify(this.urlParameters))}` : ''}`;
    },
  },
};
