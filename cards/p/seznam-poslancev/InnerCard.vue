<template>
  <div class="card-container card-halfling card-seznam-poslancev">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <sortable-table
          class="member-list"
          :columns="columns"
          :items="mappedSessions"
          :sort="currentSort"
          :sort-order="currentSortOrder"
          :sort-callback="selectSort"
        />
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="generatedCardUrl" />
    </div>
    <card-footer />
  </div>
</template>

<script>
import common from 'mixins/common';
import SortableTable from 'components/SortableTable';

export default {
  components: { SortableTable },
  mixins: [common],
  name: 'SeznamPoslancevInnerCard',
  props: {
    headerConfig: Object,
    generatedCardUrl: String,
  },
};
</script>
