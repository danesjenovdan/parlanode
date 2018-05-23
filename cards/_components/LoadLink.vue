<template functional>
  <span
    class="load"
    v-on="listeners"
  >{{ data.attrs.text }}</span>
</template>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.load {
  display: inline-block;
  white-space: nowrap;
  color: $sadblue;
  cursor: pointer;
  font-weight: 600;

  &:hover { background-color: #ffffff; }

  &::after {
    content: '';
    display: inline-block;
    background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/nalozi.svg');
    width: 20px;
    height: 20px;
    position: relative;
    top: 3px;
    margin-left: 5px;
  }
}
</style>
