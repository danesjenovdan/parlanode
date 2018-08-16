<template>
  <dash-wrapper :id="$options.cardData.cardData._id">
    <div id="dash-sessions-list">
      <dashboard-table
        :columns="columns"
        :items="mappedItems"
      >
        <template slot="item-col" slot-scope="{ column, index }">
          <template v-if="index === 1">
            <dashboard-button disabled>{{ $t('votings') }}</dashboard-button>
          </template>
          <template v-else-if="index === 2">
            <dashboard-button @click="openModal(column.session)">
              TFIDF
            </dashboard-button>
          </template>
          <template v-else-if="index === 3">
            <dashboard-loading-button :load="updateSession(column.session)">
              {{ $t('update-session') }}
            </dashboard-loading-button>
          </template>
          <template v-else>{{ column.text }}</template>
        </template>
      </dashboard-table>
      <dashboard-fancy-modal
        v-if="modalOpen && modalData"
        :data="modalData"
        @closed="closeModal"
      />
      <div v-if="error">Error: {{ error.message }}</div>
      <div v-else-if="sessions == null" class="nalagalnik"></div>
    </div>
  </dash-wrapper>
</template>

<script>
import common from 'mixins/common';
import DashWrapper from 'components/Card/DashWrapper.vue';
import DashboardTable from 'components/DashboardTable.vue';
import DashboardButton from 'components/DashboardButton.vue';
import DashboardLoadingButton from 'components/DashboardLoadingButton.vue';
import DashboardFancyModal from 'components/DashboardFancyModal.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardTest',
  components: {
    DashWrapper,
    DashboardTable,
    DashboardButton,
    DashboardFancyModal,
    DashboardLoadingButton,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      sessions: null,
      modalOpen: false,
      modalData: null,
      error: null,
    };
  },
  computed: {
    columns() {
      return [
        { id: 'name', label: this.$t('name') },
        { id: 'votings', label: this.$t('votings') },
        { id: 'tfidf', label: 'TFIDF' },
        { id: 'update', label: this.$t('update-session') },
      ];
    },
    mappedItems() {
      if (this.sessions) {
        return this.sessions.map((session) => {
          return [
            { text: session.name },
            { id: session.id },
            { session },
            { session },
          ];
        });
      }
      return [];
    },
  },
  mounted() {
    this.$parlapi.getSessions()
      .then((res) => {
        this.sessions = res.data.results;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });
  },
  methods: {
    openModal(session) {
      this.modalData = {
        title: `TFIDF - ${session.name}`,
        loadData: () => {
          return this.$parlapi.getSessionTFIDF(session.id);
          // TODO: get data from this -^ response and return it
        },
        saveData: (fields) => {
          // TODO: get correct data from fields and call api with it
          const tfidf = fields;
          return this.$parlapi.patchSessionsTFIDF(tfidf);
        },
      };
      this.modalOpen = true;
    },
    closeModal() {
      this.modalData = null;
      this.modalOpen = false;
    },
    updateSession(session) {
      return () => this.$parlapi.updateSession(session.id);
    },
  },
};
</script>

<style lang="scss" scoped>
[disabled] {
  opacity: 0.6;
  filter: grayscale(100%);
  cursor: default;
  pointer-events: none;
}
</style>
