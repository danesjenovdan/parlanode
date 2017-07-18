<template>
  <div class="toggle">
    <div
      v-for="(optionLabel, optionValue) in options"
      :key="optionValue"
      :class="['option', { 'is-selected' : optionValue === value }]"
      @click="handleClick(optionValue)">
      {{ optionLabel }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    options: Object,
    value: [String, Number, Boolean],
  },
  methods: {
    handleClick(newValue) {
      this.$emit('input', newValue);
    },
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
