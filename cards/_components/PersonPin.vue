<template>
  <div class="personpin-container">
    <div
      :class="['personpin-tooltip', { visible: tooltipVisible}]"
      :ref="person.gov_id"
    >
      {{ person.name }}
    </div>
    <a
      :href="personLink"
      :style="{ 'background-image': `url('${personPortraitUrl}')` }"
      class="avgminimg img-circle"
      @mouseover="tooltipVisible = true"
      @mouseout="tooltipVisible = false"
    />
  </div>
</template>

<script>
import links from 'mixins/links';

export default {
  name: 'PersonPin',
  mixins: [
    links,
  ],
  props: {
    person: {
      type: Object,
      required: true,
      validator: value => value.type === 'mp',
    },
  },
  data() {
    return {
      tooltipVisible: false,
    };
  },
  computed: {
    personLink() {
      return this.getPersonLink(this.person);
    },
    personPortraitUrl() {
      return this.getPersonPortrait(this.person);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.personpin-container {
  float: right;
  position: relative;

  width: 30px;
  height: 30px;

  .personpin-tooltip {
    position: absolute;
    top: -30px;
    left: -25px;

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

    min-width: 100px;

    &.visible {
      opacity: 1;
    }
  }
}
</style>
