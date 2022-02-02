<template>
  <span class="tag">
    <slot />
  </span>
</template>

<style lang="scss">
@import 'parlassets/scss/colors';

.tag {
  display: inline-block;
  white-space: nowrap;
  background-color: $first;
  color: $white;
  padding: 0px 7px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 5px;

  &::after {
    content: '×';
    margin-left: 3px;
    font-size: 20px;
    line-height: 20px;
    position: relative;
    top: 2px;
  }
}
</style>
