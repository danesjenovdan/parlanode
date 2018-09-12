<template>
  <div>
    <dash-wrapper :id="$options.cardData.cardData._id">
      <div id="dash-organisations-list">
        <div>
          <input
            id="partiesOnly"
            v-model="partiesOnly"
            type="checkbox"
            class="checkbox"
          >
          <label for="partiesOnly">{{ $t('only-parties') }}</label>
        </div>
        <dash-table
          :items="mappedItems"
          :columns="columns"
          :paginate="50"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              {{ column.org._name }} ({{ column.org._acronym }})
            </template>
            <template v-if="index === 1">
              <dash-button @click="openInfoModal(column.org)">
                {{ $t('edit-info') }}
              </dash-button>
            </template>
            <template v-if="(index === 2) && (column.org.classification === 'pg')">
              <dash-button @click="openTfidfModal(column.org)">
                TFIDF
              </dash-button>
            </template>
            <template v-if="(index === 3)">
              <dash-button @click="openMembershipsModal(column.org)">
                {{ $t('edit-memberships') }}
              </dash-button>
            </template>
          </template>
        </dash-table>
        <div v-if="error">Error: {{ error.message }}</div>
        <div v-else-if="orgs == null" class="nalagalnik"></div>
      </div>
    </dash-wrapper>
    <dash-fancy-modal
      v-if="tfidfModalOpen && tfidfModalData"
      :data="tfidfModalData"
      @closed="closeTfidfModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-tfidf :data="loadedData.data" />
      </template>
    </dash-fancy-modal>
    <dash-fancy-modal
      v-if="infoModalOpen && infoModalData"
      :data="infoModalData"
      @closed="closeInfoModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-organisation-info :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
    <dash-fancy-modal
      v-if="membershipsModalOpen && membershipsModalData"
      :data="membershipsModalData"
      @closed="closeMembershipsModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-organisation-memberships :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import { sortBy, assign } from 'lodash';
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import ModalContentTfidf from 'components/Dashboard/ModalContentTfidf.vue';
import ModalContentOrganisationInfo from 'components/Dashboard/ModalContentOrganisationInfo.vue';
import ModalContentOrganisationMemberships from 'components/Dashboard/ModalContentOrganisationMemberships.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardOrgs',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    ModalContentTfidf,
    ModalContentOrganisationInfo,
    ModalContentOrganisationMemberships,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      partiesOnly: true,
      orgs: null,
      tfidfModalOpen: false,
      tfidfModalData: null,
      infoModalOpen: false,
      infoModalData: null,
      membershipsModalOpen: false,
      membershipsModalData: null,
      error: null,
    };
  },
  computed: {
    columns() {
      return [
        { id: 'name', label: this.$t('name') },
        { id: 'info', label: 'INFO' },
        { id: 'tfidf', label: 'TFIDF' },
        { id: 'memberships', label: this.$t('edit-memberships') },
      ];
    },
    mappedItems() {
      if (this.orgs) {
        return this.orgs.map(org => [
          { org },
          { org },
          { org },
          { org },
        ]);
      }
      return [];
    },
  },
  watch: {
    partiesOnly() {
      this.fetchOrgs();
    },
  },
  mounted() {
    this.fetchOrgs();
  },
  methods: {
    fetchOrgs() {
      this.orgs = null;
      this.error = null;

      (
        this.partiesOnly
          ? this.$parlapi.getParties()
          : this.$parlapi.getAllOrganisations()
      )
        .then((orgs) => {
          console.log(orgs.data.results[1]);
          this.orgs = sortBy(orgs.data.results, ['_name']);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },
    openTfidfModal(org) {
      this.tfidfModalData = {
        title: `TFIDF - ${org._name}`,
        loadData: async () => {
          const data = await this.$parlapi.getOrganisationTFIDF(org.id);
          const tfidf = data.data.results.length && data.data.results[0];
          return {
            id: tfidf.id,
            data: tfidf.data,
          };
        },
        saveData: tfidf => this.$parlapi.patchOrganisationTFIDF(tfidf.id, tfidf),
      };
      this.tfidfModalOpen = true;
    },
    closeTfidfModal() {
      this.tfidfModalData = null;
      this.tfidfModalOpen = false;
    },
    openInfoModal(org) {
      this.infoModalData = {
        title: `INFO - ${org._name}`,
        loadData: async () => {
          const links = await this.$parlapi.getOrganisationSocialLinks(org.id);
          return {
            org: {
              _name: org._name,
              _acronym: org._acronym,
              classification: org.classification,
            },
            social: links.data.results,
          };
        },
        saveData: async (orgInfo) => {
          assign(org, orgInfo.org);
          return this.$parlapi.patchOrganisation(org.id, org);
          // console.log(data);
          // return {};
        },
      };
      this.infoModalOpen = true;
    },
    closeInfoModal() {
      this.infoModalData = null;
      this.infoModalOpen = false;
    },
    openMembershipsModal(org) {
      this.membershipsModalData = {
        title: `${this.$t('edit-memberships')} - ${org._name}`,
        loadData: async () => {
          const data = await this.$parlapi.getOrganisationMemberships(org.id);
          console.log(data);
          const theData = data.data.results;
          return {
            id: org.id,
            data: theData,
          };
          // const tfidf = data.data.results.length && data.data.results[0];
          // return {
          //   id: tfidf.id,
          //   data: tfidf.data,
          // };
        },
        saveData: (theData) => {
          console.log(theData);
          // this.$parlapi.patchOrganisationTFIDF(tfidf.id, tfidf),
        },
      };
      this.membershipsModalOpen = true;
    },
    closeMembershipsModal() {
      this.membershipsModalData = null;
      this.membershipsModalOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-organisations-list /deep/ {
  .table-contents,
  .table-headers {
    .table-row {
      .table-col:nth-child(1) {
        align-items: flex-start;
        flex: 2;
      }

      .table-col:nth-child(3) {
        flex: 0.5;
      }
    }
  }
}
</style>
