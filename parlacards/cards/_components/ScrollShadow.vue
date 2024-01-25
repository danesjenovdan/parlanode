<template>
  <div
    :class="['scroll-shadow-top', { 'scroll-shadow-top--enabled': showShadow }]"
  >
    <slot />
  </div>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  name: 'ScrollShadow',
  data() {
    return {
      showShadow: false,
    };
  },
  methods: {
    check(el) {
      this.update(el);
    },
    update: debounce(
      function update(el) {
        this.showShadow = el.scrollTop > 0;
      },
      50,
      { leading: true },
    ),
  },
};
</script>

<style lang="scss" scoped>
.scroll-shadow-top {
  position: relative;
  margin-left: -20px;
  margin-right: -20px;
  padding: 0 20px;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    box-shadow:
      inset 0px 11.5px 4px -10px rgba(0, 0, 0, 0.24),
      inset 0px 11.5px 6px -10px rgba(0, 0, 0, 0.24);
    pointer-events: none;
    opacity: 0;
    z-index: 3;
  }
}

.scroll-shadow-top--enabled {
  &::after {
    opacity: 1;
  }
}
</style>
