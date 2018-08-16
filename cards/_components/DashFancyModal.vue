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
        <div v-else>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. A ullam nesciunt illum quidem neque doloribus repellat accusamus expedita accusantium similique. Reiciendis incidunt expedita aliquam reprehenderit provident. Alias aut fugiat dolores.
        </div>
        <div class="card-modal-buttons">
          <div v-if="data.generateData" class="card-modal-button">{{ $t('generate') }}</div>
          <div v-if="data.loadData" class="card-modal-button">{{ $t('load') }}</div>
          <div v-if="data.saveData" class="card-modal-button">{{ $t('save') }}</div>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import Modal from 'components/Modal.vue';

export default {
  name: 'DashFancyModal',
  components: {
    Modal,
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
      fields: null,
      loading: true,
    };
  },
  mounted() {
    document.body.classList.add('modal-open');
    if (this.data.loadData) {
      this.data.loadData()
        .then((data) => {
          this.fields = data;
          this.loading = false;
        });
    }
  },
  beforeDestroy() {
    document.body.classList.remove('modal-open');
  },
  methods: {
    modalClosed() {
      this.modalOpen = false;
      this.$emit('closed');
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

    .card-modal-button {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      line-height: 18px;
      padding: 6px 12px;

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}
/*
Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }
.modal-scrollbar-measure {
  position: absolute;
  top: -9999px;
  width: 50px;
  height: 50px;
  overflow: scroll;
}
*/

</style>
