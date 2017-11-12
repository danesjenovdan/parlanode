import CardWrapper from 'components/Card/Wrapper.vue';

import url from 'mixins/url';
import slugs from '../../assets/urls.json';
import vocabulary from '../../assets/vocab.json';

export default {
  data() {
    return {
      slugs,
      vocabulary,
    };
  },
  components: {
    CardWrapper,
  },
  mixins: [
    url,
  ],
  created() {
    this.$root.$options.cardData.template = {
      pageTitle: 'TITLE MISSING!',
      frameContainerClass: this.$root.$options.cardData.cardData.big
        ? 'col-md-12'
        : 'col-md-6 col-md-offset-3',
      embedContainerClass:
        (this.$root.$options.cardData.cardData.big ? ' big-card' : '') +
        (this.$root.$options.cardData.cardData.high ? ' high-card' : ''),
    };
  },
};
