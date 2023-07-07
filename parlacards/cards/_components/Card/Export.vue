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
      mandate_id: 1,
    };
  },
  methods: {
    getPersonOrGroupOrSessionId() {
      const theData = this.$root.$options.contextData.cardData.data;

      if ('person' in theData) {
        return theData.person.slug.split('-')[0];
      }

      if ('group' in theData) {
        return theData.group.slug.split('-')[0];
      }

      if ('session' in theData) {
        return theData.session.id;
      }

      return 'UNNECESSARY'
    },
    exportUrl(format) {
      return `${this.urls.data}/export/${this.cardName}.${format}?mandate_id=${this.mandate_id}&id=${this.getPersonOrGroupOrSessionId()}`;
    },
  },
};
</script>
