<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div v-t="'card-in-development'" class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';

export default {
  name: 'VsaGlasovanja',
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
.empty-dataset {
  font-size: 16px;
  line-height: 20px;
  margin: 70px 0;
  text-align: center;
  font-style: italic;
}

.card-container /deep/ .card-footer > *,
.card-container::before {
  visibility: hidden;
  display: none;
}
</style>
