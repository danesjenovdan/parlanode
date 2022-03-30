<template>
  <div class="card-footer">
    <a :href="$root.$options.contextData.urls.site">
      <img
        :src="`${$root.$options.contextData.urls.cdn}/img/logo-parlameter.svg`"
        alt="parlameter logo"
      />
    </a>
    <div
      v-for="button in buttons"
      :key="button"
      :class="[
        'card-circle-button-vue',
        `card-${button}`,
        { 'card-exit': currentBack === button },
      ]"
      @click="toggleBack(button)"
    ></div>
  </div>
</template>

<script>
import { RIPPLE_DURATION } from '@/_helpers/constants.js';

export default {
  name: 'CardFooter',
  emits: ['toggle-back'],
  data() {
    // check template parameter to decide whether to include logo in the footer
    const template = this.$root.$options.contextData.templateName;
    const showFooterLogo = template
      ? template === 'embed' || template === 'share'
      : false;
    return {
      clicksDisabled: false,
      currentBack: null,
      showFooterLogo,
    };
  },
  computed: {
    buttons() {
      const { cardData } = this.$root.$options.contextData;
      const previous = cardData?.data?.previous_versions;
      if (previous && previous.length) {
        return ['share', 'embed', 'info', 'previous'];
      }
      return ['share', 'embed', 'info'];
    },
  },
  methods: {
    toggleBack(name) {
      if (!this.clicksDisabled) {
        this.$emit('toggle-back', name);
        this.currentBack = this.currentBack === name ? null : name;
        this.clicksDisabled = true;
        window.setTimeout(() => {
          this.clicksDisabled = false;
        }, RIPPLE_DURATION);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-footer > a img {
  max-height: 100%;
  height: 30px;
  width: auto;
}

.card-info:not(.card-exit)::before {
  content: 'i';
  font-weight: 100;
}

.card-previous::before {
  content: 'p';
  font-weight: 100;
}

.card-exit::before {
  content: '×';
}
</style>
