<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
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

    <div class="memberships">
      <p-tabs>
        <p-tab
          v-for="(tabContents, tabName) in tabs"
          :key="tabName"
          :label="tabName"
          variant="dark"
        >
          <membership-list :name="tabName" :contents="tabContents" />
        </p-tab>
      </p-tabs>
    </div>
  </card-wrapper>
</template>

<script>
import { reduce } from 'lodash';
import common from 'mixins/common';
import { memberOverview as memberOverviewUrl } from 'mixins/contextUrls';
import { memberHeader as memberAltHeader } from 'mixins/altHeaders';
import { memberTitle } from 'mixins/titles';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import MembershipList from 'components/MembershipList.vue';

export default {
  name: 'Clanstva',
  components: {
    PTab,
    PTabs,
    MembershipList,
  },
  mixins: [common, memberAltHeader, memberOverviewUrl, memberTitle],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    tabs() {
      // TODO: i18n, this is so specific for slo parliament check later
      const membershipTabMap = {
        odbor: 'Delovna telesa',
        kolegij: 'Delovna telesa',
        komisija: 'Delovna telesa',
        delegacija: 'Stalne delegacije',
        skupina_prijateljstva: 'Skupine prijateljstva',
        preiskovalna_komisija: 'Delovna telesa',
      };

      return reduce(this.data.memberships, (tabs, membership, membershipName) => {
        const newTabs = JSON.parse(JSON.stringify(tabs));
        if (membershipName in membershipTabMap) {
          const tabId = membershipTabMap[membershipName];
          newTabs[tabId] = newTabs[tabId].concat(membership);
        }
        return newTabs;
      }, {
        'Delovna telesa': [],
        'Stalne delegacije': [],
        'Skupine prijateljstva': [],
      });
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
.memberships /deep/ .p-tabs .p-tabs-content,
.memberships /deep/ .p-tabs .p-tabs-content .tab-content {
  overflow-y: visible;
  overflow-x: visible;
}
</style>
