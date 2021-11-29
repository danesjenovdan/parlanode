<template>
  <div v-if="!data?.length">
    <div v-t="'no-results'" class="no-results" />
  </div>
  <ul v-else class="party-list">
    <li v-for="(party, index) in data" :key="index" class="labeled-chart">
      <div class="column chart-label">
        <a :href="getPartyLink(party.group)" class="funblue-light-hover">
          {{ party.group?.acronym || party.group?.name || 'N/A' }}
        </a>
      </div>
      <div class="column chart">
        <div class="progress hugebar">
          <div
            :style="{ width: `${party.value}%` }"
            class="progress-bar funblue"
            role="progressbar"
          ></div>
          <div class="progress_number">{{ `${party.value}%` }}</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import links from '@/_mixins/links.js';

export default {
  name: 'AttendanceByGroups',
  mixins: [links],
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';

.party-list .labeled-chart {
  // min-height: 46px;

  @include respond-to(mobile) {
    flex-direction: column;
  }

  .column.chart-label {
    line-height: 1.1;
    // margin-top: -10px;
    // margin-bottom: -10px;
    margin-top: 0;
    margin-bottom: 0;
    width: 200px;

    @include respond-to(mobile) {
      width: 100%;
    }
  }

  .column.chart {
    @include respond-to(mobile) {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
