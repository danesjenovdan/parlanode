<template>
  <dash-wrapper :id="$options.cardData.cardData._id">
    <div>
      Test
    </div>
  </dash-wrapper>
</template>

<script>
import DashWrapper from 'components/Card/DashWrapper.vue';
import common from 'mixins/common';

export default {
  name: 'DashboardTest',
  components: {
    DashWrapper,
  },
  mixins: [
    common,
  ],
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
