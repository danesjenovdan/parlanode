<template>
  <div class="card-container transparent">
    <div class="card-content">
      <div v-cloak class="card-content-front">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransparentCardWrapper',
  props: {
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.card-container::before {
  display: none;
}

.card-content {
  padding: 20px;

  overflow: visible;
}

.transparent {
  border: none;
  background-color: none;
  background: transparent;
  box-shadow: none;

  overflow: visible;
}
</style>
