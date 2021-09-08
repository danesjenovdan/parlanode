<template>
  <div class="presence-list">
    <div v-for="entry in data" :key="entry.group?.slug" class="presence-item">
      <div class="presence">
        <div class="percent">{{ formatNumber(entry.value) }}</div>
        <div class="party">
          {{ entry.group?.acronym || entry.group?.name || 'N/A' }}
        </div>
        <div
          :class="[
            'line',
            '${obj.org.acronym.replace(/[ +,]/g, \'_\').toLowerCase()}-background',
          ]"
          :style="`width: ${entry.value}%;`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import numberFormatter from '@/_helpers/numberFormatter.js';

export default {
  name: 'PrisotnostPoPoslanskihSkupinah',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatNumber(number) {
      return numberFormatter(number, { percent: true });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.presence-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin: 10px 0 15px;

  .presence-item {
    display: flex;

    .presence {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 12px 17px 12px;
      text-align: center;
      background: $background;
      position: relative;

      .percent,
      .party {
        color: $font-default;
      }

      .percent {
        font-size: 32px;
        line-height: 38px;
        font-weight: 500;

        @include respond-to(mobile) {
          font-size: 26px;
        }
      }

      .party {
        flex: 1;
        font-size: 20px;
        line-height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;

        @include respond-to(mobile) {
          font-size: 18px;
          line-height: 22px;
        }
      }

      .line {
        height: 5px;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: $font-default;
      }
    }
  }
}
</style>
