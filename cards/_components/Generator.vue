<template>
  <div v-if="generator">
    <slot name="generator" />
    <slot />
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Generator',
  data() {
    return {
      generator: this.$root.$options.cardData.parlaState
        && this.$root.$options.cardData.parlaState.generator,
    };
  },
};
</script>

<style>

</style>
