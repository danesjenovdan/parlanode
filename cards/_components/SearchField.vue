<template>
  <input
    :placeholder="placeholder"
    :value="value"
    class="search-field"
    type="text"
    @input="$emit('input', $event.target.value)"
    @keyup.enter="$emit('enter', $event.target.value)"
  >
</template>

<script>
export default {
  name: 'SearchField',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.search-field {
  background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/search.svg');
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: right 9px center;
  border: 1px solid #c8c8c8;
  font-size: 16px;
  height: 51px;
  line-height: 27px;
  outline: none;
  padding: 12px 42px 12px 14px;
  width: 100%;

  &::placeholder { color: $grey-medium; }
}
</style>
