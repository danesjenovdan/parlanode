<template functional>
  <div v-bind="data.attrs" :class="['dash-button', data.class]" v-on="listeners">
    <slot />
  </div>
</template>

<style lang="scss">
@import '~parlassets/scss/colors';

.dash-button {
  display: inline-block;
  background-color: $funblue;
  color: $white;
  cursor: pointer;
  font-weight: 500;
  padding: 6px 12px;

  &:hover {
    background-color: $funblue-hover;
  }
}
</style>
