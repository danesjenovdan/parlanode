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
    stripePosition: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bottom'].indexOf(value) > -1,
    },
  },
  computed: {
    className() {
      return [
        'striped-button',
        { 'is-disabled': this.disabled },
        { 'is-selected': this.selected },
        this.color,
        `has-stripe-on-${this.stripePosition}`,
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

  &.has-stripe-on-top { border-top-width: 9px; }
  &.has-stripe-on-bottom { border-bottom-width: 9px; }

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
      &.has-stripe-on-top { border-top-color: $color; }
      &.has-stripe-on-bottom { border-bottom-color: $color; }
      &.is-selected { background: $color; }
      &:hover:not(.is-disabled) { background: map-get($proper-vote-colors-hover, $vote); }
    }
  }

  @each $party, $color in $party-colors {
    &.#{$party} {
      &.has-stripe-on-top { border-top-color: $color; }
      &.has-stripe-on-bottom { border-bottom-color: $color; }
      &.is-selected { background: $color; }
      &:hover:not(.is-disabled) { background: map-get($party-colors-hover, $party); }
    }
  }

  $special-groups: (
    dz: #fe5e41,
    koal: #00628c,
    opoz: #a9a9a9
  );

  @each $group, $color in $special-groups {
    &.#{$group} {
      &.has-stripe-on-top { border-top-color: $color; }
      &.has-stripe-on-bottom { border-bottom-color: $color; }
      &.is-selected { background: $color; }
      &:hover:not(.is-disabled) { background: lighten($color, 10%); }
    }
  }
}
</style>
