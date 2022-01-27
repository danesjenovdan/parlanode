<template>
  <div class="item">
    <div class="column name-col">
      <div>
        <a :href="getLegislationLink(law)" class="funblue-light-hover">
          {{ law.text }}
        </a>
      </div>
    </div>
    <!-- <div class="column epa-col">{{ epa }}</div> -->
    <div class="column result-col">
      <div>
        <div class="outcome">
          <i :class="['parlaicon', status.iconClass]" />
          <div class="text">{{ $t(status.translationKey) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import links from '@/_mixins/links.js';
import legislationStatus from '@/_helpers/legislationStatus.js';

export default {
  mixins: [links],
  props: {
    law: {
      type: Object,
      required: true,
    },
  },
  computed: {
    status() {
      return legislationStatus(this.law.status);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.item {
  @include respond-to(mobile) {
    flex-direction: column;
  }

  .column {
    &.name-col {
      flex: 3;
      font-size: 14px;

      a {
        margin-left: -0.3em;
        padding: 0.15em 0.3em;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
      }
    }

    &.result-col {
      .outcome .text {
        min-width: 92px;

        @include respond-to(mobile) {
          min-width: 75px;
          font-size: 14px !important;
        }
      }

      @include respond-to(mobile) {
        margin-left: 8px;
        margin-top: 25px;
      }
    }
  }
}
</style>
