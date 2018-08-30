<template>
  <div>
    <dash-wrapper :id="$options.cardData.cardData._id">
      <div id="dash-people-list">
        <dash-table
          :items="mappedItems"
          :columns="columns"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              {{ column.person.name }}
            </template>
            <template v-if="index === 1">
              <dash-button @click="openInfoModal(column.person)">
                {{ $t('edit-info') }}
              </dash-button>
            </template>
            <template v-if="index === 2">
              <dash-button @click="openTfidfModal(column.person)">
                TFIDF
              </dash-button>
            </template>
          </template>
        </dash-table>
        <div v-if="error">Error: {{ error.message }}</div>
        <div v-else-if="people == null" class="nalagalnik"></div>
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
        {{ loadedData }}
        <!--
          I NEED:
            - number of votes
            - district
            - no. of mandates
            - prev status
            - izobrazba
            - birth date
          NOT IN THIS API:
            - party: se bo na organizacijah štelal
            - social networks
         -->
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import ModalContentTfidf from 'components/Dashboard/ModalContentTfidf.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardPeople',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    ModalContentTfidf,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      people: null,
      tfidfModalOpen: false,
      tfidfModalData: null,
      infoModalOpen: false,
      infoModalData: null,
      error: null,
    };
  },
  computed: {
    columns() {
      return [
        { id: 'name', label: this.$t('name') },
        { id: 'info', label: 'INFO' },
        { id: 'tfidf', label: 'TFIDF' },
      ];
    },
    mappedItems() {
      if (this.people) {
        return this.people.map(person => [
          { person },
          { person },
          { person },
        ]);
      }
      return [];
    },
  },
  mounted() {
    this.$parlapi.getPeople()
      .then((people) => {
        this.people = people.data.results;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });
  },
  methods: {
    openTfidfModal(person) {
      this.tfidfModalData = {
        title: `TFIDF - ${person.name}`,
        loadData: async () => {
          const data = await this.$parlapi.getPersonTFIDF(person.id);
          const tfidf = data.data.results.length && data.data.results[0];
          return {
            id: tfidf.id,
            data: tfidf.data,
          };
        },
        saveData: tfidf => this.$parlapi.patchPersonTFIDF(tfidf.id, tfidf),
      };
      this.tfidfModalOpen = true;
    },
    closeTfidfModal() {
      this.tfidfModalData = null;
      this.tfidfModalOpen = false;
    },
    openInfoModal(person) {
      this.infoModalData = {
        title: `INFO - ${person.name}`,
        loadData: async () => person,
        saveData: async (personInfo) => {
          // TODO: patchPerson here since we always save to server in these popup modals
          // patchPerson(person.id, personInfo)
        },
      };
      this.infoModalOpen = true;
    },
    closeInfoModal() {
      this.infoModalData = null;
      this.infoModalOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-people-list /deep/ {
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
