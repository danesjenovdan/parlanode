<template>
  <a
    :href="`${slugs.urls.base}/seja/glasovanje/${ballot.session_id}/${ballot.vote_id}`"
    class="ballot"
  >
    <div class="disunion">
      <div :class="['icon', ballot.option]"></div>
      <div class="text">
        <span v-if="type === 'party'">{{ ballot.disunion | toPercent }}</span> {{ ballot.option }}
      </div>
    </div>
    <div class="name">
      <p>{{ ballot.motion }}</p>
    </div>
    <div class="outcome">
      <i :class="['glyphicon', `glyphicon-${ballot.result === true ? 'ok' : 'remove'}`]"></i>
      <div class="text">{{ ballot.outcome || 'Ni podatkov' }}</div>
    </div>
  </a>
</template>

<script>
import common from 'mixins/common';

export default {
  name: 'Ballot',
  filters: {
    toPercent(val) {
      return `${parseInt(val, 10)} %`;
    },
  },
  mixins: [common],
  props: {
    ballot: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: 'person',
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.ballot {
    @include respond-to(desktop) {
        display: flex;
        margin: 10px 0;
    }

    text-decoration: none;

    &:hover {
        text-decoration: none;
    }

    background: #f0f0f0;
    color: #505050;
    display: block;
    margin: 7px 0 8px;
    min-height: 90px;
    padding: 10px 14px;
    position: relative;

    .disunion {
        @include respond-to(mobile) {
        padding-bottom: 10px;
        }

        @include respond-to(desktop) {
        padding-right: 16px;
        }

        display: flex;

        flex-direction: column;
        justify-content: center;
        text-align: center;
    }

    .name {
        @include respond-to(desktop) {
        border-bottom: none;
        border-top: none;
        border-left: 1px solid #505050;
        align-items: center;
        display: flex;
        flex: 4;
        font-size: 14px;
        padding: 5px 20px;
        }

        border-bottom: 1px solid #505050;
        border-top: 1px solid #505050;
        font-family: Roboto Slab,Times New Roman,serif;
        font-size: 11px;
        font-weight: 300;
        line-height: 1.45em;
        padding: 10px 0;

        p {
        margin: 0;
        }
    }

    .outcome {
        @include respond-to(desktop) {
        border-left: 1px solid #505050;
        justify-content: left;
        padding: 0 0 0 16px;
        width: 136px;
        margin-right: 16px;
        }

        align-items: center;
        display: flex;
        justify-content: center;
        font-size: 13px;
        font-weight: bold;
        line-height: 13px;
        text-align: left;
        text-transform: uppercase;
        padding: 10px 0 0;

        @include respond-to(mobile) { margin: 0 15px; }

        .text {
        color: #333;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        margin-left: 6px;
        margin-top: 2px;
        }

        i {
        background-position: center;
        background-repeat: no-repeat;
        background-size: 28px;
        width: 29px;
        font-size: 25px;
        margin-right: 10px;
        line-height: 34px;

        &.glyphicon {
            font-size: 29px;

            &.glyphicon-ok {
            color: $funblue;
            }

            &.glyphicon-remove {
            color: $red;
            }
        }
        }
    }

    .icon {
      @include show-for(desktop);

      @include respond-to(mobile) {
        margin: 0 auto;
      }

      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: 29px;
      padding: 5px 55px;
      padding-top: 30px;
      text-transform: uppercase;
      font-size: 12px;
      display: flex;
      align-items: center;
      height: 42px;

      &.za { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/g_za_v2.svg"); }
      &.proti { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/g_proti_v2.svg"); }
      &.ni { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/ni_v2.svg"); }
      &.kvorum { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/g_vzdrzan_v2.svg"); }
    }

    .text {
      text-align: center;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 500;

      @include respond-to(desktop) {
        line-height: 12px;
      }
    }
}
</style>
