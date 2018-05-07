<template>
    <div class="partypin-container">
        <div
            :class="['partypin-tooltip', { visible: tooltipVisible}]"
            :ref="party.id">{{ party.name }}</div>
        <a
            :href="partyLink"
            class="avgminimg img-circle avgminimg-party img-circle"
            :class="partyCssClass"
            @mouseover="tooltipVisible = true"
            @mouseout="tooltipVisible = false"
        >{{ party.acronym }}</a>
    </div>
</template>

<script>
import { getPartyLink } from 'components/links';

export default {
  name: 'PartyPin',
  props: {
    party: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tooltipVisible: false,
    };
  },
  computed: {
    partyLink() {
      return getPartyLink(this.party);
    },
    partyCssClass() {
      return `${this.party.acronym.toLowerCase().replace(/ /g, '_')}-background`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.partypin-container {
    float: right;
    position: relative;

    width: 30px;
    height: 30px;

    .avgminimg-party {
        line-height: 27px;
        cursor: pointer;
        font-size: 11px;
        color: #fff;
    }

    &[data-name="PS Levica"], &.levica-background { // TODO fix levica
        font-size: 8px;
    }

    .partypin-tooltip {
        position: absolute;
        top: -30px;
        left: -25px;

        text-align: center;
        border: 0px;
        pointer-events: none;
        background-color: #525252;
        border-radius: 3px;
        padding: 2px 10px;
        opacity: 0;

        color: #ffffff;

        transition: opacity 0.25s ease-out;

        z-index: 10;

        min-width: 100px;

        &.visible {
            opacity: 1;
        }
    }
}
</style>
