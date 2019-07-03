<template>
  <div>
    <dash-wrapper :id="$options.cardData.mountId">
      <div id="dash-votings-list">
        <div v-if="votings != null" class="filters">
          <input
            v-model="filterQuery"
            :placeholder="$t('search')"
            class="form-control"
          >
        </div>
        <dash-table
          :items="mappedItems"
          :paginate="10"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              <label>
                {{ $t('name') }}
                <small>{{ column.voting.start_time }}</small>
              </label>
              <input v-model="column.voting.name" class="form-control">
            </template>
            <template v-if="index === 1">
              <label>
                {{ $t('tags') }}
                <small><dash-button @click="openTagModal">+</dash-button></small>
              </label>
              <dash-array-selector
                v-model="column.tags"
                :options="tags"
                small
              />
            </template>
            <template v-if="index === 2">
              <dash-loading-button :load="saveData(column.voting)">
                {{ $t('save') }}
              </dash-loading-button>
            </template>
          </template>
        </dash-table>
        <div v-if="votings != null" class="save-all-container">
          <dash-loading-button :load="saveAllData" class="save-all-button">
            {{ $t('save-all') }}
          </dash-loading-button>
        </div>
        <div v-if="error">Error: {{ error.message }}</div>
        <div v-else-if="votings == null" class="nalagalnik"></div>
      </div>
    </dash-wrapper>
    <dash-fancy-modal
      v-if="tagModalOpen && tagModalData"
      :data="tagModalData"
      @closed="closeTagModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <input
          v-model.trim="loadedData.newTagName"
          class="form-control"
        >
        <div v-for="tag in loadedData.tags" :key="tag.slug">
          {{ tag.name }}
        </div>
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
import { orderBy } from 'lodash';
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashLoadingButton from 'components/Dashboard/LoadingButton.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import DashArraySelector from 'components/Dashboard/ArraySelector.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardVotings',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    DashLoadingButton,
    DashArraySelector,
    PSearchDropdown,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      votings: null,
      tags: null,
      session: null,
      tagModalOpen: false,
      tagModalData: null,
      error: null,
      filterQuery: '',
    };
  },
  computed: {
    mappedItems() {
      if (this.votings) {
        const q = this.filterQuery.toLowerCase();
        return this.votings
          .filter(v => v.name.toLowerCase().indexOf(q) !== -1)
          .map((voting) => {
            return [
              { voting },
              { tags: voting.tags },
              { voting },
              { voting },
            ];
          });
      }
      return [];
    },
  },
  mounted() {
    Promise.all([
      this.$parlapi.getUntaggedVotings(),
      this.$parlapi.getTags(),
    ])
      .then(([votings, tags]) => {
        console.log(votings);
        this.votings = orderBy(votings.data.results, ['start_time'], ['desc']);
        this.tags = tags.data.results;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });
  },
  methods: {
    openTagModal() {
      this.tagModalData = {
        title: this.$t('add-tag'),
        loadData: async () => ({
          newTagName: '',
        }),
        saveData: async (tagData) => {
          await this.$parlapi.postTag({
            name: tagData.newTagName,
            slug: tagData.newTagName.toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/--+/g, '-')
              .replace(/^-|-$/g, ''),
          });
          const tags = await this.$parlapi.getTags();
          this.tags = tags.data.results;
          tagData.newTagName = '';
        },
      };
      this.tagModalOpen = true;
    },
    closeTagModal() {
      this.tagModalData = null;
      this.tagModalOpen = false;
    },
    saveData(voting) {
      return () => {
        return Promise.all([
          this.$parlapi.patchVoting(voting.id, voting),
        ])
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            this.error = error;
          });
      };
    },
    async saveAllData() {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (!confirm('Warning! This will save *EVERYTHING* on all pages!')) {
        return;
      }

      // this is purposefully sequential to not spam the api all at once
      // eslint-disable-next-line no-restricted-syntax
      for (const voting of this.votings) {
        // eslint-disable-next-line no-await-in-loop
        await this.saveData(voting)();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container,
/deep/ .card-content {
  overflow: visible;
}

#dash-votings-list /deep/ {
  .table-contents,
  .table-headers {
    .table-row {
      .table-col:nth-child(1) {
        flex: 0;
        flex-basis: 100%;
        padding-bottom: 10px;
      }

      .table-col:nth-child(2) {
        flex: 2.3;
      }

      .table-col:nth-child(4) {
        flex: 1.2;
      }

      .table-col:nth-child(5),
      .table-col:nth-child(6) {
        flex-grow: 0;
        flex-basis: auto;
        justify-content: flex-end;
      }

      label {
        .dash-button {
          padding: 2px 6px;
        }
      }
    }
  }

  .search-dropdown {
    width: 100%;
  }

  .vote-results {
    display: flex;
    flex-wrap: wrap;

    .vote-result-number {
      flex: 1;
      flex-basis: 50%;
    }
  }

  .save-all-container {
    text-align: right;
  }
}
</style>
