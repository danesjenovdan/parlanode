<template>
  <div :class="className" @click="handleClick">
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
    text: String,
    clickHandler: Function,
    color: String,
    disabled: Boolean,
  },
  computed: {
    className() {
      return [
        'striped-button',
        { 'is-disabled': this.disabled },
        { 'is-selected': this.selected },
        this.color,
      ];
    },
  },
  methods: {
    handleClick(e) {
      if (this.disabled) return;
      this.clickHandler(e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.striped-button {
  align-items: center;
  background: $white;
  border: 1px solid $grey-medium;
  border-top-width: 9px;
  cursor: default;
  display: flex;
  flex-direction: column;
  height: 54px;
  justify-content: center;
  padding: 0 10px;
  position: relative;
  text-align: center;
  user-select: none;
  @include respond-to(desktop) { height: 58px; }

  // &.lightning-badge:before { top: -16px; }

  &.is-selected, &:hover:not(.is-disabled) {
    border-color: transparent !important;
    color: $white;
  }

  &:not(.is-disabled) {
    cursor: pointer;
  }

  .small-text {
    font-size: 10px;
    line-height: 1em;
    text-transform: uppercase;
    @include respond-to(desktop) { font-size: 13px; }
  }
  .text {
    font-size: 24px;
    line-height: 1em;
    @include respond-to(desktop) { font-size: 30px; }
  }

  @each $vote, $color in $proper-vote-colors {
    &.#{$vote} {
      border-top-color: $color;
      &.is-selected { background: $color; }
    }
  }
  @each $vote, $color in $proper-vote-colors-hover {
    &.#{$vote}:hover:not(.is-disabled) { background: $color; }
  }

  @each $party, $color in $party-colors {
    &.#{$party} {
      border-top-color: $color;
      &.is-selected { background: $color; }
    }
  }
  @each $party, $color in $party-colors-hover {
    &.#{$party}:hover:not(.is-disabled) { background: $color; }
  }

  &.dz {
    border-top-color: #fe5e41;
    &.is-selected { background: #fe5e41; }
    &:hover:not(.is-disabled) { background: lighten(#fe5e41, 10%); }
  }
  &.koal {
    border-top-color: #00628c;
    &.is-selected { background: #00628c; }
    &:hover:not(.is-disabled) { background: lighten(#00628c, 10%); }
  }
  &.opoz {
    border-top-color: #a9a9a9;
    &.is-selected { background: #a9a9a9; }
    &:hover:not(.is-disabled) { background: lighten(#a9a9a9, 10%); }
  }
}
</style>
