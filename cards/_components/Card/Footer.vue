<template>
  <div class="card-footer">
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
    return {
      clicksDisabled: false,
      currentBack: null,
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
