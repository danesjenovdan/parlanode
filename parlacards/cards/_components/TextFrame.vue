<template>
  <div class="text-frame">
    <slot />
  </div>
</template>

<style lang="scss">
@import 'parlassets/scss/colors';

.text-frame {
  text-align: center;
  background-color: $light-background;
  padding: 30px;
  font-family: 'Roboto Slab', serif;
  font-size: 18px;
  line-height: 30px;
  margin-bottom: 10px;
}
</style>
