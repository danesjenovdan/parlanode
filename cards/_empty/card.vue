<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="url"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <!-- Card content goes here -->
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';

export default {
  // TODO: remove eslint comment
  // eslint-disable-next-line vue/name-property-casing
  name: '{{ componentName }}',
  components: { },
  mixins: [common],
  data() {
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/altHeaders'
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$t('card.title'),
      },
      ogConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/ogImages'
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
