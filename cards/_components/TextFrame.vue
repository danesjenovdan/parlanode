<template functional>
  <div :class="'text-frame ' + data.staticClass">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.text-frame {
  text-align: center;
  background-color: #f0f5f8;
  padding: 30px;
  font-family: 'Roboto Slab', serif;
  font-size: 18px;
  line-height: 30px;
  margin-bottom: 10px;
}
</style>
