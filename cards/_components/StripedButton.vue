<template>
  <div :class="className" @click="clickHandler">
    <div v-if="smallText" class="small-text">{{ smallText }}</div>
    <div v-if="text" class="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'StripedButton',
  props: {
    selected: Boolean,
    smallText: String,
    text: {
      type: String,
      required: true,
    },
    clickHandler: Function,
    color: String,
  },
  computed: {
    className() {
      return [
        'striped-button',
        { 'is-selected': this.selected },
        { [this.color]: ['for', 'against', 'abstain', 'not_present'].indexOf(this.color) > -1 },
      ];
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'parlassets/scss/colors.scss';

.striped-button {
  align-items: center;
  border: 1px solid $grey-medium;
  border-top-width: 9px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 58px;
  justify-content: center;
  padding: 0 10px;
  user-select: none;

  &.is-selected {
    border-color: transparent;
    color: $white;
  }

  .small-text {
    font-size: 13px;
    line-height: 1em;
    text-transform: uppercase;
  }
  .text {
    font-size: 30px;
    line-height: 1em;
  }

  @each $vote, $color in $proper-vote-colors {
    &.#{$vote} {
      border-top-color: $color;
      &.is-selected { background: $color; }
    }
  }
}
</style>
