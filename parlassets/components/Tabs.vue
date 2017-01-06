<template>
  <div class="tabs">
    <ul class="tabs-headers">
      <li
        v-for="(header, index) in headers"
        @click="select(index)"
        :class="['tabs-header', { active: index === active }]">
        <span>{{ header }}</span>
      </li>
    </ul>
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  data: () => ({
    tabs: [],
    headers: [],
    active: null,
    show: null,
  }),
  watch: {
    active(value) {
      this.show = this.tabs[value];
    },
  },
  mounted() {
    this.active = 0;
  },
  methods: {
    select(tabIndex) {
      if (this.active !== tabIndex) {
        this.active = tabIndex;
      }
    },
  },
};
</script>
