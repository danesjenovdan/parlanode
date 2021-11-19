<template>
  <card-wrapper :header-config="headerConfig" half-height>
    <p-tabs>
      <p-tab
        v-for="(tabContents, tabName) in tabs"
        :key="tabName"
        :label="tabName"
      >
        <membership-list
          :name="tabName"
          :contents="tabContents"
          :no-tabs="tabNames.length < 2"
        />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { personOverviewContextUrl } from '@/_mixins/contextUrls.js';
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
  mixins: [
    common,
    personHeader,
    personOgImage,
    personOverviewContextUrl,
    personTitle,
  ],
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      results: cardData?.data?.results ?? [],
    };
  },
  computed: {
    tabs() {
      return {
        all: this.results.map((r) => r?.organization),
      };

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
  },
};
</script>
