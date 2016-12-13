<template>
  <div class="tab-content" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    header: {
      type: String,
      required: true
    }
  },
  created () {
    this.$parent.tabs.push(this)
    this.$parent.headers.push(this.header)
  },
  computed: {
    show() {
      return this.$parent.show === this
    },
  }
}
</script>
