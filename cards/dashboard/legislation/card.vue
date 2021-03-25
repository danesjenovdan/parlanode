<template>
  <div>
    <dash-wrapper :id="$options.cardData.mountId">
      <div id="dash-legislation-list">
        <div v-if="legislation != null" class="filters">
          <input
            v-model="filterQuery"
            :placeholder="$t('search')"
            class="form-control"
          />
        </div>
        <dash-table :items="mappedItems" :paginate="50">
          <template #item-col="{ column, index }">
            <template v-if="index === 0">
              <label>
                {{ $t('name') }}
                <div class="is-exposed-checkbox">
                  <input
                    :id="`is-exposed_${column.legislation.id}`"
                    v-model="column.legislation.is_exposed"
                    type="checkbox"
                    class="checkbox"
                  />
                  <label :for="`is-exposed_${column.legislation.id}`">{{
                    $t('exposed')
                  }}</label>
                </div>
              </label>
              <input v-model="column.legislation.text" class="form-control" />
            </template>
            <template v-if="index === 1">
              <label>{{ $t('epa') }}</label>
              <input v-model="column.legislation.epa" class="form-control" />
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
              <label>{{ $t('icon') }}</label>
              <p-search-dropdown
                v-model="column.icons"
                :manual-value="column.legislation.icon"
                allow-manual-value
                single
                small
                @select="column.legislation.icon = $event"
                @clear="column.legislation.icon = null"
              />
            </template>
            <template v-if="index === 6">
              <dash-loading-button :load="saveData(column.legislation)">
                {{ $t('save') }}
              </dash-loading-button>
            </template>
            <template v-if="index === 7 && !column.legislation.has_discussion">
              <dash-loading-button
                :load="createCommentality(column.legislation)"
              >
                {{ $t('create-commentality') }}
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
      <template #modal-data="{ loadedData }">
        <modal-content-abstract :loaded-data="loadedData" />
      </template>
    </dash-fancy-modal>
  </div>
</template>

<script>
import { orderBy, assign } from 'lodash';
import common from '@/_mixins/common';
import DashWrapper from '@/_components/Dashboard/Wrapper.vue';
import DashTable from '@/_components/Dashboard/Table.vue';
import DashButton from '@/_components/Dashboard/Button.vue';
import DashLoadingButton from '@/_components/Dashboard/LoadingButton.vue';
import DashFancyModal from '@/_components/Dashboard/FancyModal.vue';
import ModalContentAbstract from '@/_components/Dashboard/ModalContentAbstract.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import parlapi from '@/_mixins/parlapi';
import commentapi from '@/_mixins/commentapi';

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
  mixins: [common, parlapi, commentapi],
  data() {
    return {
      legislation: null,
      statusOptions: [],
      resultOptions: [],
      icons: [],
      abstractModalOpen: false,
      abstractModalData: null,
      error: null,
      filterQuery: '',
    };
  },
  computed: {
    statusLabels() {
      const obj = {};
      this.statusOptions.forEach(([key]) => {
        obj[key] = this.$t(`vote-result--${key}`);
      });
      return obj;
    },
    resultLabels() {
      const obj = {};
      this.resultOptions.forEach(([key]) => {
        obj[key] = this.$t(`vote-result--${key}`);
      });
      return obj;
    },
    mappedItems() {
      if (this.legislation && this.icons.length) {
        const q = this.filterQuery.toLowerCase();
        return this.legislation
          .filter(
            (l) =>
              l.text.toLowerCase().indexOf(q) !== -1 ||
              l.epa.toLowerCase().indexOf(q) !== -1
          )
          .map((legislation) => [
            { legislation },
            { legislation },
            {
              id: legislation.id,
              status: this.statusOptions.map(([key, val]) => ({
                id: key,
                label: this.statusLabels[key],
                selected: legislation.status === val,
              })),
            },
            {
              id: legislation.id,
              result: this.resultOptions.map(([key, val]) => ({
                id: key,
                label: this.resultLabels[key],
                selected: legislation.result === val,
              })),
            },
            { legislation },
            {
              legislation,
              icons: this.icons.map((icon) => ({
                id: icon,
                label: icon,
                selected: legislation.icon === icon,
                image: `${this.slugs.urls.cdn}/icons/legislation/${icon}`,
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
    this.$parlapi
      .getLegislation()
      .then((res) => {
        this.legislation = orderBy(res.data.results, ['date'], ['desc']);
        this.statusOptions = res.data.status_options;
        this.resultOptions = res.data.result_options;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });

    this.$parlapi
      .getLegislationIcons()
      .then((res) => {
        this.icons = res.data.icons;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error;
      });
  },
  methods: {
    changeStatus(legislationId, value) {
      const legislation = this.legislation.find((l) => l.id === legislationId);
      if (legislation) {
        legislation.status = value;
      }
    },
    changeResult(legislationId, value) {
      const legislation = this.legislation.find((l) => l.id === legislationId);
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
      return () =>
        this.$parlapi
          .patchLegislation(legislation.id, legislation)
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            this.error = error;
          });
    },
    createCommentality(legislation) {
      return () =>
        this.$commentapi
          .createArticle(legislation.epa)
          .then((response) => {
            console.log(response.data);
            legislation.has_discussion = true;
            return this.$parlapi.patchLegislation(legislation.id, {
              has_discussion: true,
            });
          })
          .then((response) => {
            console.log(response.data);
            window.open('https://frontmentality.djnd.si/admin.html', '_blank');
          })
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
.card-container,
::v-deep .card-content {
  overflow: visible;
}

#dash-legislation-list ::v-deep {
  .table-contents,
  .table-headers {
    .table-row {
      .table-col:nth-child(1) {
        flex: 0;
        flex-basis: 100%;
        padding-bottom: 10px;
      }

      .table-col:nth-child(5),
      .table-col:nth-child(7) {
        flex-grow: 0;
        flex-basis: auto;
        justify-content: flex-end;
      }

      .table-col:nth-child(8) {
        flex: 0;
        flex-basis: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
        align-items: flex-start;

        ::v-deep .dash-button {
          padding: 4px 11px 3px;
        }
      }
    }
  }

  textarea {
    resize: none;
  }

  .is-exposed-checkbox {
    float: right;
  }
}
</style>
