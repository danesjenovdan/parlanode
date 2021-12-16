<template>
  <div class="card-content-info">
    <div class="card-back-content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="card-back-info" v-html="info"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardInfo',
  props: {
    info: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.card-back-info {
  max-width: 600px;
  margin: 0 auto;
}

:deep(.card-back-info) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
