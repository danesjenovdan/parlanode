<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <div class="legislation-status-container">
      <div class="legislation-status">
        <i :class="['parlaicon', legislationStatus.iconClass]"></i>
        <div class="legislation-status-text">
          {{ $t(legislationStatus.translationKey) }}
        </div>
      </div>
      <div class="legislation-text">{{ legislation.text }}</div>
    </div>
    <p-tabs class="legislation-tabs">
      <p-tab v-if="legislation.abstract" :label="$t('abstract')">
        <!-- <excerpt
          :content="content"
          :main-law="excerptData"
          :show-parent="false"
          :icon="data.abstract ? data.icon : ''"
        /> -->
      </p-tab>
      <p-tab :label="$t('votings')">
        <div class="votes-list">
          <scroll-shadow ref="shadow">
            <div
              class="votes-list-shadow"
              @scroll="$refs.shadow.check($event.currentTarget)"
            >
              <vote-list-item
                v-for="vote in votes"
                :key="vote.id"
                :vote="vote"
              />
            </div>
          </scroll-shadow>
        </div>
      </p-tab>
      <p-tab v-if="legislation.documents?.length" :label="$t('documents')">
        <documents :documents="legislation.documents" />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import links from '@/_mixins/links.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import legislationStatus from '@/_helpers/legislationStatus.js';
import PTab from '@/_components/Tab.vue';
import PTabs from '@/_components/Tabs.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import VoteListItem from '@/_components/VoteListItem.vue';
import Documents from '@/_components/Documents.vue';

export default {
  name: 'CardLegislationSingle',
  components: {
    PTab,
    PTabs,
    ScrollShadow,
    VoteListItem,
    Documents,
  },
  mixins: [common, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      legislation: cardData?.data?.results || {},
      votes: cardData?.data?.results?.votes || [],
      headerConfig: defaultHeaderConfig(this, {
        heading: cardData?.data?.mandate?.description,
        title: this.$t(`legislation-classifications.${cardData?.data?.results?.classification}`),
      }),
      ogConfig: defaultOgImage(this),
    };
  },
  computed: {
    legislationStatus() {
      return legislationStatus(this.legislation.status);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';
@import 'parlassets/scss/breakpoints';

.legislation-status-container {
  $section-border: 1px solid $font-placeholder;

  background: $background;
  margin: 0 0 20px 0;
  min-height: 90px;
  padding: 10px 14px;
  position: relative;

  @include respond-to(desktop) {
    display: flex;
  }

  .legislation-status {
    flex: 0 0 auto;
    align-items: center;
    display: flex;
    justify-content: center;

    @include respond-to(desktop) {
      border-bottom: none;
      border-right: $section-border;
    }

    .parlaicon {
      flex: 0 0 auto;
    }

    .legislation-status-text {
      color: $font-default;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 12px;
    }
  }

  .legislation-text {
    flex: 1;
    margin: 0 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 300;

    @include respond-to(mobile) {
      margin-top: 12px;
      padding-top: 12px;
      border-top: $section-border;
      text-align: center;
      justify-content: center;
    }
  }
}

.votes-list {
  .votes-list-shadow {
    overflow-y: auto;
    overflow-x: hidden;
    height: $full-card-height - 89;
  }
}

.legislation-tabs :deep(.p-tabs-content) {
  height: $full-card-height - 89;
}
</style>
