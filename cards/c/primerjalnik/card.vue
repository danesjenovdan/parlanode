<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="{'is-loading': loading}"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text[0]'"></p>
      <p class="info-text" v-t="'info.text[1]'"></p>
      <div class="info-text">
        <ul>
          <li v-t="'info.list[0]'"></li>
          <li v-t="'info.list[1]'"></li>
          <li v-t="'info.list[2]'"></li>
        </ul>
      </div>
    </div>

    <div class="primerjalnik">
      <i18n path="comparator-text" tag="p">
        <span place="same" class="primerjalnik-for">
          <span v-for="party in sameParties" :key="party.id" class="tag" @click="togglePartySame(party)">
            {{ party.acronym }}
          </span>
          <span v-for="person in selectedSamePeople" :key="person.id" class="tag" @click="removePerson(person)">
            {{ person.name }}
          </span>
          <span class="plus" @click="toggleModal('same', true)">+</span>
        </span>
        <span place="different" class="primerjalnik-against">
          <span v-for="party in differentParties" :key="party.id" class="tag" @click="togglePartyDifferent(party)">
            {{ party.acronym }}
          </span>
          <span v-for="person in selectedDifferentPeople" :key="person.id" class="tag" @click="removePerson(person)">
            {{ person.name }}
          </span>
          <span class="plus" @click="toggleModal('different', true)">+</span>
        </span>
      </i18n>
      <span class="load" @click="loadResults" v-t="'load'"></span>
      <div class="row primerjalnik-extras">
        <div class="col-xs-7 nopadding">
          <div class="searchfilter-checkbox">
            <input id="rev" type="checkbox" class="checkbox" @click="toggleSpecial" :checked="special">
            <label for="rev" v-t="'ignore-absent'"></label>
          </div>
        </div>
        <div class="col-xs-5 nopadding">
          <i18n path="comparator-vote-percent" tag="p" class="summary">
            <strong place="num">{{ votes.length }}</strong>
            <strong place="percent">{{ total === 0 ? 0 : round(votes.length / total * 100, 2) }}%</strong>
          </i18n>
        </div>
      </div>
    </div>

    <p-tabs @switch="focusTab" :start-tab="selectedTab">
      <p-tab :label="$t('tabs.vote-list')">
        <div class="empty" v-if="votes.length === 0">
          <span v-t="'empty-state-text'"></span>
        </div>
        <div v-else class="glasovanja">
          <seznam-glasovanj :data="voteObject" :show-filters="false" />
        </div>
      </p-tab>
      <p-tab :label="$t('tabs.time-chart')">
        <div class="empty" v-if="votes.length === 0">
          <span v-t="'empty-state-text'"></span>
        </div>
        <time-chart v-else :data="data"></time-chart>
      </p-tab>
      <p-tab :label="$t('tabs.bar-chart')" class="tab-three">
        <div v-if="votes.length === 0" class="empty">
          <span v-t="'empty-state-text'"></span>
        </div>
        <bar-chart v-else :data="barChartData" show-numbers></bar-chart>
      </p-tab>
    </p-tabs>

    <div v-show="sameModalVisible" class="card-modal">
      <div class="card-modal-header">
        <span v-t="'select-parties-people'"></span>
        <div class="closeme" @click="toggleModal('same', false)"></div>
      </div>
      <div class="card-modal-content">
        <p>
          <span
            v-for="party in parties"
            :key="party.id"
            :class="['primerjalnik-ps-switch', {'on': party.isSame}]"
            @click="togglePartySame(party)"
            :data-id="party.id"
            :data-acronym="party.acronym"
          >
            {{ party.acronym }}
          </span>
        </p>
        <p-search-dropdown :items="samePeople" :placeholder="samePeoplePlaceholder" />
        <div class="card-modal-button" @click="toggleModal('same', false)" v-t="'confirm'"></div>
      </div>
    </div>

    <div v-show="differentModalVisible" class="card-modal">
      <div class="card-modal-header">
        <span v-t="'select-parties-people'"></span>
        <div class="closeme" @click="toggleModal('different', false)"></div>
      </div>
      <div class="card-modal-content">
        <p>
          <span
            v-for="party in parties"
            :key="party.id"
            :class="['primerjalnik-ps-switch', {'on': party.isDifferent}]"
            @click="togglePartyDifferent(party)"
            :data-id="party.id"
            :data-acronym="party.acronym"
          >
            {{ party.acronym }}
          </span>
        </p>
        <p-search-dropdown :items="differentPeople" :placeholder="differentPeoplePlaceholder" />
        <div class="card-modal-button" @click="toggleModal('different', false)" v-t="'confirm'"></div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import PSearchDropdown from 'components/SearchDropdown.vue';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import TimeChart from 'components/TimeChart.vue';
import BarChart from 'components/BarChart.vue';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';

export default {
  components: {
    BarChart,
    TimeChart,
    PSearchDropdown,
    PTab,
    PTabs,
    SeznamGlasovanj,
  },
  mixins: [common],
  name: 'PrimerjalnikGlasovanj',
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
      const base = 'https://analize.parlameter.si/v1/s/getComparedVotes/';
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
      return `https://glej.parlameter.si/c/primerjalnik/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
  },
  mounted() {
    const self = this;
    const PGPromise = $.ajax({
      url: 'https://data.parlameter.si/v1/getAllPGs/',
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
        console.log(error);
      },
    });
    const peoplePromise = $.ajax({
      url: 'https://data.parlameter.si/v1/getMPs/',
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
          console.log(error);
          this.loading = false;
        },
      });
    },
    focusTab(tabindex) {
      this.selectedTab = tabindex;
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
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';
@import '~parlassets/scss/helper';

.primerjalnik {
  text-align: center;
  background-color: #f0f5f8;
  padding: 30px 30px 10px 30px;
  font-family: 'Roboto Slab', serif;
  font-size: 18px;
  line-height: 30px;
  margin-bottom: 10px;

  .primerjalnik-for,
  .primerjalnik-against {
    .plus {
      background-color: #ffffff;
      padding: 0.2px 7px;
      font-size: 21px;
      line-height: 12px;
      cursor: pointer;
      color: $funblue;
      position: relative;
      top: 3px;

      font-family: 'Roboto', sans-serif;

      margin-left: 5px;
    }

    .tag {
      display: inline-block;
      white-space: nowrap;
      background-color: $funblue;
      color: #ffffff;
      padding: 0px 7px;
      font-size: 14px;
      cursor: pointer;

      margin-left: 5px;

      font-family: 'Roboto', sans-serif;

      &::after {
        content: '×';
        margin-left: 3px;
        font-size: 20px;
        line-height: 20px;
        position: relative;
        top: 2px;
      }
    }
  }

  .load {
    display: inline-block;
    white-space: nowrap;
    color: $sadblue;
    cursor: pointer;
    font-weight: 600;
    &:hover {
      background-color: #ffffff;
    }

    &::after {
      content: '';
      display: inline-block;
      background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/nalozi.svg');
      width: 20px;
      height: 20px;
      position: relative;
      top: 3px;
      margin-left: 5px;
    }
  }

  .primerjalnik-extras {
    margin-top: 40px;
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

.empty {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url('https://cdn.parlameter.si/v1/parlassets/img/icons/primerjalnik-empty-no-text-small.png');
  background-size: 220px 220px;
  background-position: center 30%;
  background-repeat: no-repeat;
  text-align: center;
  font-style: italic;
  font-size: 18px;

  span {
    position: relative;
    top: 70%;
  }
}

.searchfilter-checkbox .checkbox + label:before {
  background-color: #f0f5f8;
}

.searchfilter-checkbox .checkbox + label {
  font-size: 11px;
  color: #555555;
}

// CARD MODAL
.card-modal {
  position: absolute;
  width: 280px;
  left: 50%;
  margin-left: -120px;
  top: 100px;
  z-index: 100;
  background-color: #F0F5F8;

  @include card(2);

  .card-modal-button {
    width: 100%;
    line-height: 40px;
    font-size: 16px;
    color: #ffffff;
    background-color: $funblue;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  .card-modal-header {
    width: 100%;
    background-color: $funblue;
    color: #ffffff;
    font-family: 'Roboto Slab', serif;
    padding: 10px 50px 10px 10px;

    .closeme {
      display: block;
      position: absolute;
      right: 10px;
      top: -1px;
      font-size: 40px;
      cursor: pointer;

      &::before {
        content: '×';
      }
    }
  }

  .card-modal-content {
    padding: 10px;
  }
}
// END CARD MODAL

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

.glasovanja /deep/ #votingCard {
  height: auto;
}
</style>
