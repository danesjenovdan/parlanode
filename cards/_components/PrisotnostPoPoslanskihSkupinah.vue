<template>
  <div class="presence-list">
    <div v-for="obj in data" :key="obj.org.id" class="presence-item">
      <div class="presence">
        <div class="percent">{{ obj.percent }}%</div>
        <div class="party">{{ obj.org.acronym }}</div>
        <div
          :class="['line', `${obj.org.acronym.replace(/[ +,]/g, '_').toLowerCase()}-background`]"
          :style="`width: ${obj.percent}%;`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrisotnostPoPoslanskihSkupinah',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.presence-list {
  display: flex;
  flex-wrap: wrap;
  margin: 15px 0 20px 0;

  .presence-item {
    flex: 0 0 25%;
    display: flex;

    @include respond-to(limbo) {
      flex-basis: 50%;
    }

    @include respond-to(mobile) {
      flex-basis: 100%;
    }

    .presence {
      text-align: center;
      background: $background;
      padding: 12px;
      margin: 0 5px 10px 5px;
      position: relative;
      width: 100%;

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
        font-size: 20px;
        line-height: 24px;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;

        @include respond-to(mobile) {
          font-size: 18px;
          line-height: 22px;
          min-height: 44px;
        }
      }

      .line {
        height: 5px;
        font-size: 5px;
        line-height: 5px;
        // margin-top: 10px;
        position: absolute;
        bottom: 0;
        left: 0;

        @include respond-to(mobile) {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
