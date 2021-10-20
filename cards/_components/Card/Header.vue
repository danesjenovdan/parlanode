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
            <img v-else :src="`${urls.cdn}/icons/${config.mediaImage}.svg`" />
          </div>
          <img
            v-else-if="config.circleImage"
            :src="`${urls.cdn}/img/people/square/${config.circleImage}.png`"
            class="portrait column"
          />
          <div v-else-if="config.circleIcon" class="icon-circle">
            <img :src="`${urls.cdn}/icons/${config.circleIcon}.svg`" />
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
      <h1 v-if="currentBack === 'info'" v-t="'info.title'"></h1>
      <h1 v-else-if="currentBack === 'embed'" v-t="'embed.title'"></h1>
      <h1 v-else-if="currentBack === 'share'" v-t="'share.title'"></h1>
      <h1 v-else-if="currentBack === 'previous'" v-t="'previous.title'"></h1>
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
    const { urls } = this.$root.$options.contextData;
    return {
      urls,
    };
  },
};
</script>
