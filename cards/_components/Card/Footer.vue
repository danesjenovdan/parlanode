<template>
  <div class="card-footer">
    <div class="card-logo hidden">
      <a :href="slugs.urls.base">
        <img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo">
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
      @click="toggleBack(button)">
    </div>
  </div>
</template>

<script>
import { RIPPLE_DURATION } from 'components/constants';
import slugs from '../../../assets/urls.json';

export default {
  name: 'CardFooter',
  data() {
    return {
      clicksDisabled: false,
      currentBack: null,
      slugs,
      buttons: ['share', 'embed', 'info'],
    };
  },
  methods: {
    toggleBack(name) {
      if (!this.clicksDisabled) {
        this.$emit('toggleBack', name);
        this.currentBack = this.currentBack === name ? null : name;
        this.clicksDisabled = true;
        window.setTimeout(() => { this.clicksDisabled = false; }, RIPPLE_DURATION);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-info:not(.card-exit)::before { content: 'i'; }
.card-exit::before { content: '×'; }
</style>
