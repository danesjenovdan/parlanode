<template functional>
  <div v-bind="data.attrs" :class="['dash-button', data.class, data.staticClass]" v-on="listeners">
    <slot />
  </div>
</template>

<style lang="scss">
@import 'parlassets/scss/colors';

.dash-button {
  display: inline-block;
  background-color: $first;
  color: $white;
  cursor: pointer;
  font-weight: 500;
  padding: 10px 16px 9px;
  text-align: center;
  text-transform: uppercase;

  &:hover {
    background-color: $second;
  }
}

[disabled] {
  opacity: 0.6;
  filter: grayscale(100%);
  cursor: default;
  pointer-events: none;
}
</style>
