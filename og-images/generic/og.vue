<template>
  <og-container>
    <vertical-half variant="bg">
      <div class="title-container">
        <h1>{{ params.title }}</h1>
      </div>
    </vertical-half>
    <logo-half />
  </og-container>
</template>

<script>
import OgContainer from '../_components/OgContainer.vue';
import VerticalHalf from '../_components/VerticalHalf.vue';
import LogoHalf from '../_components/LogoHalf.vue';

export default {
  name: 'Generic',
  components: {
    OgContainer,
    VerticalHalf,
    LogoHalf,
  },
  data() {
    return {
      params: this.$options.context.params,
    };
  },
};
</script>

<style lang="scss" scoped>
.title-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    font-family: "Roboto Slab", sans-serif;
    font-size: 60px;
    color: #fff;
    text-align: center;
  }
}
</style>
