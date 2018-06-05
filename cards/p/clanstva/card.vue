<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Izpis vseh članstev {{ vocabulary.poslanec3[data.person.gender] }} v delovnih telesih, stalnih delegacijah in skupinah prijateljstva.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Podatki o članstvih pridobljeni s spletnega mesta <a href="https://www.dz-rs.si/wps/portal/Home/ODrzavnemZboru/KdoJeKdo/PoslankeInPoslanci/PoAbecedi" target="_blank" class="funblue-light-hover">DZ RS</a>.</p>
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
import { member as memberAltHeader } from 'mixins/altHeaders';
import { memberTitle } from 'mixins/titles';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import MembershipList from 'components/MembershipList.vue';

export default {
  components: {
    PTab,
    PTabs,
    MembershipList,
  },
  mixins: [common, memberAltHeader, memberOverviewUrl, memberTitle],
  name: 'Clanstva',
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    tabs() {
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
