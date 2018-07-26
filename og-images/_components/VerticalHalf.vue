<template>
  <div :class="['vertical-half', `vertical-half--${variant}`]">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'VerticalHalf',
  props: {
    variant: {
      type: String,
      default: 'normal',
    },
  },
};
</script>

<style lang="scss">
.vertical-half {
  position: relative;
  flex-basis: 50%;
}

.vertical-half--white {
  background: #fff;
}
</style>
