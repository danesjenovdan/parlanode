<template>
  <div class="modal-container">
    <div class="modal-backdrop fade in"></div>
    <div class="modal" style="display:block">
      <modal
        v-if="modalOpen"
        :header="data.title"
        :show-button="false"
        @close="modalClosed"
      >
        <div v-if="loading" class="nalagalnik"></div>
        <div v-else-if="loadedData">
          <slot :loaded-data="loadedData" name="modal-data">
            {{ loadedData }}
          </slot>
        </div>
        <div v-if="error" class="error-message">Error: {{ error.message }}</div>
        <div class="card-modal-buttons">
          <dash-button
            v-if="data.generateData"
            :disabled="buttonsDisabled"
            @click="generateData"
          >
            {{ $t('generate') }}
          </dash-button>
          <dash-button
            v-if="data.loadData"
            :disabled="buttonsDisabled"
            @click="loadData"
          >
            {{ $t('load') }}
          </dash-button>
          <dash-button
            v-if="data.saveData"
            :disabled="buttonsDisabled"
            @click="saveData(loadedData)"
          >
            {{ $t('save') }}
          </dash-button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import Modal from 'components/Modal.vue';
import DashButton from 'components/Dashboard/Button.vue';

export default {
  name: 'DashboardFancyModal',
  components: {
    Modal,
    DashButton,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      modalOpen: true,
      loadedData: null,
      loading: true,
      saving: false,
      generating: false,
      error: null,
    };
  },
  computed: {
    buttonsDisabled() {
      return this.loading || this.saving || this.generating;
    },
  },
  mounted() {
    document.body.classList.add('modal-open');
    if (this.data.loadData) {
      this.loadData();
    } else {
      this.loading = false;
    }
  },
  beforeDestroy() {
    document.body.classList.remove('modal-open');
  },
  methods: {
    modalClosed() {
      this.modalOpen = false;
      // make sure v-dom-portal has time to remove element from dom
      this.$nextTick(() => {
        this.$emit('closed');
      });
    },
    loadData() {
      if (this.data.loadData) {
        this.loading = true;
        this.data.loadData()
          .then((data) => {
            this.loadedData = data;
            this.loading = false;
            console.log(this.loadedData);
          })
          .catch((error) => {
            this.error = error;
            this.loading = false;
          });
      }
    },
    saveData(loadedData) {
      if (this.data.saveData) {
        this.saving = true;
        this.data.saveData(loadedData)
          .then(() => {
            this.saving = false;
          })
          .catch((error) => {
            this.error = error;
            this.saving = false;
          });
      }
    },
    generateData() {
      if (this.data.generateData) {
        this.generating = true;
        this.data.generateData()
          .then(() => {
            this.generating = false;
          })
          .catch((error) => {
            this.error = error;
            this.generating = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-container /deep/ .card-modal {
  width: 600px;
  z-index: 1050;

  .card-modal-buttons {
    display: flex;
    margin-top: 10px;

    .dash-button {
      flex: 1;

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}

.error-message {
  font-weight: 500;
  margin: 12px 0 0 0;
  text-align: center;
  font-size: 16px;
}
</style>
