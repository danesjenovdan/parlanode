<template>
  <div class="toggle">
    <div
      v-for="option in options"
      :class="['option', { 'is-selected' : option.id === selected }]"
      @click="clickHandler(option.id)">
      {{ option.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateRow',
  props: {
    clickHandler: Function,
    options: Array,
    selected: String,
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.toggle {
  $height: 53px;
  display: flex;
  font-size: 15px;
  height: $height;
  line-height: $height;
  .option {
    align-items: center;
    background: $funblue-light;
    color: #333;
    cursor: pointer;
    flex: 1;
    text-align: center;
    &.is-selected {
      background: $sadblue;
      color: $white;
      cursor: default;
    }
  }
}
</style>
