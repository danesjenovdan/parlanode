<template>
  <div>
    <dash-wrapper :id="$options.cardData.cardData._id">
      <div id="dash-people-list">
        <div>
          <input
            id="mpsOnly"
            v-model="mpsOnly"
            type="checkbox"
            class="checkbox"
          >
          <label for="mpsOnly">{{ $t('only-mps') }}</label>
        </div>
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
        <modal-content-person-info :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
import { assign, sortBy } from 'lodash';
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import ModalContentTfidf from 'components/Dashboard/ModalContentTfidf.vue';
import ModalContentPersonInfo from 'components/Dashboard/ModalContentPersonInfo.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardPeople',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    ModalContentTfidf,
    ModalContentPersonInfo,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      mpsOnly: true,
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
  watch: {
    mpsOnly() {
      this.fetchPeople();
    },
  },
  mounted() {
    this.fetchPeople();
  },
  methods: {
    fetchPeople() {
      this.people = null;
      this.error = null;

      (
        this.mpsOnly
          ? this.$parlapi.getPeopleMpsOnly()
          : this.$parlapi.getPeople()
      )
        .then((people) => {
          this.people = sortBy(people.data.results, ['name']);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },
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
        loadData: async () => {
          const links = await this.$parlapi.getPersonSocialLinks(person.id);
          return {
            person: {
              voters: person.voters,
              mandates: person.mandates,
              previous_occupation: person.previous_occupation,
              education: person.education,
              education_level: person.education_level,
              districts: person.districts,
              birth_date: person.birth_date,
            },
            social: links.data.results,
          };
        },
        saveData: async (personInfo) => {
          assign(person, personInfo.person);
          return this.$parlapi.patchPerson(person.id, person);
          // TODO: personInfo.social
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
