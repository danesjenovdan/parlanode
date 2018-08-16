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
            <dashboard-button @click="openModal(column.session)">TFIDF</dashboard-button>
          </template>
          <template v-else-if="index === 3">
            <dashboard-button disabled>{{ $t('update-session') }}</dashboard-button>
          </template>
          <template v-else>{{ column.text }}</template>
        </template>
      </dashboard-table>
      <dashboard-fancy-modal
        v-if="modalOpen && modalData"
        :data="modalData"
        @closed="closeModal"
      />
    </div>
  </dash-wrapper>
</template>

<script>
import axios from 'axios';
import common from 'mixins/common';
import DashWrapper from 'components/Card/DashWrapper.vue';
import DashboardTable from 'components/DashboardTable.vue';
import DashboardButton from 'components/DashboardButton.vue';
import DashboardFancyModal from 'components/DashboardFancyModal.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardTest',
  components: {
    DashWrapper,
    DashboardTable,
    DashboardButton,
    DashboardFancyModal,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      sessions: [],
      modalOpen: false,
      modalData: null,
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
      return this.sessions.map((session) => {
        return [
          { text: session.name },
          { id: session.id },
          { session },
          { id: session.id },
        ];
      });
    },
  },
  mounted() {
    this.$parlapi.getSessions()
      .then((res) => {
        this.sessions = res.data.results;
      });
  },
  methods: {
    openModal(session) {
      console.log(session);
      this.modalData = {
        title: `TFIDF - ${session.name}`,
        loadData: () => {
          return this.$parlapi.getSessionTFIDF(session.id);
        },
      };
      this.modalOpen = true;
    },
    closeModal() {
      this.modalData = null;
      this.modalOpen = false;
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
