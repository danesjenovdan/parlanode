<template>
  <input
    :placeholder="placeholder"
    :value="modelValue"
    class="search-field"
    type="text"
    @input="$emit('update:modelValue', $event.target.value)"
    @keyup.enter="$emit('enter', $event.target.value)"
  />
</template>

<script>
export default {
  name: 'SearchField',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'enter'],
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

.search-field {
  background-image: url('#{get-parlassets-url()}/icons/search.svg');
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: right 9px center;
  border: 1px solid $font-placeholder;
  font-size: 16px;
  height: 51px;
  line-height: 27px;
  outline: none;
  padding: 12px 42px 12px 14px;
  width: 100%;
}
</style>
