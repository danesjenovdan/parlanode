import CardWrapper from 'components/Card/Wrapper.vue';

import url from 'mixins/url';
import slugs from '../../assets/urls.json';
import { RIPPLE_DURATION } from 'components/constants';

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
    url,
  ],
  methods: {
    toggleBack(newBack) {
      const contentElement = this.$el.querySelector('.card-content');

      if (this.currentBack !== newBack) {
        this.transitionClass = ['covered', `clicked-${newBack}`];

        window.setTimeout(() => {
          contentElement.style.height = `${contentElement.offsetHeight}px`;
          this.currentBack = newBack;
        }, RIPPLE_DURATION / 2);
        window.setTimeout(() => { this.transitionClass = null; }, RIPPLE_DURATION);
      } else {
        this.transitionClass = ['revealed', `clicked-${newBack}`];

        window.setTimeout(() => {
          this.currentBack = null;
          contentElement.style.height = null;
        }, RIPPLE_DURATION / 2);
        window.setTimeout(() => { this.transitionClass = null; }, RIPPLE_DURATION);
      }
    },
  },
};
