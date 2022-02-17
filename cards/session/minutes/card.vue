<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <div class="multiple-speeches">
      <div v-if="!agendaItems.length" class="empty-container">
        <empty-state />
      </div>
      <template v-else>
        <minutes-item
          v-for="(agendaItem, i) in agendaItems"
          :key="agendaItem.id"
          :agenda-item="agendaItem"
          :item-number="i + 1"
          :session="session"
        />
      </template>
    </div>
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
// import { sessionTranscriptContextUrl } from '@/_mixins/contextUrls.js';
import EmptyState from '@/_components/EmptyState.vue';
import MinutesItem from '@/_components/MinutesItem.vue';

export default {
  name: 'CardSessionMinutes',
  components: {
    EmptyState,
    MinutesItem,
  },
  mixins: [
    common,
    links,
    // sessionTranscriptContextUrl,
    sessionHeader,
    sessionOgImage,
  ],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      agendaItems: cardData?.data?.results?.agenda_items || [],
      session: cardData?.data?.session || {},
    };
  },
  mounted() {
    document.body.style.overflowAnchor = 'none';
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';
@import 'parlassets/scss/color_classes';

.empty-container {
  position: relative;
  min-height: 265px;
}

.multiple-speeches :deep(.speech-holder) {
  border-top: 1px solid $background;

  @include respond-to(desktop) {
    padding-bottom: 20px;
    padding-top: 20px;
  }

  .person-session {
    height: 64px;

    @include respond-to(desktop) {
      height: auto;
    }
  }

  &:target {
    background: $background;
  }
}
</style>
