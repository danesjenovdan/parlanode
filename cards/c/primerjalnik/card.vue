<template>
  <div class="card-container card-halfling card-IME_KARTICE" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig"></card-header>

    <div class="card-content">
      <div :class="['card-content-front', {'is-loading': loading}]">
        <div class="primerjalnik">
          <p>Zanima me, na katerih glasovanjih so
            <span class="primerjalnik-for">
              <span
                v-for="party in sameParties"
                :key="party.id"
                class="tag"
                @click="togglePartySame(party)">
                {{ party.acronym }}
              </span>
              <span
                v-for="person in selectedSamePeople"
                :key="person.id"
                class="tag">
                {{ person.name }}
              </span>
              <span class="plus" @click="toggleModal('same', true)">+</span>
            </span>
            glasovali enako,
            <span class="primerjalnik-against">
              <span
                v-for="party in differentParties"
                :key="party.id"
                class="tag">
                {{ party.acronym }}
              </span>
              <span
                v-for="person in selectedDifferentPeople"
                :key="person.id"
                class="tag">
                {{ person.name }}
              </span>
              <span class="plus" @click="toggleModal('different', true)">+</span>
            </span>
            pa drugače od njih.
            <span class="load" @click="loadResults">Naloži</span>
          </p>
          <div class="row primerjalnik-extras">
            <div class="col-md-4">
              <div class="searchfilter-checkbox">
                  <input id="rev" type="checkbox" class="checkbox" @click="handleCheckbox" v-bind:checked="special">
                  <label for="rev">Ignoriraj "odsotne" glasovnice</label>
              </div>
            </div>
            <div class="col-md-8">
              <p class="summary"><strong>{{ votes.length }}</strong> filtriranih glasovanj predstavlja <strong>{{ total === 0 ? 0 : round(votes.length / total * 100, 2) }}%</strong> vseh glasovanj.</p>
            </div>
          </div>
        </div>

        <tabs dark :switch-callback="focusTab">
          <tab header="Seznam glasovanj">
            <div class="empty" v-if="filteredVotes.length === 0"></div>
            <div v-else id="votingCard" class="date-list">
              <div class="session_voting">
                <div
                  v-for="vote in filteredVotes"
                  :key="vote.session.id"
                  class="clearfix single_voting">
                  <div v-if="vote.results.is_outlier" class="fire-badge"></div>
                  <div v-if="vote.results.has_outliers && vote.results.is_outlier" class="lightning-badge"></div>
                  <div v-if="vote.results.has_outliers && !vote.results.is_outlier" class="lightning-badge" style="left: -7px;"></div>
                  <a :href="vote.url">
                    <div class=" col-md-1 ">
                      <div :class="vote.accepted">
                        <p>
                          <i :class="vote.accepted_glyph"></i>
                        </p>
                      </div>
                    </div>
                    <div class="col-md-11 border-left">
                      <div class="col-md-6">
                        <div class="session_title ">
                          <p>{{ vote.results.text }}</p>
                        </div>
                      </div>
                      <div class="col-md-6 ">
                        <div class="session_votes ">
                          <div class="progress smallbar ">
                            <div class="progress-bar fontblue " v-bind:style="{ width: vote.percent_votes_for + '%' }">
                              <span class="sr-only ">{{ vote.percent_votes_for }}% votes for</span>
                            </div>
                            <div class="progress-bar funblue " v-bind:style="{ width: vote.percent_against + '%' }">
                              <span class="sr-only ">{{ vote.percent_against }}% votes for</span>
                            </div>
                            <div class="progress-bar ignoreblue " v-bind:style="{ width: vote.percent_abstain + '%' }">
                              <span class="sr-only ">{{ vote.percent_abstain }}% votes for</span>
                            </div>
                            <div class="progress-bar noblue " v-bind:style="{ width: vote.percent_not_present + '%' }">
                              <span class="sr-only ">{{ vote.percent_not_present }}% votes for</span>
                            </div>
                          </div>
                          <div class="row ">
                            <div class="col-xs-3 ">
                              {{ vote.results.votes_for }}
                              <div class="type ">Za</div>
                              <div class="indicator aye ">&nbsp;</div>
                            </div>
                            <div class="col-xs-3 ">
                              {{ vote.results.against }}
                              <div class="type ">Proti</div>
                              <div class="indicator ney ">&nbsp;</div>
                            </div>
                            <div class="col-xs-3 ">
                              {{ vote.results.abstain }}
                              <div class="type ">Vzdržan</div>
                              <div class="indicator abstention ">&nbsp;</div>
                            </div>
                            <div class="col-xs-3 ">
                              {{ vote.results.not_present }}
                              <div class="type ">Niso</div>
                              <div class="indicator not ">&nbsp;</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </tab>
          <tab header="Dinamika skozi čas">
            <div class="empty" v-if="filteredVotes.length === 0"></div>
            <time-chart v-if="filteredVotes.length !== 0" :data="data"></time-chart>
          </tab>
          <tab header="Dinamika glede na MDT" class="tab-three">
            <div v-if="filteredVotes.length === 0" class="empty"></div>
            <bar-chart v-else :data="barChartData"></bar-chart>
          </tab>
        </tabs>

      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl"></card-embed>

      <card-share :url="shortenedCardUrl"></card-share>
    </div>
    <card-footer :link="slugs.base"></card-footer>

    <div v-show="sameModalVisible" class="card-modal">
      <div class="card-modal-header">
        Vklopi cele poslanske skupine ali dodaj posamezne poslance.
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
            :data-acronym="party.acronym">
            {{ party.acronym }}
          </span>
        </p>
        <search-dropdown
          :items="samePeople"
          :placeholder="samePeoplePlaceholder">
        </search-dropdown>
      </div>
    </div>

    <div v-show="differentModalVisible" class="card-modal">
      <div class="card-modal-header">Vklopi cele poslanske skupine ali dodaj posamezne poslance.<div class="closeme" @click="toggleModal('different', false)"></div></div>
      <div class="card-modal-content">
        <p>
          <span
            v-for="party in parties"
            :key="party.id"
            :class="['primerjalnik-ps-switch', {'on': party.isDifferent}]"
            @click="togglePartyDifferent(party)"
            :data-id="party.id"
            :data-acronym="party.acronym">
            {{ party.acronym }}
          </span>
        </p>
        <search-dropdown
          :items="differentPeople"
          :placeholder="differentPeoplePlaceholder"
        ></search-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  /* globals window $ measure */

  import common from 'mixins/common';
  import TimeChart from 'components/TimeChart.vue';
  import BarChart from 'components/BarChart.vue';

  export default {
    components: {
      TimeChart,
      BarChart,
    },
    mixins: [common],
    name: 'ImeKartice',
    data() {
      return {
        loading: false,
        parties: [],
        samePeople: [],
        differentPeople: [],
        special: false,
        data: [],
        total: 0,
        slugs: this.$options.cardData.urlsData,
        shortenedCardUrl: '',
        sameModalVisible: false,
        differentModalVisible: false,
        headerConfig: {
          circleIcon: 'og-list',
          heading: '&nbsp;',
          subheading: '7. sklic parlamenta',
          alternative: this.$options.cardData.cardData.altHeader === 'true',
          title: this.$options.cardData.cardData.name,
        },
      };
    },
    computed: {
      samePeoplePlaceholder() {
        return this.selectedSamePeople.length > 0 ? `Izbranih: ${this.selectedSamePeople.length}` : 'Izberi poslance';
      },
      differentPeoplePlaceholder() {
        return this.selectedDifferentPeople.length > 0 ? `Izbranih: ${this.selectedDifferentPeople.length}` :
          'Izberi poslance';
      },
      generatedCardUrl() {
        return 'https://glej.parlameter.si/group/method/';
      },
      filteredVotes() {
        return this.getFilteredVotes();
      },
      queryUrl() {
        const base = 'https://analize.parlameter.si/v1/s/getComparedVotes/'
        // const base = 'http://127.0.0.1:8000/v1/s/getComparedVotes/';
        if (this.special) {
          return base + '?people_same=' + this.selectedSamePeople.map(person => person.id).toString() + '&parties_same=' +
          this.sameParties.map(party => party.id).toString() + '&people_different=' + this.selectedDifferentPeople.map(
            person => person.id).toString() + '&parties_different=' + this.differentParties.map(party => party.id).toString() + '&special=true';
        } else {
          return base + '?people_same=' + this.selectedSamePeople.map(person => person.id).toString() + '&parties_same=' +
          this.sameParties.map(party => party.id).toString() + '&people_different=' + this.selectedDifferentPeople.map(
            person => person.id).toString() + '&parties_different=' + this.differentParties.map(party => party.id).toString();
        }
      },
      votes() {
        return this.data.map(function (e) {
          const v = JSON.parse(JSON.stringify(e));
          const allInVotes = v.results.votes_for + v.results.against +
            v.results.abstain + v.results.not_present;
          v.url = `https://parlameter.si/seja/glasovanje/${e.session.id}/${e.results.motion_id$}`;
          v.accepted = `accepted ${e.results.result === true ? 'aye' : 'nay'}`;
          v.accepted_glyph = `glyphicon glyphicon-${e.results.result === true ? 'ok' : 'remove'}`;
          v.percent_votes_for = Math.floor((v.results.votes_for / allInVotes) * 100);
          v.percent_against = Math.floor((v.results.against / allInVotes) * 100);
          v.percent_abstain = Math.floor((v.results.abstain / allInVotes) * 100);
          v.percent_not_present = Math.floor((v.results.not_present / allInVotes) * 100);
          return v;
        });
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
    },
    mounted() {
      const self = this;
      $.ajax({
        url: 'https://data.parlameter.si/v1/getAllPGs/',
        method: 'GET',
        success(data) {
          self.parties = Object.keys(data).map(partyId => ({
            id: data[partyId].id,
            acronym: data[partyId].acronym,
            is_coalition: data[partyId].is_coalition,
            name: data[partyId].name,
            isSame: false,
            isDifferent: false,
          }));
        },
        error(error) {
          window.alert(JSON.stringify(error));
        },
      });
      $.ajax({
        url: 'https://data.parlameter.si/v1/getMPs/',
        method: 'GET',
        success(data) {
          const sameData = JSON.parse(JSON.stringify(data));
          self.samePeople = sameData.map((person) => {
            person.selected = false;
            person.label = person.name;

            return person;
          });

          const differentData = JSON.parse(JSON.stringify(data));
          self.differentPeople = differentData.map((person) => {
            person.selected = false;
            person.label = person.name;

            return person;
          });
        },
        error(error) {
          window.alert(JSON.stringify(error));
        },
      });
    },
    methods: {
      handleCheckbox() {
        this.special = !this.special;
      },
      focusTab(tabNumber) {
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
      toggleModal(modalType, newState) {
        this[`${modalType}ModalVisible`] = newState;
      },
      loadResults() {
        if (this.selectedSamePeople.length + this.sameParties.length > 1 ||
           (this.selectedSamePeople.length + this.sameParties.length === 1 &&
           this.selectedDifferentPeople.length + this.differentParties.length > 0)) {
          this.loading = true;
          console.log('loading results');
          console.log(this.queryUrl);
          $.ajax({
            url: this.queryUrl,
            method: 'GET',
            success: (data) => {
              console.log('results loaded');
              console.log(data);
              this.data = data.results;
              this.total = data.total;
              this.loading = false;
            },
            error(error) {
              window.alert(JSON.stringify(error));
              this.loading = false;
            },
          });
        } else {
          window.alert('nimaš izbranih dovolj pogojev za primerjavo');
        }
      },
      getFilteredVotes() {
        return this.votes;
      },
      shortenUrl(url) {
        return new Promise((resolve) => {
          $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${url}&frame=true`)}`, (
            response) => {
            this.$el.querySelector('.card-content-share button').textContent = 'KOPIRAJ';
            resolve(response);
          });
        });
      },
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
    watch: {
      generatedCardUrl(newUrl) {
        this.shortenUrl(newUrl).then(newShortenedUrl => (this.shortenedCardUrl = newShortenedUrl));
      },
      selectedSamePeople(newSelectedSamePeople) {
        newSelectedSamePeople.forEach((person) => {
          this.selectedDifferentPeople.filter((p) => {
            return p.id === person.id;
          }).map((p) => {
            p.selected = false;
          });
        });
      },
      selectedDifferentPeople(newSelectedDifferentPeople) {
        newSelectedDifferentPeople.forEach((person) => {
          this.selectedSamePeople.filter((p) => {
            return p.id === person.id;
          }).map((p) => {
            p.selected = false;
          });
        });
      },
    },
    beforeMount() {
      this.shortenUrl(this.generatedCardUrl);
    },
  };
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';
  @import '~parlassets/scss/helper';

  .card-content-front.is-loading {
    overflow-y: hidden;
    position: relative;
    &::before {
      background: rgba($white, 0.6) url(https://cdn.parlameter.si/v1/parlassets/img/loader.gif) no-repeat center center;
      content: '';
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
  }

  .primerjalnik {

    text-align: center;
    background-color: $funblue-light;
    padding: 30px 30px 10px 30px;
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
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
        background-color: $funblue;
        color: #ffffff;
        padding: 5px;
        font-size: 12px;
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
      color: $sadblue;
      cursor: pointer;
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
      }
    }

    .primerjalnik-extras {
      margin-top: 40px;
    }

    .searchfilter-checkbox {
      height: 40px;
      label {
        text-align: left;
        margin-bottom: 0;
      }
    }

    .summary {
      margin-bottom: 0;
      line-height: 40px;
      text-align: right;

      @include respond-to(mobile) {
        text-align: left;
        margin-top: 10px;
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
    // background-color: #ff0000;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-image: url('https://cdn.parlameter.si/v1/parlassets/img/icons/primerjalnik-empty.png');
    background-position: center;
    background-repeat: no-repeat;
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

  .tabs { height: 410px; }
  .tab-three { padding-top: 16px; }
</style>
