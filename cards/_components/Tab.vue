<template>
  <div v-show="show" class="tab-content">
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
  computed: {
    show() {
      return this.$parent.show === this;
    },
  },
  created() {
    this.$parent.tabs.push(this);
    this.$parent.headers.push({
      label: this.label,
      variant: this.variant,
    });
  },
};
</script>
