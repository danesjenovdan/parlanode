<template>
  <vertical-half variant="white">
    <h2 class="title-text">
      {{ title }}
    </h2>
    <div class="logo-container">
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
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import "~parlassets/scss/colors";

.logo-container {
  margin-top: auto;

  img {
    height: 100px;
  }
}

.title-text {
  text-align: center;
  font-size: 48px;
  color: $font-default;
  flex: 1;
  margin-bottom: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
