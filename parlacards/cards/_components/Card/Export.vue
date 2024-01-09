<template>
  <div class="card-content-export">
    <div class="card-back-content">
      <div class="export-content">
        <!-- TODO -->
        <!-- This requires a better solution, one where -->
        <!-- the text can be empty because most cards -->
        <!-- won't need specific instructions or explanations. -->
        <!-- <p v-t="'card.export'"></p> -->
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
    };
  },
  methods: {
    exportUrl(format) {
      const { cardData } = this.$root.$options.contextData;

      const params = new URLSearchParams();
      params.append('id', cardData.id);
      params.append('mandate_id', cardData.data?.mandate?.id);

      return `${this.urls.data}/export/${this.cardName}.${format}?${params.toString()}`;
    },
  },
};
</script>
