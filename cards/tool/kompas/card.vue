<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <template #generator>
      <tools-tabs current-tool="compass" />
    </template>
    <compass ref="compass" :compass-data="$options.contextData.cardData.data" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { compass } from '@/_mixins/contextUrls.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import ToolsTabs from '@/_components/ToolsTabs.vue';
import Compass from './Compass.vue';

export default {
  name: 'Kompas',
  components: {
    ToolsTabs,
    Compass,
  },
  mixins: [common, compass],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    return {
      headerConfig: defaultHeaderConfig(this, { circleIcon: 'og-kompas' }),
      ogConfig: defaultOgImage(this, { icon: 'og-kompas' }),
    };
  },
  computed: {
    generatedCardUrl() {
      const state = {};
      // TODO: state url
      return `${this.url}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
  },
};
</script>
