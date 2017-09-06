import CardWrapper from 'components/Card/Wrapper.vue';

import initializeBack from 'mixins/initializeBack';
import url from 'mixins/url';
import slugs from '../../assets/urls.json';

export default {
  data() {
    return {
      slugs,
    };
  },
  components: {
    CardWrapper,
  },
  mixins: [
    initializeBack,
    url,
  ],
};
