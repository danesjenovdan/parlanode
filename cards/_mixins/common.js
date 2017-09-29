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
};
