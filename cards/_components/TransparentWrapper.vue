<template>
  <div :id="mountId">
    <template v-if="hasGenerator && showGenerator">
      <slot name="generator" />
    </template>
    <div class="card-container transparent">
      <div class="card-content">
        <div v-cloak class="card-content-front">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransparentCardWrapper',
  data() {
    return {
      mountId: this.$root.$options.contextData.mountId,
      hasGenerator: this.$slots.generator?.()?.length,
      showGenerator: this.$root.$options.contextData.cardState?.generator,
    };
  },
};
</script>

<style lang="scss" scoped>
.card-container::before {
  display: none;
}

.card-content {
  padding: 20px;

  overflow: visible;
}

.transparent {
  border: none;
  background: transparent;
  box-shadow: none;

  overflow: visible;
}
</style>
