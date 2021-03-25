<template>
  <div class="card-container">
    <div class="card-content">
      <div v-cloak class="card-content-front">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCardWrapper',
  props: {},
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.card-container::before {
  display: none;
}

.card-content {
  padding: 20px;
}
</style>
