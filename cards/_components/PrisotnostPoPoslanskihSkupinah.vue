<template>
  <div class="presence-list">
    <div v-for="obj in data" :key="obj.org.id" class="presence">
      <div class="percent">{{ obj.percent }}%</div>
      <div class="party">{{ obj.org.acronym }}</div>
      <div :class="['line', `${obj.org.acronym.replace(/ /g, '_').toLowerCase()}-background`]" :style="`width: ${obj.percent}%;`"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrisotnostPoPoslanskihSkupinah',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.presence-list {
  margin: 15px 0 20px 0;
}
</style>
