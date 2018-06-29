<template>
  <div class="p-tabs">
    <ul class="p-tabs-headers">
      <li
        v-for="(header, index) in headers"
        :key="index"
        :class="['p-tabs-header', header.variant, { active: index === active }]"
        @click="select(index)"
      >
        <span>{{ header.label }}</span>
      </li>
    </ul>
    <div class="p-tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    startTab: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tabs: [],
      headers: [],
      active: null,
      show: null,
    };
  },
  watch: {
    active(value) {
      this.show = this.tabs[value];
    },
  },
  created() {
    this.active = this.startTab || 0;
  },
  methods: {
    select(tabIndex) {
      if (this.active !== tabIndex) {
        this.active = tabIndex;
        this.$emit('switch', tabIndex);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~parlassets/scss/colors";
@import "~parlassets/scss/breakpoints";

.p-tabs {
  display: flex;
  flex-direction: column;
  .p-tabs-headers {
    display: flex;
    flex-shrink: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    .p-tabs-header {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex: 1;
      font-size: 13px;
      font-weight: 300;
      min-height: 51px;
      justify-content: center;
      line-height: 1.25em;
      margin-right: 4px;
      padding: 5px 10px;
      text-align: center;
      text-transform: uppercase;
      user-select: none;
      &:last-child { margin-right: 0; }
      &.active {
        cursor: default;
        pointer-events: none;
      }
      @include respond-to(desktop) { font-size: 16px; }
      &.dark {
        background: $sadblue;
        color: $white;
        &.active { background: $funblue; }
        &:hover { background: rgba($funblue, 0.7); }
      }
      &.light {
        background: $grey;
        color: $black;
        &.active {
          background: $funblue;
          color: $white;
        }
        &:hover {
          background: rgba($funblue, 0.7);
          color: $white;
        }
      }
    }
  }

  .p-tabs-content {
    flex: 1;
    overflow-y: auto;
    position: relative;

    .tab-content {
      overflow-x: hidden;
    }
  }
}

.p-tabs-2col .p-tabs {
  .p-tabs-headers {
    .p-tabs-header {
      margin: 0;
      &:last-child {
        margin-left: 15px;
      }

    }
  }
}
</style>
