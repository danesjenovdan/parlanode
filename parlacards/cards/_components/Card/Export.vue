<template>
  <div class="card-content-export">
    <div class="card-back-content">
      <div class="export-content">
        <p v-t="'card.export'"></p>
        <a
          class="btn-parlameter btn btn-full-width btn-blue"
          :href="exportUrl('csv')"
          target="_blank"
        >
          <span v-t="'export.csv'"></span>
        </a>
        <a
          class="btn-parlameter btn btn-full-width btn-blue"
          :href="exportUrl('json')"
          target="_blank"
        >
          <span v-t="'export.json'"></span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardExport',
  data() {
    const { cardName, urls } = this.$root.$options.contextData;
    return {
      cardName,
      urls,
      mandate_id: 1,
    };
  },
  methods: {
    exportUrl(format) {
      return `${this.urls.data}/export/${this.cardName}.${format}?mandate_id=${this.mandate_id}`;
    },
  },
};
</script>
