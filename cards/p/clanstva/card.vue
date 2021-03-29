<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n-t keypath="info.text" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n-t>
    </div>

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
      <membership-list v-else :name="''" :contents="[]" />
    </div>
  </card-wrapper>
</template>

<script>
import { reduce } from 'lodash';
import common from '@/_mixins/common';
import { memberOverview } from '@/_mixins/contextUrls';
import { memberHeader } from '@/_mixins/altHeaders';
import { memberOgImage } from '@/_mixins/ogImages';
import { memberTitle } from '@/_mixins/titles';
import PTab from '@/_components/Tab.vue';
import PTabs from '@/_components/Tabs.vue';
import MembershipList from '@/_components/MembershipList.vue';

export default {
  name: 'Clanstva',
  components: {
    PTab,
    PTabs,
    MembershipList,
  },
  mixins: [common, memberHeader, memberOgImage, memberOverview, memberTitle],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    tabs() {
      // TODO: i18n, this is so specific for slo parliament check later
      const membershipTabMap = {
        committee: this.$t('card.committees'),
        council: this.$t('card.councils'),
        commission: this.$t('card.commissions'),
        delegation: this.$t('card.delegations'),
        friendship_group: this.$t('card.friendship_groups'),
        investigative_comission: this.$t('card.investigative_comissions'),
      };

      return reduce(
        this.data.memberships,
        (tabs, membership, membershipName) => {
          if (membershipName in membershipTabMap) {
            const tabId = membershipTabMap[membershipName];
            tabs[tabId] = (tabs[tabId] || []).concat(membership);
          }
          return tabs;
        },
        {}
      );
    },
    tabNames() {
      return Object.keys(this.tabs);
    },
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.person.id}?altHeader=true`;
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
