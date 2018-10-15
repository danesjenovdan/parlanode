<template>
  <div class="partypin-container">
    <div
      :class="['partypin-tooltip', { visible: tooltipVisible}]"
      :ref="party.id"
    >
      {{ party.name }}
    </div>
    <a
      :href="partyLink"
      :class="partyCssClass"
      class="avgminimg img-circle avgminimg-party img-circle"
      @mouseover="tooltipVisible = true"
      @mouseout="tooltipVisible = false"
    >
      {{ party.acronym }}
    </a>
  </div>
</template>

<script>
import links from 'mixins/links';

export default {
  name: 'PartyPin',
  mixins: [
    links,
  ],
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
      return this.getPartyLink(this.party);
    },
    partyCssClass() {
      return `${this.party.acronym.toLowerCase().replace(/[ +,]/g, '_')}-background`;
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
    color: $white;
  }

  &[data-name="PS Levica"],
  .levica-background, // TODO fix levica
  .desus-background {
    font-size: 8px;
  }

  .partypin-tooltip {
    position: absolute;
    bottom: 35px;
    right: -50px;

    text-align: center;
    border: 0px;
    pointer-events: none;
    background-color: $font-default;
    border-radius: 3px;
    padding: 2px 10px;
    opacity: 0;

    color: $white;

    transition: opacity 0.25s ease-out;

    z-index: 10;

    min-width: 170px;

    &.visible {
      opacity: 1;
    }
  }
}
</style>
