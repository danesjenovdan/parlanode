<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="full"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n path="info.text" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
    </div>
    <person-list :people="data.results" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common';
import { partyHeader } from '@/_mixins/altHeaders';
import { partyOgImage } from '@/_mixins/ogImages';
import { partyOverview } from '@/_mixins/contextUrls';
import { partyTitle } from '@/_mixins/titles';
import PersonList from '@/_components/PersonList.vue';

export default {
  name: 'ClaniPoslanskeSkupine',
  components: {
    PersonList,
  },
  mixins: [common, partyOverview, partyTitle, partyHeader, partyOgImage],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.party.id}?altHeader=true`;
    },
  },
};
</script>
