<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
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
import formatDate from 'helpers/dateFormatter';
import { ICONS_ROOT_URL } from 'components/constants';

export default {
  name: 'SeznamSejKartica',
  components: { SortableTable },
  mixins: [common],
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
        { link: this.getSessionUrl(session), image: `${ICONS_ROOT_URL}seja-${session.name.split(' ')[1]}.svg` },
        { link: this.getSessionUrl(session), text: session.name },
        formatDate(session.date_ts),
        formatDate(session.updated_at_ts),
        { contents: session.orgs.map(org => ({ text: org.name, link: null })) },
      ]);
    },
  },
  created() {
    this.$root.$options.cardData.template.contextUrl = `${this.slugs.urls.base}/seje`;
  },
  methods: {
    getSessionUrl(session) {
      if (!this.slugs || session.link_to === 'nothing') {
        return '';
      }
      return `${this.slugs.urls.base}/seja/zakonodaja/${session.id}`;
    },
  },
};
</script>
