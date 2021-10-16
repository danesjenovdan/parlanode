<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div class="errored">
      <div class="icon"></div>
      <div v-t="'card-errored'" class="content"></div>
      <div class="message" v-text="message"></div>
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';

export default {
  name: 'CardMiscError',
  mixins: [common],
  data() {
    const { cardState } = this.$root.$options.contextData;

    const title = cardState?.title || this.$t('card.title');
    const message = cardState?.error?.message || cardState?.message || '';
    // const height = cardState?.height || 1;
    return {
      title,
      message,
      // contentClass: height === 2 ? 'full' : 'half',
      headerConfig: defaultHeaderConfig(this, {
        title,
      }),
      ogConfig: defaultOgImage(this, {
        title,
      }),
    };
  },
  beforeCreate() {
    // const { cardState } = this.$root.$options.contextData;
    // const width = cardState?.width || 1;
    // this.$root.$options.cardData.cardData.big = width === 2;
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

.errored {
  display: flex;
  flex-direction: column;
  height: 80%;
  justify-content: center;
  min-height: 180px;

  .icon {
    width: 100%;
    padding-top: 100px;
    background-image: url('#{get-parlassets-url()}/icons/missing-file.svg');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .content {
    font-size: 17px;
    font-family: 'Roboto Slab', 'Times New Roman', Times, serif;
    font-style: italic;
    font-weight: 300;
    line-height: 19px;
    text-align: center;
    width: 100%;
    margin: 10px auto 0;
  }

  .message {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    font-size: 12px;
    font-family: monospace;
    color: $font-placeholder;
  }
}

:deep(.card-container) {
  &::before,
  .card-footer > * {
    visibility: hidden;
    display: none;
  }
}
</style>
