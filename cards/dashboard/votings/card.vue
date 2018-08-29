<template>
  <dash-wrapper :id="$options.cardData.cardData._id">
    <div id="dash-votings-list">
      <dash-table
        :columns="columns"
        :items="mappedItems"
      >
        <template slot="item-col" slot-scope="{ column, index }">
          <template v-if="index === 0">{{ column.text }}</template>
          <template v-if="index === 1">
            <search-dropdown :items="mappedTags(column.tags)" small />
          </template>
          <template v-if="index === 2">
            {{ column.result }}
          </template>
          <template v-if="index === 3">
            <div>
              <div>{{ $t('vote-for') }}: {{ column.votes.za }}</div>
              <div>{{ $t('vote-against') }}: {{ column.votes.proti }}</div>
              <div>{{ $t('vote-abstained-plural') }}: {{ column.votes.kvorum }}</div>
              <div>{{ $t('vote-not-plural') }}: {{ column.votes.ni }}</div>
            </div>
          </template>
          <template v-if="index === 4">
            <dash-button>
              {{ $t('edit') }}
            </dash-button>
          </template>
        </template>
      </dash-table>
      <div v-if="error">Error: {{ error.message }}</div>
      <div v-else-if="votings == null" class="nalagalnik"></div>
    </div>
  </dash-wrapper>
</template>

<script>
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashLoadingButton from 'components/Dashboard/LoadingButton.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import TfidfModalContent from 'components/Dashboard/TfidfModalContent.vue';
import SearchDropdown from 'components/SearchDropdown.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardVotings',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    DashLoadingButton,
    TfidfModalContent,
    SearchDropdown,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      sessionId: this.$options.cardData.parlaState && this.$options.cardData.parlaState.session,
      votings: null,
      motions: null,
      tags: null,
      tfidfModalOpen: false,
      tfidfModalData: null,
      error: null,
    };
  },
  computed: {
    columns() {
      return [
        // { id: 'name', label: this.$t('name') },
        { id: 'tags', label: this.$t('tags') },
        { id: 'result', label: this.$t('result') },
        { id: 'votes', label: this.$t('votes') },
        { id: 'abstract', label: this.$t('abstract') },
      ];
    },
    mappedItems() {
      if (this.votings) {
        return this.votings.map(voting => [
          { text: voting.name },
          { tags: voting.tags },
          { result: voting.result },
          { votes: voting.results },
          { voting },
        ]);
      }
      return [];
    },
  },
  mounted() {
    Promise.all([
      this.$parlapi.getVotings(this.sessionId),
      this.$parlapi.getMotions(this.sessionId),
      this.$parlapi.getTags(),
    ])
      .then(([votings, motions, tags]) => {
        this.votings = votings.data.results;
        this.motions = motions.data.results;
        this.tags = tags.data.results;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });
  },
  methods: {
    mappedTags(tags) {
      const mapped = this.tags.map(tag => ({
        label: tag.name,
        id: tag.id,
        selected: tags && tags.indexOf(tag.name) !== -1,
      }));
      return mapped;
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-votings-list {
  /deep/ .table-contents {
    .table-row {
      flex-wrap: wrap;
      padding: 10px 0;

      .table-col:first-child {
        flex: 0;
        flex-basis: 100%;
      }
    }
  }
}
</style>
