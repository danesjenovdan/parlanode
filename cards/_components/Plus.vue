<template functional>
  <span
    class="plus"
    v-on="listeners"
  >+</span>
</template>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.plus {
  background-color: $white;
  padding: 0.2px 7px;
  font-size: 21px;
  line-height: 12px;
  cursor: pointer;
  color: $funblue;
  position: relative;
  top: 3px;
  font-family: 'Roboto', sans-serif;
  margin-left: 5px;
}
</style>
