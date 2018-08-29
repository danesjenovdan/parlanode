<template>
  <dash-wrapper :id="$options.cardData.cardData._id">
    <div id="dash-sessions-list">
      <dash-table
        :columns="columns"
        :items="mappedItems"
      >
        <template slot="item-col" slot-scope="{ column, index }">
          <template v-if="index === 1">
            <dash-button @click="window.location.href = `/votings/${column.id}`">
              {{ $t('votings') }}
            </dash-button>
          </template>
          <template v-else-if="index === 2">
            <dash-button @click="openTfidfModal(column.session)">
              TFIDF
            </dash-button>
          </template>
          <template v-else-if="index === 3">
            <dash-loading-button :load="updateSession(column.session)">
              {{ $t('update-session') }}
            </dash-loading-button>
          </template>
          <template v-else>{{ column.text }}</template>
        </template>
      </dash-table>
      <div v-if="error">Error: {{ error.message }}</div>
      <div v-else-if="sessions == null" class="nalagalnik"></div>
    </div>
    <dash-fancy-modal
      v-if="tfidfModalOpen && tfidfModalData"
      :data="tfidfModalData"
      @closed="closeTfidfModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-tfidf :data="loadedData.data" />
      </template>
    </dash-fancy-modal>
  </dash-wrapper>
</template>

<script>
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashLoadingButton from 'components/Dashboard/LoadingButton.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import ModalContentTfidf from 'components/Dashboard/ModalContentTfidf.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardSessions',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    DashLoadingButton,
    ModalContentTfidf,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      sessions: null,
      tfidfModalOpen: false,
      tfidfModalData: null,
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
        return this.sessions.map(session => [
          { text: session.name, id: session.id },
          { id: session.id },
          { session },
          { session },
        ]);
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
    openTfidfModal(session) {
      this.tfidfModalData = {
        title: `TFIDF - ${session.name}`,
        loadData: async () => {
          const data = await this.$parlapi.getSessionTFIDF(session.id);
          const tfidf = data.data.results.length && data.data.results[0];
          return {
            id: tfidf.id,
            data: tfidf.data,
          };
        },
        saveData: tfidf => this.$parlapi.patchSessionsTFIDF(tfidf.id, tfidf),
      };
      this.tfidfModalOpen = true;
    },
    closeTfidfModal() {
      this.tfidfModalData = null;
      this.tfidfModalOpen = false;
    },
    updateSession(session) {
      return () => this.$parlapi.updateSession(session.id);
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-sessions-list /deep/ {
  .table-contents,
  .table-headers {
    .table-row {
      .table-col:nth-child(1) {
        align-items: flex-start;
      }
    }
  }
}
</style>
