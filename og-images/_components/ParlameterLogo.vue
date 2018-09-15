<template>
  <div class="parlameter-logo">
    <img
      :src="`${$root.$options.context.urls.urls.cdn}/img/logo-parlameter.svg`"
      alt="parlameter logo"
    >
  </div>
</template>

<script>
export default {
  name: 'ParlameterLogo',
};
</script>

<style lang="scss">
.parlameter-logo img {
  display: block;
  margin: 0 auto;
}
</style>
