<template>
  <vertical-half variant="white">
    <div class="large-logo-container">
      <parlameter-logo />
    </div>
  </vertical-half>
</template>

<script>
import VerticalHalf from './VerticalHalf.vue';
import ParlameterLogo from './ParlameterLogo.vue';

export default {
  name: 'TitleLogoHalf',
  components: {
    VerticalHalf,
    ParlameterLogo,
  },
};
</script>

<style lang="scss">
.large-logo-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 180px;
  }
}
</style>
