<template>
  <div class="date-row">{{ date }}</div>
</template>

<script>
export default {
  name: 'DateRow',
  props: {
    date: String,
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.date-row {
  background-color: $grey;
  padding: 10px;
  font-weight: 500;
}
</style>
