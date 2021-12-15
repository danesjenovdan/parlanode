<template>
  <empty-state v-if="!attendance?.length" small />
  <ul v-else class="party-list">
    <li
      v-for="(party, index) in sortedAttendance"
      :key="index"
      class="labeled-chart"
    >
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
          <div class="progress_number">
            {{ formatNumber(party.value, { percent: true }) }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import links from '@/_mixins/links.js';
import numberFormatter from '@/_helpers/numberFormatter.js';
import EmptyState from '@/_components/EmptyState.vue';

export default {
  name: 'AttendanceByGroups',
  components: {
    EmptyState,
  },
  mixins: [links],
  props: {
    attendance: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    sortedAttendance() {
      return (this.attendance || []).slice().sort((a, b) => {
        const aValue = a.group.acronym || a.group.name || '';
        const bValue = b.group.acronym || b.group.name || '';
        return aValue.localeCompare(bValue, 'sl');
      });
    },
  },
  methods: {
    formatNumber(number) {
      return numberFormatter(number, { percent: true });
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
    width: 100px;

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
