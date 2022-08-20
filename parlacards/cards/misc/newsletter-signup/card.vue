<template>
  <card-wrapper :header-config="{}" max-height>
    <newsletter-signup type="card" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import NewsletterSignup from '@/_components/NewsletterSignup.vue';

export default {
  name: 'CardMiscNewsletterSignup',
  components: {
    NewsletterSignup,
  },
  mixins: [common],
};
</script>

<style lang="scss" scoped>
:deep(.card-header),
:deep(.card-footer),
:deep(.card-container::before) {
  display: none;
}
</style>
