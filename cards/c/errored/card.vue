<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :header-config="headerConfig"
    :og-config="ogConfig"
    :content-class="contentClass"
  >
    <div class="errored">
      <div class="icon"></div>
      <div v-t="'card-errored'" class="content"></div>
      <div class="message" v-text="message"></div>
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common';
import { defaultHeaderConfig } from '@/_mixins/altHeaders';
import { defaultOgImage } from '@/_mixins/ogImages';

export default {
  name: 'InDevelopment',
  mixins: [common],
  data() {
    const state = this.$options.cardData.parlaState;
    const title = state.title || this.$t('card.title');
    const message = state.message || '';
    const height = state.height || 1;
    return {
      title,
      message,
      contentClass: height === 2 ? 'full' : 'half',
      headerConfig: defaultHeaderConfig(this, {
        title,
      }),
      ogConfig: defaultOgImage(this, {
        title,
      }),
    };
  },
  beforeCreate() {
    const state = this.$options.cardData.parlaState;
    const width = state.width || 1;
    this.$root.$options.cardData.cardData.big = width === 2;
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
    background-image: url("#{getConfig('urls.cdn')}/icons/missing-file.svg");
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

.card-container ::v-deep .card-footer > *,
.card-container::before {
  visibility: hidden;
  display: none;
}
</style>
