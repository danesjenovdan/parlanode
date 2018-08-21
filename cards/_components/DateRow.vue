<template>
  <div class="date-row">{{ date }}</div>
</template>

<script>
export default {
  name: 'DateRow',
  props: {
    date: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.date-row {
  background-color: $grey;
  font-weight: bold;
  padding: 10px;
}
</style>
