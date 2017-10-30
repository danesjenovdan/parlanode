<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="url"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Izpis vseh članstev {{ vocabulary.poslanec3[data.person.gender] }} v delovnih telesih, stalnih delegacijah in skupinah prijateljstva.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Podatki o članstvih pridobljeni s spletnega mesta <a href="https://www.dz-rs.si/wps/portal/Home/ODrzavnemZboru/KdoJeKdo/PoslankeInPoslanci/PoAbecedi" target="_blank" class="funblue-light-hover">DZ RS</a>.</p>
    </div>

    <p-tabs>
      <p-tab
        v-for="(tabContents, tabName) in tabs"
        :key="tabName"
        :label="tabName"
        variant="light">
        <ul class="membership-list">
          <template v-if="tabContents.length">
            <li
              class="key"
              v-for="membershipItem in tabContents"
              :key="membershipItem.name">
              <template v-if="tabName === 'Delovna telesa'">
                <template v-if="membershipItem.name === 'Kolegij predsednika državnega zbora'">
                  {{ membershipItem.name }}
                </template>
                <a v-else class="funblue-light-hover" target="_blank" :href="`https://glej.parlameter.si/wb/getWorkingBodies/${membershipItem.org_id}?frame=true&altHeader=true`">{{ membershipItem.name }}</a>
              </template>
              <a v-else-if="membershipItem.url != null" class="funblue-light-hover" target="_blank" :href="membershipItem.url">{{ membershipItem.name }}</a>
              <template v-else>{{ membershipItem.name }}</template>
            </li>
          </template>
          <div v-else class="no-results"><i>Brez članstev.</i></div>
        </ul>
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import { reduce } from 'lodash';
import common from 'mixins/common';
import { member } from 'mixins/altHeaders';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';

export default {
  components: { PTab, PTabs },
  mixins: [common, member],
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
  },
  methods: {
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.p-tabs {
  flex: 1;
  height: 180px;
}

.membership-list {
  margin: 13px 0;
  padding: 0;
  list-style: none;

  .key {
    line-height: 1.3em;
    padding: 4px 0;
    text-align: left;
    width: 100%;
  }
}
</style>
