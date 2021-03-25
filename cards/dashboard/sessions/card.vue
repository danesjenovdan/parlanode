<template>
  <div>
    <dash-wrapper :id="$options.cardData.mountId">
      <div id="dash-sessions-list">
        <p-search-dropdown
          v-if="orgs"
          v-model="orgs"
          single
          @select="onSelectOrg"
        />
        <dash-table :columns="columns" :items="mappedItems" :paginate="50">
          <template #item-col="{ column, index }">
            <template v-if="index === 1">
              <small>{{ column.session.start_time }}</small>
            </template>
            <template v-if="index === 2">
              <dash-button
                @click="navigate(`?page=votings&session=${column.id}`)"
              >
                {{ $t('votings') }}
              </dash-button>
            </template>
            <template v-else-if="index === 3">
              <dash-button @click="openTfidfModal(column.session)">
                TFIDF
              </dash-button>
            </template>
            <template v-else-if="index === 4">
              <dash-loading-button :load="updateSession(column.session)">
                {{ $t('update-session') }}
              </dash-loading-button>
            </template>
            <template v-else>{{ column.text }}</template>
          </template>
        </dash-table>
        <div v-if="error">Error: {{ error.message }}</div>
        <div v-else-if="orgs == null || loading" class="nalagalnik"></div>
      </div>
    </dash-wrapper>
    <dash-fancy-modal
      v-if="tfidfModalOpen && tfidfModalData"
      :data="tfidfModalData"
      @closed="closeTfidfModal"
    >
      <template #modal-data="{ loadedData }">
        <modal-content-tfidf :data="loadedData.data" />
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
import { orderBy } from 'lodash';
import common from '@/_mixins/common';
import DashWrapper from '@/_components/Dashboard/Wrapper.vue';
import DashTable from '@/_components/Dashboard/Table.vue';
import DashButton from '@/_components/Dashboard/Button.vue';
import DashLoadingButton from '@/_components/Dashboard/LoadingButton.vue';
import DashFancyModal from '@/_components/Dashboard/FancyModal.vue';
import ModalContentTfidf from '@/_components/Dashboard/ModalContentTfidf.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import parlapi from '@/_mixins/parlapi';

export default {
  name: 'DashboardSessions',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    DashLoadingButton,
    ModalContentTfidf,
    PSearchDropdown,
  },
  mixins: [common, parlapi],
  data() {
    return {
      orgs: null,
      sessions: null,
      selectedOrgId: null,
      tfidfModalOpen: false,
      tfidfModalData: null,
      error: null,
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        { id: 'name', label: this.$t('name') },
        { id: 'start_time', label: '' },
        { id: 'votings', label: this.$t('votings') },
        { id: 'tfidf', label: 'TFIDF' },
        { id: 'update', label: this.$t('update-session') },
      ];
    },
    mappedItems() {
      if (this.sessions) {
        return this.sessions.map((session) => [
          { text: session.name, id: session.id },
          { session },
          { id: session.id },
          { session },
          { session },
        ]);
      }
      return [];
    },
  },
  mounted() {
    this.loadOrgs();
  },
  methods: {
    loadOrgs() {
      this.$parlapi
        .getAllOrganisations()
        .then((res) => {
          const orgId = Number(
            localStorage.getItem('selected_sessions_organization')
          );
          this.orgs = orderBy(res.data.results, ['_name']).map((org) => ({
            id: org.id,
            // eslint-disable-next-line no-underscore-dangle
            label: org._name,
            selected: orgId ? org.id === orgId : false,
          }));
          if (orgId) {
            this.onSelectOrg(orgId);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },
    loadSessions() {
      this.loading = true;
      this.$parlapi
        .getSessions(this.selectedOrgId)
        .then((res) => {
          this.sessions = orderBy(res.data.results, ['start_time'], ['desc']);
          this.loading = false;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },
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
        saveData: (tfidf) => this.$parlapi.patchSessionTFIDF(tfidf.id, tfidf),
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
    navigate(url) {
      window.location.href = url;
    },
    onSelectOrg(orgId) {
      this.selectedOrgId = orgId;
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        localStorage.setItem('selected_sessions_organization', orgId);
      }
      this.loadSessions();
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-sessions-list {
  min-height: 400px;
}

#dash-sessions-list ::v-deep {
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
