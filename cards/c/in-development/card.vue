<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="full"
  >
    <div class="empty">
      <div v-t="'card-in-development'" class="circle"></div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';

export default {
  name: 'InDevelopment',
  mixins: [
    common,
  ],
  data() {
    const state = this.$options.cardData.parlaState;
    const title = state.title || this.$t('card.title');

    return {
      title,
      headerConfig: defaultHeaderConfig(this, {
        title,
      }),
      ogConfig: defaultOgImage(this, {
        title,
      }),
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

.empty {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  .circle {
    $size: 220px;
    border-radius: 50%;
    background-image: url("#{getConfig('urls.cdn')}/icons/in-development.svg");
    background-color: $light-background;
    background-size: $size / 2.5;
    background-position: center 40px;
    background-repeat: no-repeat;
    font-size: 17px;
    font-family: 'Roboto Slab', 'Times New Roman', Times, serif;
    font-style: italic;
    font-weight: 300;
    height: $size;
    left: calc(50% - #{$size / 2});
    line-height: 19px;
    padding: 145px 26px 0;
    position: absolute;
    text-align: center;
    top: calc(50% - #{$size / 2});
    width: $size;
  }
}

.card-container ::v-deep .card-footer > *,
.card-container::before {
  visibility: hidden;
  display: none;
}
</style>
