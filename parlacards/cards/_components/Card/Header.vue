<template>
  <div class="card-header">
    <template v-if="config.alternative">
      <div class="alt-header-container">
        <div class="alt-header">
          <div
            v-if="config.circleText || config.mediaImage"
            class="media-object img-circle session-logo"
            :style="{ 'background-color': config.circleColor || '#333' }"
          >
            <b v-if="config.circleText">{{ config.circleText }}</b>
            <img v-else :src="`${urls.cdn}/icons/${config.mediaImage}.svg`" />
          </div>
          <img
            v-else-if="config.circlePerson"
            :src="getPersonPortrait(config.circlePerson)"
            class="portrait column"
          />
          <div v-else-if="config.circleIcon" class="icon-circle">
            <img :src="`${urls.cdn}/icons/${config.circleIcon}.svg`" />
          </div>
          <div class="header-info-container">
            <!-- eslint-disable vue/no-v-html -->
            <h1 v-if="config.heading" v-html="config.heading"></h1>
            <!-- eslint-enable vue/no-v-html -->
            <h2 v-if="config.subheading" class="partyinfo">
              {{ config.subheading }}
            </h2>
            <h2 class="cardname">{{ config.title }}</h2>
          </div>
        </div>
        <div class="alt-header-border"></div>
      </div>
    </template>
    <template v-else>
      <div class="card-header-border"></div>
      <h1 v-if="currentBack === 'info'" v-t="'info.title'"></h1>
      <h1 v-else-if="currentBack === 'embed'" v-t="'embed.title'"></h1>
      <h1 v-else-if="currentBack === 'share'" v-t="'share.title'"></h1>
      <h1 v-else-if="currentBack === 'previous'" v-t="'previous.title'"></h1>
      <h1 v-else-if="currentBack === 'export'" v-t="'export.title'"></h1>
      <h1 v-else>{{ config.title }}</h1>
    </template>
  </div>
</template>

<script>
import links from '@/_mixins/links.js';

export default {
  name: 'CardHeader',
  mixins: [links],
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    currentBack: {
      type: String,
      default: '',
    },
  },
  data() {
    const { urls } = this.$root.$options.contextData;
    return {
      urls,
    };
  },
};
</script>

<style lang="scss" scoped>
.session-logo {
  margin-left: 0;
}
</style>
