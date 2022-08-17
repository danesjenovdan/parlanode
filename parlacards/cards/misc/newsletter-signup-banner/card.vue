<template>
  <transparent-wrapper>
    <newsletter-signup type="banner" />
  </transparent-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import TransparentWrapper from '@/_components/TransparentWrapper.vue';
import NewsletterSignup from '@/_components/NewsletterSignup.vue';

export default {
  name: 'CardMiscNewsletterSignup',
  components: {
    TransparentWrapper,
    NewsletterSignup,
  },
  mixins: [common],
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

<style lang="scss" scoped>
:deep(.card-content) {
  padding: 0;
}
</style>
