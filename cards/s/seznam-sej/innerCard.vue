<template>
  <card-wrapper
    :id="$root.$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <i18n path="info.lead" tag="p" class="info-text lead">
        <span place="filter">{{ currentFilter }}</span>
        <span place="just-last-five">
          <span v-t="'limited-to-last-five'" v-if="justFive"></span>
        </span>
        <span place="sort-by">{{ $t(`sort-by--${currentSort}`) }}</span>
      </i18n>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n path="info.text" tag="p" class="info-text">
        <a
          v-t="'info.links[0].text'"
          :href="$t('info.links[0].link')"
          place="link1"
          class="funblue-light-hover"
          target="_blank"
        />
        <a
          v-t="'info.links[1].text'"
          :href="$t('info.links[1].link')"
          place="link2"
          class="funblue-light-hover"
          target="_blank"
        />
        <a
          v-t="'info.links[2].text'"
          :href="$t('info.links[2].link')"
          place="link3"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
    </div>

    <sortable-table
      :columns="columns"
      :items="mappedSessions"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
      class="session-list"
    />
  </card-wrapper>
</template>

<script>
import SortableTable from 'components/SortableTable.vue';
import common from 'mixins/common';
import links from 'mixins/links';
import { sessions as sessionsContextUrl } from 'mixins/contextUrls';
import formatDate from 'helpers/dateFormatter';

export default {
  name: 'SeznamSejKartica',
  components: {
    SortableTable,
  },
  mixins: [
    common,
    links,
    sessionsContextUrl,
  ],
  props: {
    headerConfig: {
      type: Object,
      default: () => ({}),
    },
    ogConfig: {
      type: Object,
      default: null,
    },
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
    generatedCardUrl: {
      type: String,
      default: '',
    },
    currentFilter: {
      type: String,
      default: '',
    },
    justFive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    mappedSessions() {
      return this.processedSessions.map(session => [
        { link: this.getSessionUrl(session), image: `${this.slugs.urls.cdn}/icons/seja-redna.svg` },
        { link: this.getSessionUrl(session), text: session.name },
        formatDate(session.date_ts),
        formatDate(session.updated_at_ts),
        { contents: session.orgs.map(org => ({ text: org.name, link: null })) },
      ]);
    },
  },
  methods: {
    getSessionUrl(session) {
      if (!this.slugs || session.link_to === 'nothing') {
        return '';
      }
      return this.getSessionTranscriptLink(session);
    },
  },
};
</script>
