<template>
  <div :class="className">
    <svg
      v-if="icon === 'f'"
      :class="'parlaicon-f'"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enable-background="new 0 0 100 100"
      xml:space="preserve"
    ><path d="M82.301,35.467C82.3,17.656,67.81,3.166,50.001,3.166c-17.812,0-32.302,14.49-32.302,32.301  c0,16.11,11.856,29.502,27.301,31.912v8.171h-9.189v10H45v8.284h10V85.55h9.189v-10H55v-8.171  C70.444,64.969,82.301,51.577,82.301,35.467z M27.699,35.467c0-12.297,10.005-22.301,22.302-22.301  c12.295,0,22.299,10.004,22.3,22.301c0,12.297-10.004,22.301-22.301,22.301S27.699,47.764,27.699,35.467z" /></svg>
    <svg
      v-if="icon === 'm'"
      :class="'parlaicon-m'"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enable-background="new 0 0 100 100"
      xml:space="preserve"
    ><path d="M63.472,6.5v10l12.957,0L63.584,29.345c-6.145-4.641-13.592-7.157-21.429-7.157c-9.524,0-18.479,3.709-25.214,10.444  C3.042,46.534,3.042,69.154,16.942,83.057C23.678,89.791,32.632,93.5,42.155,93.5c9.524,0,18.479-3.709,25.214-10.444  c12.7-12.702,13.789-32.677,3.281-46.636L83.5,23.571l-0.001,12.956h10L93.5,6.5L63.472,6.5z M60.298,75.985  C55.451,80.831,49.009,83.5,42.155,83.5c-6.853,0-13.296-2.669-18.142-7.514c-10.002-10.003-10.002-26.28-0.001-36.283  c4.847-4.846,11.289-7.515,18.143-7.515s13.296,2.668,18.142,7.515C70.3,49.706,70.3,65.982,60.298,75.985z" /></svg>
  </div>
</template>

<script>
export default {
  name: 'StripedIconButton',
  props: {
    selected: Boolean,
    color: String,
    disabled: Boolean,
    stripePosition: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bottom'].indexOf(value) > -1,
    },
    icon: String,
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
    @include respond-to(desktop) { font-size: 13px; }

    &.is-uppercase {
      text-transform: uppercase;
    }
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
    opoz: #a9a9a9,
    funblue: #009cdd,
  );


  @each $name, $color in map-merge($special-groups, $binary-vote-colors) {
    &.#{$name} {
      &.has-stripe-on-top { border-top-color: $color; }
      &.has-stripe-on-bottom { border-bottom-color: $color; }
      &.is-selected { background-color: $color; }
      &:hover:not(.is-disabled) { background-color: lighten($color, 10%); }
    }
  }
}

.parlaicon-m, .parlaicon-f {
  fill: $black;
}
.is-selected {
  .parlaicon-m, .parlaicon-f {
    fill: #ffffff;
  }
}
</style>
