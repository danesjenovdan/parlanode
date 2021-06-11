<template>
  <div v-if="showErrorState">There was an error!</div>
  <div v-else-if="showEmptyState">
    <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
      <data-not-published :text="emptyStateText" />
    </card-wrapper>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script>
// import common from '@/_mixins/common.js';
import CardWrapper from '@/_components/Card/Wrapper.vue';
import DataNotPublished from '@/_components/DataNotPublished.vue';
// import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
// import { defaultOgImage } from '@/_mixins/ogImages.js';

export default {
  components: {
    CardWrapper,
    DataNotPublished,
  },
  //   mixins: [common],
  data() {
    // const { cardData } = this.$root.$options;
    // const state = (cardData || {}).parlaState;

    // const height = state.height || 1;
    // const title = state.title || this.$t('card.title');
    // const emptyStateText = (() => {
    //   if (state.emptyStateText) {
    //     return state.emptyStateText;
    //   }
    //   if (this.$te('card.data-not-published')) {
    //     return this.$t('card.data-not-published');
    //   }
    //   return this.$t('data-not-published.data-not-available');
    // })();

    // const showErrorState = false;
    // // eslint-disable-next-line no-underscore-dangle
    // const showEmptyState =
    //   cardData && cardData.data && cardData.data.__status === 204;
    console.log(this.$slots.default());

    return {
      showErrorState: true,
      showEmptyState: false,
      emptyStateText: 'LOLOL',
      //   contentClass: height === 2 ? 'full' : 'half',
      //   headerConfig: defaultHeaderConfig(this, {
      //     title,
      //   }),
      //   ogConfig: defaultOgImage(this, {
      //     title,
      //   }),
    };
  },
  // errorCaptured(err, vm, info) {
  //   // err: error trace
  //   // vm: component in which error occured
  //   // info: Vue specific error information such as lifecycle hooks, events etc.
  //   // return false to stop the propagation of errors further to parent or global error handler

  //   // TODO: this.showErrorState = true;
  // }
};
</script>

<style lang="scss" scoped>
// .card-container /deep/ .data-not-published {
//   min-height: 180px;
// }
</style>
