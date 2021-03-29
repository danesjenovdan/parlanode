<template>
  <div :id="$options.cardData.mountId">
    <generator>
      <div slot="generator">
        <tools-tabs current-tool="voteComparator" />
      </div>
      <card-wrapper
        :content-class="{ 'is-loading': loading }"
        :card-url="generatedCardUrl"
        :header-config="headerConfig"
        :og-config="ogConfig"
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
            <div class="primerjalnik-text">
              <i18n-t keypath="comparator-text" tag="p">
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
                    :text="person.label"
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
              </i18n-t>
              <div class="searchfilter-checkboxes">
                <div class="searchfilter-checkbox">
                  <input
                    id="ignore-absent"
                    :checked="special"
                    type="checkbox"
                    class="checkbox"
                    @click="toggleSpecial"
                  />
                  <label v-t="'ignore-absent'" for="ignore-absent"></label>
                </div>
              </div>
            </div>
            <div class="primerjalnik-button">
              <div class="spacer"></div>
              <span place="load" class="load-button">
                <load-link :text="$t('load')" @click="loadResults" />
              </span>
              <div>
                <i18n-t keypath="comparator-vote-percent" tag="p" class="summary">
                  <strong place="num">{{ votes.length }}</strong>
                  <strong place="percent">
                    {{
                      total === 0 ? 0 : round((votes.length / total) * 100, 2)
                    }}%
                  </strong>
                </i18n-t>
              </div>
            </div>
          </text-frame>

          <p-tabs :start-tab="selectedTab" @switch="focusTab">
            <p-tab :label="$t('tabs.vote-list')">
              <empty-circle
                v-if="votes.length === 0"
                :text="$t('empty-state-text')"
              />
              <div v-else class="glasovanja">
                <seznam-glasovanj
                  :data="voteObject"
                  :show-filters="false"
                  :virtualize-remain="4"
                  virtualize
                />
              </div>
            </p-tab>
            <p-tab :label="$t('tabs.time-chart')">
              <empty-circle
                v-if="votes.length === 0"
                :text="$t('empty-state-text')"
              />
              <time-chart v-else :data="data" />
            </p-tab>
            <p-tab :label="$t('tabs.bar-chart')" class="tab-three">
              <div class="mdt-wrapper">
                <empty-circle
                  v-if="votes.length === 0"
                  :text="$t('empty-state-text')"
                />
                <bar-chart v-else :data="barChartData" show-numbers />
              </div>
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
                :class="['primerjalnik-ps-switch', { on: party.isSame }]"
                :data-id="party.id"
                :data-acronym="party.acronym"
                @click="togglePartySame(party)"
              >
                {{ party.acronym }}
              </span>
            </p>
            <p-search-dropdown
              v-model="samePeople"
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
                :class="['primerjalnik-ps-switch', { on: party.isDifferent }]"
                :data-id="party.id"
                :data-acronym="party.acronym"
                @click="togglePartyDifferent(party)"
              >
                {{ party.acronym }}
              </span>
            </p>
            <p-search-dropdown
              v-model="differentPeople"
              :placeholder="differentPeoplePlaceholder"
            />
          </modal>
        </div>
      </card-wrapper>
    </generator>
  </div>
</template>

<script>
import common from '@/_mixins/common';
import links from '@/_mixins/links';
import { defaultDynamicHeaderConfig } from '@/_mixins/altHeaders';
import { defaultOgImage } from '@/_mixins/ogImages';
import Generator from '@/_components/Generator.vue';
import ToolsTabs from '@/_components/ToolsTabs.vue';
import BarChart from '@/_components/BarChart.vue';
import EmptyCircle from '@/_components/EmptyCircle.vue';
import LoadLink from '@/_components/LoadLink.vue';
import Modal from '@/_components/Modal.vue';
import Plus from '@/_components/Plus.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import PTab from '@/_components/Tab.vue';
import PTabs from '@/_components/Tabs.vue';
import Tag from '@/_components/Tag.vue';
import TextFrame from '@/_components/TextFrame.vue';
import TimeChart from '@/_components/TimeChart.vue';
import SeznamGlasovanj from '@/_components/SeznamGlasovanj.vue';
import generators from '@/_mixins/generatePeopleAndParties';

export default {
  name: 'PrimerjalnikGlasovanj',
  components: {
    Generator,
    ToolsTabs,
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
  mixins: [common, links, generators],
  data() {
    return {
      parentOrgId: this.$options.cardData.data.parent_org_id,
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
      headerConfig: defaultDynamicHeaderConfig(this, {
        circleIcon: 'primerjalnik',
      }),
      ogConfig: defaultOgImage(this, { icon: 'primerjalnik' }),
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
      const samePeopleIds = this.selectedSamePeople
        .map((person) => person.id)
        .toString();
      const samePartyIds = this.sameParties.map((party) => party.id).toString();
      const diffPeopleIds = this.selectedDifferentPeople
        .map((person) => person.id)
        .toString();
      const diffPartyIds = this.differentParties
        .map((party) => party.id)
        .toString();
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
        votes: this.data.map((v) => ({
          ...v.results,
          session_id: v.session.id,
        })),
        session: {},
        tags: [],
      };
    },
    sameParties() {
      return this.parties.filter((party) => party.isSame);
    },
    differentParties() {
      return this.parties.filter((party) => party.isDifferent);
    },
    selectedSamePeople() {
      return this.samePeople.filter((person) => person.selected);
    },
    selectedDifferentPeople() {
      return this.differentPeople.filter((person) => person.selected);
    },
    barChartData() {
      const tags = this.data.reduce((acc, d) => {
        if (acc.indexOf(d.results.tags[0]) === -1) {
          acc.push(d.results.tags[0]);
        }
        return acc;
      }, []);

      return tags.map((tag) => ({
        label: tag || 'Brez MDT', // TODO i18n
        value: this.data.filter((d) => d.results.tags[0] === tag).length,
      }));
    },
    generatedCardUrl() {
      const state = {};
      if (this.special) {
        state.special = this.special;
      }
      if (this.selectedSamePeople.length > 0) {
        state.samePeople = this.selectedSamePeople.map((p) => p.id);
      }
      if (this.selectedDifferentPeople.length > 0) {
        state.differentPeople = this.selectedDifferentPeople.map((p) => p.id);
      }
      if (this.sameParties.length > 0) {
        state.sameParties = this.sameParties.map((p) => p.id);
      }
      if (this.differentParties.length > 0) {
        state.differentParties = this.differentParties.map((p) => p.id);
      }
      if (this.selectedTab > 0) {
        state.selectedTab = this.selectedTab;
      }
      return `${this.url}${this.parentOrgId || ''}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
  },
  watch: {
    selectedSamePeople(newSelectedSamePeople) {
      newSelectedSamePeople.forEach((person) => {
        this.selectedDifferentPeople
          .filter((p) => p.id === person.id)
          .forEach((p) => {
            p.selected = false;
          });
      });
    },
    selectedDifferentPeople(newSelectedDifferentPeople) {
      newSelectedDifferentPeople.forEach((person) => {
        this.selectedSamePeople
          .filter((p) => p.id === person.id)
          .forEach((p) => {
            p.selected = false;
          });
      });
    },
  },
  mounted() {
    const self = this;
    // used to be PGPromise
    const sameParties = this.$options.cardData.parlaState.sameParties || [];
    const differentParties =
      this.$options.cardData.parlaState.differentParties || [];

    this.parties = this.generateParties(this.$options.cardData.data).map(
      (party) => ({
        id: party.properId,
        acronym: party.acronym,
        isCoalition: party.isCoalition,
        name: party.name,
        isSame: sameParties.indexOf(party.properId) > -1,
        isDifferent: differentParties.indexOf(party.properId) > -1,
      })
    );

    // used to be peoplePromise
    const samePeople = this.$options.cardData.parlaState.samePeople || [];
    const differentPeople =
      this.$options.cardData.parlaState.differentPeople || [];

    this.samePeople = this.generatePeople(this.$options.cardData.data).map(
      (person) => ({
        selected: samePeople.indexOf(person.id) > -1,
        label: person.label,
        id: person.id,
        image: person.image,
      })
    );
    self.differentPeople = this.generatePeople(this.$options.cardData.data).map(
      (person) => ({
        selected: differentPeople.indexOf(person.id) > -1,
        label: person.label,
        id: person.id,
        image: person.image,
      })
    );

    this.loadResults();
    // const PGPromise = $.ajax({
    //   url: `${this.slugs.urls.data}/getAllPGs/`,
    //   method: 'GET',
    //   success: (data) => {
    //     const sameParties = this.$options.cardData.parlaState.sameParties || [];
    //     const differentParties = this.$options.cardData.parlaState.differentParties || [];
    //     self.parties = Object.keys(data).map(partyId => ({
    //       id: data[partyId].id,
    //       acronym: data[partyId].acronym,
    //       isCoalition: data[partyId].isCoalition,
    //       name: data[partyId].name,
    //       isSame: sameParties.indexOf(data[partyId].id) > -1,
    //       isDifferent: differentParties.indexOf(data[partyId].id) > -1,
    //     }));
    //   },
    //   error(error) {
    //     // eslint-disable-next-line no-console
    //     console.log(error);
    //   },
    // });
    // const peoplePromise = $.ajax({
    //   url: `${this.slugs.urls.data}/getMPs/`,
    //   method: 'GET',
    //   success: (data) => {
    //     const samePeople = this.$options.cardData.parlaState.samePeople || [];
    //     const differentPeople = this.$options.cardData.parlaState.differentPeople || [];
    //     const sameData = JSON.parse(JSON.stringify(data));
    //     self.samePeople = sameData.map(person => ({
    //       selected: samePeople.indexOf(person.id) > -1,
    //       label: person.name,
    //       id: person.id,
    //       image: self.getPersonPortrait(person),
    //     }));

    //     const differentData = JSON.parse(JSON.stringify(data));
    //     self.differentPeople = differentData.map(person => ({
    //       selected: differentPeople.indexOf(person.id) > -1,
    //       label: person.name,
    //       id: person.id,
    //       image: self.getPersonPortrait(person),
    //     }));

    //     this.loadResults();
    //   },
    //   error(error) {
    //     // eslint-disable-next-line no-console
    //     console.log(error);
    //   },
    // });

    // Promise.all([peoplePromise]).then(() => {
    //   this.loadResults();
    // });
  },
  created() {
    const { template, siteMap: sm } = this.$options.cardData;
    template.contextUrl = `${this.slugs.urls.base}/${sm.landing.tools}/${sm.tools.voteComparator}`;
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
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';
@import 'parlassets/scss/helper';

::v-deep .card-content {
  min-height: 660px;
}

#primerjalnik {
  ::v-deep .p-tabs .p-tabs-content,
  ::v-deep .p-tabs .p-tabs-content .tab-content {
    overflow-y: visible;
    overflow-x: visible;
  }

  ::v-deep .p-tabs .p-tabs-content {
    margin-top: 6px;
  }

  ::v-deep .word-list {
    max-height: none;
    height: 420px;
    overflow-y: auto;

    .column-label {
      flex: 2;

      .chart-label .label-container {
        line-height: 1;

        @include respond-to(mobile) {
          font-size: 12px;
        }
      }
    }
  }

  .glasovanja {
    ::v-deep #votingCard {
      height: 420px;
    }
  }

  .mdt-wrapper {
    ::v-deep .progress-bar {
      background-color: $third;
    }
  }

  .tab-content,
  .mdt-wrapper {
    height: 420px;
  }

  .primerjalnik-ps-switch {
    background: $white;
    cursor: pointer;
    padding: 5px;
    display: inline-block;
    margin: 5px;
    color: $font-default;

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
      color: $first;
    }

    &.on {
      background: $first;
      color: $white;

      &::after {
        transform: rotate(0deg);
        color: $white;
      }
    }
  }

  .primerjalnik.text-frame {
    display: flex;
    padding: 10px;

    @include respond-to(mobile) {
      flex-direction: column;
    }

    .primerjalnik-text,
    .primerjalnik-button {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .primerjalnik-text {
      flex: 1 0 66%;
      padding: 5px 10px 5px 0;

      @include respond-to(mobile) {
        padding-right: 0;
      }

      p {
        margin: 15px 0 20px;

        @include respond-to(mobile) {
          border-bottom: 1px solid $tools-border;
          padding-bottom: 25px;
        }
      }

      .searchfilter-checkboxes {
        display: flex;
        justify-content: center;

        @include respond-to(mobile) {
          margin-bottom: 20px;
        }

        .searchfilter-checkbox {
          height: 30px;

          .checkbox + label {
            text-align: left;
            margin-bottom: 0;
            font-size: 11px;
            line-height: 30px;
            color: $font-default;

            &::before {
              margin-top: 0;
              background-color: transparent;
            }
          }
        }
      }
    }

    .primerjalnik-button {
      flex: 1 0 33%;
      padding: 5px 0 5px 10px;
      border-left: 1px solid $tools-border;

      @include respond-to(mobile) {
        border-left: none;
        padding-left: 0;
      }

      .summary {
        margin: 0;
        line-height: 20px;
        text-align: center;
        font-size: 11px;
        color: $font-default;

        @include respond-to(mobile) {
          margin-top: 15px;
        }
      }
    }
  }
}
</style>
