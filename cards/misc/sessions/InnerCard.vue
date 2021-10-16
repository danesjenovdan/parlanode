<template>
  <sortable-table
    :columns="columns"
    :items="mappedSessions"
    :sort="currentSort"
    :sort-order="currentSortOrder"
    :sort-callback="selectSort"
    class="session-list"
  />
</template>

<script>
import SortableTable from '@/_components/SortableTable.vue';
import links from '@/_mixins/links.js';
import dateFormatter from '@/_helpers/dateFormatter.js';
import sessionClassification from '@/_helpers/sessionClassification.js';

export default {
  name: 'SeznamSejKartica',
  components: {
    SortableTable,
  },
  mixins: [links],
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    currentSort: {
      type: String,
      default: '',
    },
    currentSortOrder: {
      type: String,
      default: '',
    },
    selectSort: {
      type: Function,
      default: () => {},
    },
    processedSessions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    mappedSessions() {
      return this.processedSessions.map((session) => [
        {
          link: this.getSessionLink(session),
          image: `${this.$root.urls.cdn}/icons/${
            sessionClassification(session.classification).icon
          }.svg`,
        },
        { link: this.getSessionLink(session), text: session.name },
        session.start_time ? dateFormatter(session.start_time) : '',
        // session.end_time ? formatDate(session.end_time) : '',
        // {
        //   contents: session.organizations.map((org) => ({
        //     text: org.name,
        //     link: null,
        //   })),
        // },
      ]);
    },
  },
};
</script>
