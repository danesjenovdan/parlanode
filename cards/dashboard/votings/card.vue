<template>
  <div>
    <dash-wrapper :id="$options.cardData.cardData._id">
      <div id="dash-votings-list">
        <dash-table
          :items="mappedItems"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              <label>{{ $t('name') }}</label>
              <input v-model="column.voting.name" class="form-control">
            </template>
            <template v-if="index === 1">
              <label>{{ $t('tags') }}</label>
              <dash-array-selector
                v-model="column.tags"
                :options="tags"
                single
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
                  {{ $t('vote-abstained-plural') }}: {{ column.votes.abstain }}
                </div>
                <div class="vote-result-number">
                  {{ $t('vote-not-plural') }}: {{ column.votes.absent }}
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
  </div>
</template>

<script>
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashLoadingButton from 'components/Dashboard/LoadingButton.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import DashArraySelector from 'components/Dashboard/ArraySelector.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import ModalContentAbstract from 'components/Dashboard/ModalContentAbstract.vue';
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
      abstractModalOpen: false,
      abstractModalData: null,
      error: null,
    };
  },
  computed: {
    mappedItems() {
      if (this.votings) {
        return this.votings.map((voting) => {
          const motion = this.motions.find(m => m.id === voting.motion);
          return [
            { voting },
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
  },
};
</script>

<style lang="scss" scoped>
#dashboard_votings {
  &.card-container,
  & /deep/ .card-content {
    overflow: visible;
  }
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
}
</style>
