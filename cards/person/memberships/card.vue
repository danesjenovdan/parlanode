<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    half-height
  >
    <div class="memberships">
      <p-tabs v-if="tabNames.length > 1">
        <p-tab
          v-for="(tabContents, tabName) in tabs"
          :key="tabName"
          :label="tabName"
          variant="dark"
        >
          <membership-list :name="tabName" :contents="tabContents" />
        </p-tab>
      </p-tabs>
      <membership-list
        v-else-if="tabNames.length === 1"
        :name="tabNames[0]"
        :contents="tabs[tabNames[0]]"
      />
      <!-- TODO: let empty state handle this -->
      <membership-list v-else :name="''" :contents="[]" />
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { personOverview } from '@/_mixins/contextUrls.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';
import { personTitle } from '@/_mixins/titles.js';
import PTab from '@/_components/Tab.vue';
import PTabs from '@/_components/Tabs.vue';
import MembershipList from '@/_components/MembershipList.vue';

export default {
  name: 'CardPersonMemberships',
  components: {
    PTab,
    PTabs,
    MembershipList,
  },
  mixins: [common, personHeader, personOgImage, personOverview, personTitle],
  data() {
    return {
      results: this.cardData.data?.results ?? [],
    };
  },
  computed: {
    tabs() {
      return { all: this.results.map((r) => r?.organization) };

      // // TODO: i18n, this is so specific for slo parliament check later
      // const membershipTabMap = {
      //   committee: this.$t('card.committees'),
      //   council: this.$t('card.councils'),
      //   commission: this.$t('card.commissions'),
      //   delegation: this.$t('card.delegations'),
      //   friendship_group: this.$t('card.friendship_groups'),
      //   investigative_comission: this.$t('card.investigative_comissions'),
      // };

      // return reduce(
      //   this.results.memberships,
      //   (tabs, membership, membershipName) => {
      //     if (membershipName in membershipTabMap) {
      //       const tabId = membershipTabMap[membershipName];
      //       tabs[tabId] = (tabs[tabId] || []).concat(membership);
      //     }
      //     return tabs;
      //   },
      //   {}
      // );
    },
    tabNames() {
      return Object.keys(this.tabs);
    },
    generatedCardUrl() {
      return `${this.url}${this.cardData.id}?altHeader=true`;
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-content {
  overflow-y: hidden;
}
.memberships ::v-deep .p-tabs .p-tabs-content,
.memberships ::v-deep .p-tabs .p-tabs-content .tab-content {
  overflow-y: visible;
  overflow-x: visible;
}
</style>
