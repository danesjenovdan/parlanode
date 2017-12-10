<template>
  <div class="tab-content" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    label: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: 'dark',
    },
  },
  created() {
    this.$parent.tabs.push(this);
    this.$parent.headers.push({
      label: this.label,
      variant: this.variant,
    });
  },
  computed: {
    show() {
      return this.$parent.show === this;
    },
  },
};
</script>
