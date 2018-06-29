<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="{'is-loading': loading}"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <p v-t="'info.text[1]'" class="info-text"></p>
      <div class="info-text">
        <ul>
          <li v-t="'info.list[0]'"></li>
          <li v-t="'info.list[1]'"></li>
          <li v-t="'info.list[2]'"></li>
        </ul>
      </div>
    </div>

    <div id="primerjalnik">
      <text-frame class="primerjalnik">
        <i18n path="comparator-text" tag="p">
          <span place="same" class="primerjalnik-for">
            <tag
              v-for="party in sameParties"
              :key="party.id"
              :text="party.acronym"
              class="tag"
              @click="togglePartySame(party)"
            />
            <tag
              v-for="person in selectedSamePeople"
              :key="person.id"
              :text="person.name"
              class="tag"
              @click="removePerson(person)"
            />
            <plus @click="toggleModal('same', true)" />
          </span>
          <span place="different" class="primerjalnik-against">
            <tag
              v-for="party in differentParties"
              :key="party.id"
              :text="party.acronym"
              class="tag"
              @click="togglePartyDifferent(party)"
            />
            <tag
              v-for="person in selectedDifferentPeople"
              :key="person.id"
              :text="person.name"
              class="tag"
              @click="removePerson(person)"
            />
            <plus @click="toggleModal('different', true)" />
          </span>
          <span place="load">
            <load-link :text="$t('load')" @click="loadResults" />
          </span>
        </i18n>
        <div class="row primerjalnik-extras">
          <div class="col-xs-7 nopadding">
            <div class="searchfilter-checkbox">
              <input
                id="rev"
                :checked="special"
                type="checkbox"
                class="checkbox"
                @click="toggleSpecial"
              >
              <label v-t="'ignore-absent'" for="rev"></label>
            </div>
          </div>
          <div class="col-xs-5 nopadding">
            <i18n path="comparator-vote-percent" tag="p" class="summary">
              <strong place="num">{{ votes.length }}</strong>
              <strong place="percent">{{ total === 0 ? 0 : round(votes.length / total * 100, 2) }}%</strong>
            </i18n>
          </div>
        </div>
      </text-frame>

      <p-tabs :start-tab="selectedTab" @switch="focusTab">
        <p-tab :label="$t('tabs.vote-list')">
          <empty-circle v-if="votes.length === 0" :text="$t('empty-state-text')" />
          <div v-else class="glasovanja">
            <seznam-glasovanj :data="voteObject" :show-filters="false" />
          </div>
        </p-tab>
        <p-tab :label="$t('tabs.time-chart')">
          <empty-circle v-if="votes.length === 0" :text="$t('empty-state-text')" />
          <time-chart v-else :data="data" />
        </p-tab>
        <p-tab :label="$t('tabs.bar-chart')" class="tab-three">
          <empty-circle v-if="votes.length === 0" :text="$t('empty-state-text')" />
          <bar-chart v-else :data="barChartData" show-numbers />
        </p-tab>
      </p-tabs>

      <modal
        v-show="sameModalVisible"
        :header="$t('select-parties-people')"
        :button="$t('confirm')"
        @ok="toggleModal('same', false)"
        @close="toggleModal('same', false)"
      >
        <p>
          <span
            v-for="party in parties"
            :key="party.id"
            :class="['primerjalnik-ps-switch', {'on': party.isSame}]"
            :data-id="party.id"
            :data-acronym="party.acronym"
            @click="togglePartySame(party)"
          >
            {{ party.acronym }}
          </span>
        </p>
        <p-search-dropdown
          :items="samePeople"
          :placeholder="samePeoplePlaceholder"
        />
      </modal>

      <modal
        v-show="differentModalVisible"
        :header="$t('select-parties-people')"
        :button="$t('confirm')"
        @ok="toggleModal('different', false)"
        @close="toggleModal('different', false)"
      >
        <p>
          <span
            v-for="party in parties"
            :key="party.id"
            :class="['primerjalnik-ps-switch', {'on': party.isDifferent}]"
            :data-id="party.id"
            :data-acronym="party.acronym"
            @click="togglePartyDifferent(party)"
          >
            {{ party.acronym }}
          </span>
        </p>
        <p-search-dropdown
          :items="differentPeople"
          :placeholder="differentPeoplePlaceholder"
        />
      </modal>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import BarChart from 'components/BarChart.vue';
import EmptyCircle from 'components/EmptyCircle.vue';
import LoadLink from 'components/LoadLink.vue';
import Modal from 'components/Modal.vue';
import Plus from 'components/Plus.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import Tag from 'components/Tag.vue';
import TextFrame from 'components/TextFrame.vue';
import TimeChart from 'components/TimeChart.vue';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';

export default {
  name: 'PrimerjalnikGlasovanj',
  components: {
    BarChart,
    EmptyCircle,
    PSearchDropdown,
    LoadLink,
    Modal,
    Plus,
    PTab,
    PTabs,
    Tag,
    TextFrame,
    TimeChart,
    SeznamGlasovanj,
  },
  mixins: [common],
  data() {
    return {
      loading: true,
      parties: [],
      samePeople: [],
      differentPeople: [],
      special: !!this.$options.cardData.parlaState.special,
      data: [],
      total: 0,
      sameModalVisible: false,
      differentModalVisible: false,
      selectedTab: this.$options.cardData.parlaState.selectedTab || 0,
      headerConfig: {
        circleIcon: 'primerjalnik',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    samePeoplePlaceholder() {
      return this.selectedSamePeople.length > 0
        ? this.$t('selected-mps', { num: this.selectedSamePeople.length })
        : this.$t('select-mps');
    },
    differentPeoplePlaceholder() {
      return this.selectedDifferentPeople.length > 0
        ? this.$t('selected-mps', { num: this.selectedDifferentPeople.length })
        : this.$t('select-mps');
    },
    queryUrl() {
      const base = `${this.slugs.urls.analize}/s/getComparedVotes/`;
      const samePeopleIds = this.selectedSamePeople.map(person => person.id).toString();
      const samePartyIds = this.sameParties.map(party => party.id).toString();
      const diffPeopleIds = this.selectedDifferentPeople.map(person => person.id).toString();
      const diffPartyIds = this.differentParties.map(party => party.id).toString();
      const url = `${base}?people_same=${samePeopleIds}&parties_same=${samePartyIds}&people_different=${diffPeopleIds}&parties_different=${diffPartyIds}`;
      if (this.special) {
        return `${url}&special=true`;
      }
      return url;
    },
    votes() {
      return this.data;
    },
    voteObject() {
      return {
        votes: this.data.map(v => v.results),
        session: {},
        tags: [],
      };
    },
    sameParties() {
      return this.parties.filter(party => party.isSame);
    },
    differentParties() {
      return this.parties.filter(party => party.isDifferent);
    },
    selectedSamePeople() {
      return this.samePeople.filter(person => person.selected);
    },
    selectedDifferentPeople() {
      return this.differentPeople.filter(person => person.selected);
    },
    barChartData() {
      const tags = this.data.reduce((acc, d) => {
        if (acc.indexOf(d.results.tags[0]) === -1) {
          acc.push(d.results.tags[0]);
        }
        return acc;
      }, []);

      return tags.map(tag => ({
        label: tag,
        value: this.data.filter(d => d.results.tags[0] === tag).length,
      }));
    },
    generatedCardUrl() {
      const state = {};
      if (this.special) {
        state.special = this.special;
      }
      if (this.selectedSamePeople.length > 0) {
        state.samePeople = this.selectedSamePeople.map(p => p.id);
      }
      if (this.selectedDifferentPeople.length > 0) {
        state.differentPeople = this.selectedDifferentPeople.map(p => p.id);
      }
      if (this.sameParties.length > 0) {
        state.sameParties = this.sameParties.map(p => p.id);
      }
      if (this.differentParties.length > 0) {
        state.differentParties = this.differentParties.map(p => p.id);
      }
      if (this.selectedTab > 0) {
        state.selectedTab = this.selectedTab;
      }
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
  },
  watch: {
    selectedSamePeople(newSelectedSamePeople) {
      newSelectedSamePeople.forEach((person) => {
        this.selectedDifferentPeople
          .filter(p => p.id === person.id)
          .forEach((p) => {
            p.selected = false;
          });
      });
    },
    selectedDifferentPeople(newSelectedDifferentPeople) {
      newSelectedDifferentPeople.forEach((person) => {
        this.selectedSamePeople
          .filter(p => p.id === person.id)
          .forEach((p) => {
            p.selected = false;
          });
      });
    },
  },
  mounted() {
    const self = this;
    const PGPromise = $.ajax({
      url: `${this.slugs.urls.data}/getAllPGs/`,
      method: 'GET',
      success: (data) => {
        const sameParties = this.$options.cardData.parlaState.sameParties || [];
        const differentParties = this.$options.cardData.parlaState.differentParties || [];
        self.parties = Object.keys(data).map(partyId => ({
          id: data[partyId].id,
          acronym: data[partyId].acronym,
          is_coalition: data[partyId].is_coalition,
          name: data[partyId].name,
          isSame: sameParties.indexOf(data[partyId].id) > -1,
          isDifferent: differentParties.indexOf(data[partyId].id) > -1,
        }));
      },
      error(error) {
        // eslint-disable-next-line no-console
        console.log(error);
      },
    });
    const peoplePromise = $.ajax({
      url: `${this.slugs.urls.data}/getMPs/`,
      method: 'GET',
      success: (data) => {
        const samePeople = this.$options.cardData.parlaState.samePeople || [];
        const differentPeople = this.$options.cardData.parlaState.differentPeople || [];
        const sameData = JSON.parse(JSON.stringify(data));
        self.samePeople = sameData.map((person) => {
          person.selected = samePeople.indexOf(person.id) > -1;
          person.label = person.name;

          return person;
        });

        const differentData = JSON.parse(JSON.stringify(data));
        self.differentPeople = differentData.map((person) => {
          person.selected = differentPeople.indexOf(person.id) > -1;
          person.label = person.name;

          return person;
        });

        this.loadResults();
      },
      error(error) {
        // eslint-disable-next-line no-console
        console.log(error);
      },
    });

    Promise.all([PGPromise, peoplePromise]).then(() => {
      this.loadResults();
    });
  },
  methods: {
    toggleSpecial() {
      this.special = !this.special;
    },
    round(value, decimals) {
      return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
    },
    togglePartySame(party) {
      party.isDifferent = false;
      party.isSame = !party.isSame;
    },
    togglePartyDifferent(party) {
      party.isDifferent = !party.isDifferent;
      party.isSame = false;
    },
    removePerson(person) {
      person.selected = false;
    },
    toggleModal(modalType, newState) {
      this[`${modalType}ModalVisible`] = newState;
    },
    loadResults() {
      this.loading = true;
      $.ajax({
        url: this.queryUrl,
        method: 'GET',
        success: (data) => {
          this.data = data.results;
          this.total = data.total;
          this.loading = false;
        },
        error(error) {
          // eslint-disable-next-line no-console
          console.log(error);
          this.loading = false;
        },
      });
    },
    focusTab(tabindex) {
      this.selectedTab = tabindex;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';
@import '~parlassets/scss/helper';

.primerjalnik {
  .primerjalnik-extras {
    margin: 40px 0 -20px;
  }

  .searchfilter-checkbox {
    height: 40px;

    @include respond-to(mobile) {
      height: auto;
    }

    label {
      text-align: left;
      margin-bottom: 0;

      @include respond-to(small-mobile) {
        line-height: 1.4em;
        padding-top: 5px;
      }
    }
  }

  .summary {
    margin-bottom: 0;
    line-height: 40px;
    text-align: right;

    font-size: 11px;
    color: #555555;

    @include respond-to(mobile) {
      text-align: left;
      margin-top: 0;
      line-height: 1.4em;
      padding-left: 10px;
    }
  }
}

.primerjalnik-ps-switch {
  background: #ffffff;
  cursor: pointer;
  padding: 5px;
  display: inline-block;
  margin: 5px;
  color: $funblue;

  &::after {
    content: '×';
    margin-left: 8px;
    font-size: 20px;
    line-height: 20px;
    position: relative;
    top: 2px;
    transform: rotate(45deg);
    display: inline-block;
    transition: transform 0.2s ease-out;
  }

  &.on {
    background: $funblue;
    color: #ffffff;

    &::after {
      transform: rotate(0deg);
    }
  }
}

.loadme {
  background: $funblue;
  width: 200px;
  height: 50px;
  margin: auto;
  display: block;
  position: relative;
}

.searchfilter-checkbox .checkbox + label:before {
  background-color: #f0f5f8;
}

.searchfilter-checkbox .checkbox + label {
  font-size: 11px;
  color: #555555;
}

.tab-content {
  height: 410px;
  overflow-x: hidden;
  overflow-y: auto;
}

.tab-three {
  padding-top: 16px;
}

.nopadding {
  padding-left: 0;
  padding-right: 0;
}

#primerjalnik {
  /deep/ .p-tabs .p-tabs-content,
  /deep/ .p-tabs .p-tabs-content .tab-content {
    overflow-y: visible;
    overflow-x: visible;
  }

  .glasovanja {
    margin-top: 6px;

    /deep/ #votingCard {
      height: 410px;
    }
  }
}
</style>
