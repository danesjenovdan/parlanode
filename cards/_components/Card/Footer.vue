<template>
  <div class="card-footer">
    <div class="card-logo hidden">
      <a :href="slugs.urls.base">
        <img :src="`${slugs.urls.cdn}/img/logo-parlameter.svg`" alt="parlameter logo">
      </a>
    </div>

    <div
      v-for="button in buttons"
      :key="button"
      :class="[
        'card-circle-button-vue',
        `card-${button}`,
        { 'card-exit': currentBack === button }
      ]"
      @click="toggleBack(button)"
    >
    </div>
  </div>
</template>

<script>
import { get } from 'lodash';
import { RIPPLE_DURATION } from 'components/constants';

export default {
  name: 'CardFooter',
  data() {
    return {
      clicksDisabled: false,
      currentBack: null,
      slugs: this.$root.$options.cardData.urls,
    };
  },
  computed: {
    buttons() {
      const previous = get(this.$root.$options.cardData.data, 'previous_versions');
      if (previous && previous.length) {
        return ['share', 'embed', 'info', 'previous'];
      }
      return ['share', 'embed', 'info'];
    },
  },
  methods: {
    toggleBack(name) {
      if (!this.clicksDisabled) {
        this.$emit('toggleBack', name);
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
