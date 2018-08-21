<template>
  <div id="og-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'OgContainer',
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500&subset=latin,latin-ext');
@import url('https://fonts.googleapis.com/css?family=Roboto+Slab:300,700&subset=latin,latin-ext');

#og-container {
  display: flex;
  position: relative;
  width: 1200px;
  height: 630px;
  background: #009cdd;
  font-family: Roboto, sans-serif;
}
</style>
