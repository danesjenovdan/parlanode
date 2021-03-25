<template>
  <div>
    <dash-wrapper :id="$options.cardData.mountId">
      <div id="dash-votings-list">
        <h4 v-if="session">{{ session.name }}</h4>
        <div v-if="votings != null" class="filters">
          <div class="filter-input">
            <input
              v-model="filterQuery"
              :placeholder="$t('search')"
              class="form-control"
            >
          </div>
          <div class="filter-sort">
            <p-search-dropdown
              v-model="sortOptions"
              single
              small
              hide-clear
              @select="sortBy = $event"
            />
          </div>
        </div>
        <dash-table
          :items="mappedItems"
          :paginate="10"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              <label>
                {{ $t('name') }}
                <span>
                  <small>{{ column.voting.start_time }}</small>
                  <small>
                    <dash-loading-button :load="() => deleteVoting(column.voting, column.motion)">
                      &times;
                    </dash-loading-button>
                  </small>
                </span>
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
              <label>{{ $t('result') }}</label>
              <p-search-dropdown
                v-model="column.result"
                single
                small
                @select="changeResult(column.id, $event)"
              />
            </template>
            <template v-if="index === 3">
              <label>{{ $t('votes') }}</label>
              <div class="vote-results">
                <div class="vote-result-number">
                  {{ $t('vote-for') }}: {{ column.votes.for }}
                </div>
                <div class="vote-result-number">
                  {{ $t('vote-against') }}: {{ column.votes.against }}
                </div>
                <div class="vote-result-number">
                  {{ $t('vote-abstain-plural') }}: {{ column.votes.abstain }}
                </div>
                <div class="vote-result-number">
                  {{ $t('vote-absent-plural') }}: {{ column.votes.absent }}
                </div>
              </div>
            </template>
            <template v-if="index === 4">
              <dash-button @click="openAbstractModal(column.voting)">
                {{ $t('edit-abstract') }}
              </dash-button>
            </template>
            <template v-if="index === 5">
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
      v-if="abstractModalOpen && abstractModalData"
      :data="abstractModalData"
      @closed="closeAbstractModal"
    >
      <template slot="modal-data" slot-scope="{ loadedData }">
        <modal-content-abstract :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
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
import common from '@/_mixins/common';
import DashWrapper from '@/_components/Dashboard/Wrapper.vue';
import DashTable from '@/_components/Dashboard/Table.vue';
import DashButton from '@/_components/Dashboard/Button.vue';
import DashLoadingButton from '@/_components/Dashboard/LoadingButton.vue';
import DashFancyModal from '@/_components/Dashboard/FancyModal.vue';
import DashArraySelector from '@/_components/Dashboard/ArraySelector.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import ModalContentAbstract from '@/_components/Dashboard/ModalContentAbstract.vue';
import parlapi from '@/_mixins/parlapi';

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
    ModalContentAbstract,
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
      session: null,
      abstractModalOpen: false,
      abstractModalData: null,
      tagModalOpen: false,
      tagModalData: null,
      error: null,
      filterQuery: '',
      sortBy: 'start_time',
      sortOptions: [
        {
          id: 'start_time',
          label: 'start_time',
          selected: true,
        },
        {
          id: 'name',
          label: this.$t('name'),
          selected: false,
        },
      ],
    };
  },
  computed: {
    mappedItems() {
      if (this.votings) {
        const q = this.filterQuery.toLowerCase();
        const sortedVotings = orderBy(this.votings, (o) => {
          const value = o[this.sortBy];
          return value.toLowerCase ? value.toLowerCase() : value;
        }, ['desc']);
        return sortedVotings
          .filter(v => v.name.toLowerCase().indexOf(q) !== -1)
          .map((voting) => {
            const motion = this.motions.find(m => m.id === voting.motion);
            return [
              { voting, motion },
              { tags: voting.tags },
              {
                id: motion.id,
                result: [
                  {
                    id: '0',
                    label: this.$t('vote-not-passed'),
                    selected: motion.result === '0',
                  },
                  {
                    id: '1',
                    label: this.$t('vote-passed'),
                    selected: motion.result === '1',
                  },
                ],
              },
              { votes: voting.results },
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
      this.$parlapi.getVotings(this.sessionId),
      this.$parlapi.getMotions(this.sessionId),
      this.$parlapi.getTags(),
      this.$parlapi.getSession(this.sessionId),
    ])
      .then(([votings, motions, tags, sessions]) => {
        this.votings = votings.data.results;
        this.motions = motions.data.results;
        this.tags = tags.data.results;
        this.session = sessions.data.results.length ? sessions.data.results[0] : {};
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });
  },
  methods: {
    changeSort(value) {
      this.sortBy = value;
    },
    changeResult(motionId, value) {
      const motion = this.motions.find(m => m.id === motionId);
      if (motion) {
        motion.result = value;
      }
    },
    openAbstractModal(voting) {
      this.abstractModalData = {
        title: `Abstract - ${voting.name}`,
        loadData: async () => {
          const data = await this.$parlapi.getVotingAbstract(voting.id);
          const abstract = data.data.results.length && data.data.results[0];
          return {
            id: abstract.id,
            note: abstract.note,
            abstractVisible: abstract.abstractVisible,
          };
        },
        saveData: abstract => this.$parlapi.patchVotingAbstract(abstract.id, abstract),
      };
      this.abstractModalOpen = true;
    },
    closeAbstractModal() {
      this.abstractModalData = null;
      this.abstractModalOpen = false;
    },
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
        const motion = this.motions.find(m => m.id === voting.motion);
        motion.text = voting.name;
        return Promise.all([
          this.$parlapi.patchVoting(voting.id, voting),
          this.$parlapi.patchMotion(motion.id, motion),
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
    async deleteVoting(voting, motion) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (!confirm(`Warning! This will *DELETE* "${voting.name}"!`)) {
        return;
      }
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (!confirm('Are you sure?')) {
        return;
      }
      await this.$parlapi.deleteVoting(voting.id);
      await this.$parlapi.deleteMotion(motion.id);
      const vIndex = this.votings.findIndex(v => v === voting);
      const mIndex = this.motions.findIndex(m => m === motion);
      this.votings.splice(vIndex, 1);
      this.motions.splice(mIndex, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container,
::v-deep .card-content {
  overflow: visible;
}

.filters {
  display: flex;

  .filter-input {
    flex: 3;
    margin-right: 10px;
  }

  .filter-sort {
    flex: 1;

    ::v-deep .search-dropdown-input {
      line-height: 22px;
      font-size: 14px;
    }
  }
}

#dash-votings-list ::v-deep {
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
