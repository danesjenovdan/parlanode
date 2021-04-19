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
import formatDate from '@/_helpers/dateFormatter.js';

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
          link: this.getSessionUrl(session),
          image: `${this.slugs.urls.cdn}/icons/seja-${
            session.name.split(' ')[1]
          }.svg`,
        },
        { link: this.getSessionUrl(session), text: session.name },
        formatDate(session.date_ts),
        formatDate(session.updated_at_ts),
        {
          contents: session.orgs.map((org) => ({ text: org.name, link: null })),
        },
      ]);
    },
  },
  methods: {
    getSessionUrl(session) {
      if (!this.slugs || session.link_to === 'nothing') {
        return '';
      }
      return this.getSessionLegislationLink(session);
    },
  },
};
</script>
