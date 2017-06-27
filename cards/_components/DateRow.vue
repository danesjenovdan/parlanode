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
  font-weight: bold;
  padding: 10px;
}
</style>
