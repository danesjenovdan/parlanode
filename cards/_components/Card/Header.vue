<template>
  <div class="card-header">
    <template v-if="config.alternative">
      <div class="alt-header-container">
        <div class="alt-header">
          <div
            v-if="config.circleText || config.mediaImage"
            :class="config.circleClass"
            class="media-object img-circle session-logo"
          >
            <b v-if="config.circleText">{{ config.circleText }}</b>
            <img v-else :src="`${slugs.urls.cdn}/icons/${config.mediaImage}.svg`">
          </div>
          <img
            v-else-if="config.circleImage"
            :src="`${slugs.urls.cdn}/img/people/square/${config.circleImage}.png`"
            class="portrait column"
          >
          <div v-else-if="config.circleIcon" class="icon-circle">
            <img :src="`${slugs.urls.cdn}/icons/${config.circleIcon}.svg`">
          </div>
          <div class="header-info-container">
            <h1 v-html="config.heading"></h1>
            <h2 class="partyinfo">{{ config.subheading }}</h2>
            <h2 class="cardname">{{ config.title }}</h2>
          </div>
        </div>
        <div class="alt-header-border"></div>
      </div>
    </template>
    <template v-else>
      <div class="card-header-border"></div>
      <h1 v-t="'info.title'" v-if="currentBack === 'info'"></h1>
      <h1 v-t="'embed.title'" v-else-if="currentBack === 'embed'"></h1>
      <h1 v-t="'share.title'" v-else-if="currentBack === 'share'"></h1>
      <h1 v-t="'previous.title'" v-else-if="currentBack === 'previous'"></h1>
      <h1 v-else>{{ config.title }}</h1>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CardHeader',
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
    return {
      slugs: this.$root.$options.cardData.urls,
    };
  },
};
</script>
