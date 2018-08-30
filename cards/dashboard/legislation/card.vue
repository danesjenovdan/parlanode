<template>
  <div>
    <dash-wrapper :id="$options.cardData.cardData._id">
      <div id="dash-legislation-list">
        <dash-table
          :items="mappedItems"
        >
          <template slot="item-col" slot-scope="{ column, index }">
            <template v-if="index === 0">
              <label>{{ $t('name') }}</label>
              <input v-model="column.legislation.text" class="form-control">
            </template>
            <template v-if="index === 1">
              <label>{{ $t('epa') }}</label>
              <input v-model="column.legislation.epa" class="form-control">
            </template>
            <template v-if="index === 2">
              <label>{{ $t('status') }}</label>
              <p-search-dropdown
                v-model="column.status"
                single
                small
                @select="changeStatus(column.id, $event)"
              />
            </template>
            <template v-if="index === 3">
              <label>{{ $t('result') }}</label>
              <p-search-dropdown
                v-model="column.result"
                single
                small
                @select="changeResult(column.id, $event)"
              />
            </template>
            <template v-if="index === 4">
              <dash-button @click="openAbstractModal(column.legislation)">
                {{ $t('edit-abstract') }}
              </dash-button>
            </template>
            <template v-if="index === 5">
              <dash-loading-button :load="saveData(column.legislation)">
                {{ $t('save') }}
              </dash-loading-button>
            </template>
          </template>
        </dash-table>
        <div v-if="error">Error: {{ error.message }}</div>
        <div v-else-if="legislation == null" class="nalagalnik"></div>
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
import { assign } from 'lodash';
import common from 'mixins/common';
import DashWrapper from 'components/Dashboard/Wrapper.vue';
import DashTable from 'components/Dashboard/Table.vue';
import DashButton from 'components/Dashboard/Button.vue';
import DashLoadingButton from 'components/Dashboard/LoadingButton.vue';
import DashFancyModal from 'components/Dashboard/FancyModal.vue';
import ModalContentAbstract from 'components/Dashboard/ModalContentAbstract.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import parlapi from 'mixins/parlapi';

export default {
  name: 'DashboardLegislation',
  components: {
    DashWrapper,
    DashTable,
    DashButton,
    DashFancyModal,
    DashLoadingButton,
    PSearchDropdown,
    ModalContentAbstract,
  },
  mixins: [
    common,
    parlapi,
  ],
  data() {
    return {
      legislation: null,
      abstractModalOpen: false,
      abstractModalData: null,
      error: null,
    };
  },
  computed: {
    columns() {
      return [
        { id: 'abstract', label: this.$t('abstract') },
        { id: 'abstract2', label: this.$t('extra-abstract') },
        { id: 'icon', label: this.$t('icon') },
      ];
    },
    mappedItems() {
      if (this.legislation) {
        return this.legislation.map(legislation => [
          { legislation },
          { legislation },
          {
            id: legislation.id,
            status: this.statusOptions.map(([key, val]) => ({
              id: key,
              label: this.$t(`vote-result--${key}`),
              selected: legislation.status === val,
            })),
          },
          {
            id: legislation.id,
            result: this.resultOptions.map(([key, val]) => ({
              id: key,
              label: this.$t(`vote-result--${key}`),
              selected: legislation.result === val,
            })),
          },
          { legislation },
          { legislation },
        ]);
      }
      return [];
    },
  },
  mounted() {
    this.$parlapi.getLegislation()
      .then((res) => {
        this.legislation = res.data.results;
        this.statusOptions = res.data.status_options;
        this.resultOptions = res.data.result_options;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });
  },
  methods: {
    changeStatus(legislationId, value) {
      const legislation = this.legislation.find(l => l.id === legislationId);
      if (legislation) {
        legislation.status = value;
      }
    },
    changeResult(legislationId, value) {
      const legislation = this.legislation.find(l => l.id === legislationId);
      if (legislation) {
        legislation.result = value;
      }
    },
    openAbstractModal(legislation) {
      this.abstractModalData = {
        title: `Abstract - ${legislation.text}`,
        loadData: async () => ({
          note: legislation.note,
          extra_note: legislation.extra_note,
          abstractVisible: legislation.abstractVisible,
        }),
        saveData: async (abstractInfo) => {
          assign(legislation, abstractInfo);
          return this.$parlapi.patchLegislation(legislation.id, abstractInfo);
        },
      };
      this.abstractModalOpen = true;
    },
    closeAbstractModal() {
      this.abstractModalData = null;
      this.abstractModalOpen = false;
    },
    saveData(legislation) {
      return () => this.$parlapi.patchLegislation(legislation.id, legislation)
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#dash-legislation-list /deep/ {
  .table-contents,
  .table-headers {
    .table-row {
      .table-col:nth-child(1) {
        flex: 0;
        flex-basis: 100%;
        padding-bottom: 10px;
      }

      .table-col:nth-child(5),
      .table-col:nth-child(6) {
        flex-grow: 0;
        flex-basis: auto;
        justify-content: flex-end;
      }
    }
  }

  textarea {
    resize: none;
  }
}
</style>
