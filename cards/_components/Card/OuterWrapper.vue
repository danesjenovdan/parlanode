<template>
  <div v-if="showErrorState">
    There was an error!
  </div>
  <div v-else-if="showEmptyState">
    <card-wrapper
      :id="$root.$options.cardData.mountId"
      :header-config="headerConfig"
      :og-config="ogConfig"
      :content-class="contentClass"
    >
      <data-not-published :text="emptyStateText" :show-link="showEmptyLink" />
    </card-wrapper>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script>
import common from 'mixins/common';
import DataNotPublished from 'components/DataNotPublished.vue';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';

export default {
  components: {
    DataNotPublished,
  },
  mixins: [
    common,
  ],
  data() {
    const { cardData } = this.$root.$options;
    const state = (cardData || {}).parlaState;

    const height = state.height || 1;
    const title = state.title || this.$t('card.title');
    const [showEmptyLink, emptyStateText] = (() => {
      if (state.emptyStateText) {
        return [false, state.emptyStateText];
      }
      if (this.$te('card.data-not-published')) {
        return [false, this.$t('card.data-not-published')];
      }
      return [false, this.$t('data-not-published.data-not-available')];
    })();

    const showErrorState = false;
    // eslint-disable-next-line no-underscore-dangle
    const showEmptyState = cardData && cardData.data && cardData.data.__status === 204;

    return {
      showErrorState,
      showEmptyState,
      showEmptyLink,
      emptyStateText,
      contentClass: height === 2 ? 'full' : 'half',
      headerConfig: defaultHeaderConfig(this, {
        title,
      }),
      ogConfig: defaultOgImage(this, {
        title,
      }),
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
.card-container /deep/ .data-not-published {
  min-height: 180px;
}
</style>
