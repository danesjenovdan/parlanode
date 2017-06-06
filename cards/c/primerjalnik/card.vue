<template>
  <div class="card-container card-halfling card-IME_KARTICE" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div class="primerjalnik">
          Zanima me, na katerih glasovanjih so <span class="primerjalnik-for"><span v-for="party in sameParties">{{ party.acronym }} </span>
          <span
            v-for="person in selectedSamePeople">{{ person.name }} </span><span class="plus" @click="openModalSame"></span></span> glasovali enako, <span class="primerjalnik-against"><span v-for="party in differentParties">{{ party.acronym }} </span>
            <span
              v-for="person in selectedDifferentPeople">{{ person.name }} </span><span class="plus" @click="openModalDifferent"></span></span> pa drugače od njih.
        </div>
        <div class="special-container">
          <div class="searchfilter-checkbox">
              <input id="rev" type="checkbox" class="checkbox" @click="handleCheckbox" v-bind:checked="special">
              <label for="rev">Ignoriraj "odsotne" glasovnice</label>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <button @click="loadResults" class="loadme">Naloadaj</button>
          </div>
        </div>

        <div>{{ votes.length }} filtriranih glasovanj predstavlja {{ total === 0 ? 0 : round(votes.length / total * 100, 2) }}%
          vseh glasovanj.</div>

        <div>{{ queryUrl }}</div>

        <tabs dark :switch-callback="focusTab">
          <tab header="Seznam glasovanj">
            <div class="seznam-glasovanj-container">
              <div id="votingCard" class="date-list">
                <div class="session_voting">
                  <div v-for="vote in filteredVotes" class="clearfix single_voting">
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
                      <div class="col-md-11 border-left ">
                        <div class="col-md-6 ">
                          <div class="session_title ">
                            <p>
                              {{ vote.results.text }}
                            </p>
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
            </div>            
          </tab>
          <tab header="Dinamika skozi čas">
            <time-chart :data="data"></time-chart>
          </tab>
          <tab header="Dinamika glede na MDT">
            <bar-chart :data="data"></bar-chart>
          </tab>
        </tabs>

      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="shortenedCardUrl" />
    </div>
    <card-footer :link="slugs.base" />

    <div class="modal fade" tabindex="1" role="dialog" id="modal-primerjalnik-same">
      <div class="modal-dialog modal-wide modal-center" role="document">
        <div class="modal-center-wrapper">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">Vklopi cele poslanske skupine ali poišči posamezne poslance.</h4>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-12">
                    <span v-for="party in parties" :class="['primerjalnik-ps-switch', {'on': party.isSame}]" @click="togglePartySame(party)"
                      :data-id="party.id" :data-acronym="party.acronym">{{ party.acronym }}</span>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <search-dropdown :items="samePeople" :placeholder="samePeoplePlaceholder"></search-dropdown>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="1" role="dialog" id="modal-primerjalnik-different">
      <div class="modal-dialog modal-wide modal-center" role="document">
        <div class="modal-center-wrapper">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">Vklopi cele poslanske skupine ali poišči posamezne poslance.</h4>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-12">
                    <span v-for="party in parties" :class="['primerjalnik-ps-switch', {'on': party.isDifferent}]" @click="togglePartyDifferent(party)"
                      :data-id="party.id" :data-acronym="party.acronym">{{ party.acronym }}</span>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <search-dropdown :items="differentPeople" :placeholder="differentPeoplePlaceholder"></search-dropdown>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>


</template>

<script>
  /* globals window $ measure */

  import CardInfo from 'components/Card/Info.vue';
  import CardEmbed from 'components/Card/Embed.vue';
  import CardShare from 'components/Card/Share.vue';
  import CardHeader from 'components/Card/Header.vue';
  import CardFooter from 'components/Card/Footer.vue';
  import initializeBack from 'mixins/initializeBack';
  import common from 'mixins/common';

  import TimeChart from 'components/TimeChart.vue';
  import BarChart from 'components/BarChart.vue';

  export default {
    components: {
      CardInfo,
      CardEmbed,
      CardShare,
      CardHeader,
      CardFooter,
      TimeChart,
      BarChart
    },
    mixins: [initializeBack],
    name: 'ImeKartice',
    data() {
      return {
        parties: [],
        samePeople: [],
        differentPeople: [],
        // data: this.$options.cardData.data.results,
        special: false,
        data: [],
        total: 0,
        slugs: this.$options.cardData.urlsData,
        shortenedCardUrl: '',
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
          var allInVotes = e.results.votes_for + e.results.against + e.results.abstain + e.results.not_present;
          e.url = 'https://parlameter.si/seja/glasovanje/' + e.session.id + '/' + e.results.motion_id;
          e.accepted = 'accepted ' + ((e.results.result === true) ? 'aye' : 'nay');
          e.accepted_glyph = 'glyphicon ' + ((e.results.result === true) ? 'glyphicon-ok' : 'glyphicon-remove');
          e.percent_votes_for = Math.floor(e.results.votes_for / allInVotes * 100);
          e.percent_against = Math.floor(e.results.against / allInVotes * 100);
          e.percent_abstain = Math.floor(e.results.abstain / allInVotes * 100);
          e.percent_not_present = Math.floor(e.results.not_present / allInVotes * 100);

          return e;
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
    },
    mounted: function () {
      const self = this;
      $.ajax({
        url: 'https://data.parlameter.si/v1/getAllPGs/',
        method: 'GET',
        success: function (data) {
          let parties = [];
          for (var party_id in data) {
            parties.push({
              id: data[party_id].id,
              acronym: data[party_id].acronym,
              is_coalition: data[party_id].is_coalition,
              name: data[party_id].name,
              isSame: false,
              isDifferent: false,
            });
          }
          self.parties = parties;
        },
        error: function (error) {
          alert(JSON.stringify(error));
        }
      });
      $.ajax({
        url: 'https://data.parlameter.si/v1/getMPs/',
        method: 'GET',
        success: function (data) {
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
        error: function (error) {
          alert(JSON.stringify(error));
        }
      });
    },
    methods: {
      handleCheckbox: function(event) {
          this.special = !this.special;
      },
      focusTab(tabNumber) {
        // if (tabNumber !== 1) {
        //   this.$refs.parties.expandedParty = null;
        //   this.$refs.parties.expandedOption = null;
        // }
        // if (tabNumber !== 2) {
        //   this.$refs.sides.expandedParty = null;
        //   this.$refs.sides.expandedOption = null;
        // }
      },
      round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
      },
      togglePartySame(party) {
        party.isDifferent = false;
        party.isSame = !party.isSame;
      },
      togglePartyDifferent(party) {
        party.isDifferent = !party.isDifferent;
        party.isSame = false;
      },
      openModalSame() {
        $('#modal-primerjalnik-same').modal('show');
      },
      openModalDifferent() {
        $('#modal-primerjalnik-different').modal('show');
      },
      loadResults() {
        if ((this.selectedSamePeople.length + this.sameParties.length) > 1) {
          console.log('loading results');
          console.log(this.queryUrl);
          const self = this;
          $.ajax({
            url: self.queryUrl,
            method: 'GET',
            success: function (data) {
              console.log('results loaded');
              console.log(data);
              self.data = data.results;
              self.total = data.total;

              $('.modal').modal('hide');
            },
            error: function (error) {
              alert(JSON.stringify(error));
            }
          });
        } else if ((this.selectedSamePeople.length + this.sameParties.length) === 1 && (this.selectedDifferentPeople.length +
            this.differentParties.length) > 0) {
          console.log('loading results');
          console.log(this.queryUrl);
          const self = this;
          $.ajax({
            url: self.queryUrl,
            method: 'GET',
            success: function (data) {
              console.log('results loaded');
              console.log(data);
              self.data = data.results;
              self.total = data.total;

              $('.modal').modal('hide');
            },
            error: function (error) {
              alert(JSON.stringify(error));
            }
          });
        } else {
          alert('nimaš izbranih dovolj pogojev za primerjavo');
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
      }
    },
    beforeMount() {
      this.shortenUrl(this.generatedCardUrl);
    },
  };
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';

  .primerjalnik {

    text-align: center;
    background-color: $funblue-light;
    padding: 30px;

    .primerjalnik-for,
    .primerjalnik-against {
      .plus {
        background-color: #ffffff;
        display: inline-block;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
  }

  .primerjalnik-ps-switch {
    background: #ffffff;
    cursor: pointer;
    padding: 0 10px 0 10px;

    &.on {
      background: $funblue;
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
</style>
<style lang="scss">
  .modal-backdrop.fade.in {
    display: none !important;
  }
</style>