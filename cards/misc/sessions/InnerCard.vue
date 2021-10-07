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
      const SESSION_IMAGES = {
        unknown: `${this.$root.urls.cdn}/icons/seja-redna.svg`, // TODO: icon
        regular: `${this.$root.urls.cdn}/icons/seja-redna.svg`,
        irregular: `${this.$root.urls.cdn}/icons/seja-izredna.svg`,
        correspondent: `${this.$root.urls.cdn}/icons/seja-redna.svg`, // TODO: icon
      };
      const getSessionImage = (classification) => {
        const key = classification || 'unknown';
        return SESSION_IMAGES[key] || SESSION_IMAGES.unknown;
      };

      return this.processedSessions.map((session) => [
        {
          link: this.getSessionLink(session),
          image: getSessionImage(session.classification),
        },
        { link: this.getSessionLink(session), text: session.name },
        session.start_time ? formatDate(session.start_time) : '',
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
