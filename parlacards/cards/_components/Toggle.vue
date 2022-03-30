<template>
  <div class="toggle">
    <div
      v-for="(optionLabel, optionValue) in options"
      :key="optionValue"
      :class="['option', { 'is-selected': optionValue === modelValue }]"
      @click="handleClick(optionValue)"
    >
      {{ optionLabel }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleClick(newValue) {
      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

.toggle {
  $height: 51px;
  display: flex;
  font-size: 15px;
  height: $height;
  line-height: $height;

  .option {
    align-items: center;
    background: $tab-passive;
    color: $white;
    cursor: pointer;
    flex: 1;
    text-align: center;
    padding: 0 10px;

    &:hover {
      background: $tab-hover;
    }

    &.is-selected {
      background: $tab-active;
      color: $white;
      cursor: default;
    }
  }
}
</style>
