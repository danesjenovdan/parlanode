<template>
  <card-wrapper
    :id="cardData.cardData._id"
    :data-id="`${cardGroup}/${cardMethod}`"
    content-class="full card-scroll"
    v-bind="{ cardUrl, headerConfig }">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <div :class="{ 'filters': true, 'filters--shadow': card.shouldShadow }">
      <div class="filter text-filter">
        <div class="filter-label">Išči po vsebini govorov</div>
          <search-field v-model="textFilter" @input="searchSpeakings()" />
        </div>
        <div class="filter month-dropdown">
          <div class="filter-label">Časovno obdobje</div>
            <search-dropdown
              :items="dropdownItems.months"
              :placeholder="monthPlaceholder"
              :alphabetise="false"
              :select-callback="searchSpeakings"
              :clear-callback="searchSpeakings">
            </search-dropdown>
          </div>

          <div class="filter month-dropdown">
            <div class="filter-label">Vrsta seje</div>
            <search-dropdown
              :items="dropdownItems.sessions"
              :placeholder="sessionPlaceholder"
              :alphabetise="true"
              :select-callback="searchSpeakings"
              :clear-callback="searchSpeakings">
            </search-dropdown>
          </div>
        </div>

        <div class="speaks">
            <div id="speaks" class="card-scroll__wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <div v-for="(speakingDay, key, index) in groupSpeakingDays">
                    <div class="date">{{ speakingDay[0].session.date }}, {{ speakingDay[0].session.name }}, <span v-for="(org, indexOrg) in speakingDay[0].session.orgs">{{ org.name }} <span v-if="indexOrg < (speakingDay[0].session.orgs.length - 1)">,</span></span></div>
                    <ul class="speaks__list">
                        <govor v-for="speech in speakingDay" :key="speech.speech_id" :speech="speech" css-class="person-speech"></govor>
                    </ul>
                </div>
                <div v-if="speakingDays.length===0">
                    <card-empty></card-empty>
                </div>
            </div>
            <div v-if="card.isLoading" class="nalagalnik__wrapper">
                <div class="nalagalnik"></div>
            </div>

        </div>
    </card-wrapper>
</template>

<script>
import CardEmpty from 'components/Card/Empty.vue';
import Govor from 'components/Govor.vue';
import SearchField from 'components/SearchField.vue';
import SearchDropdown from 'components/SearchDropdown.vue';

  import generateMonths from 'helpers/generateMonths';
  import common from 'mixins/common';

  import axios from 'axios';

  import infiniteScroll from 'directives/infiniteScroll';

  export default {
    directives: {
      infiniteScroll
    },
    components: {
      SearchField,
      SearchDropdown,
      Govor,
      CardEmpty
    },
    mixins: [common],
    data() {
      let textFilter = '';
      let allMonths = generateMonths();

      const arrayColumn = (arr, n) => arr.map(x => x[n]);

      let highlightingSession = arrayColumn(this.cardData.data.highlighting, 'session');
      let highlightingOrgs = [].concat.apply([], arrayColumn(highlightingSession, 'orgs'));
      let allSessions = highlightingOrgs.map(
        org => ({
          id: org.id,
          label: org.name,
          selected: false
        })
      );

      allSessions = allSessions.map(JSON.stringify).reverse().filter(function(e, i, a) {
        return a.indexOf(e, i + 1) === -1;
      }).reverse().map(JSON.parse)

      return {
        card: {
          currentPage: 0,
          isLoading: false,
          lockLoading: false,
          shouldShadow: false
        },
        cardMethod: this.cardData.cardData.method,
        cardGroup: this.cardData.cardData.group,
        speakingDays: this.cardData.data.highlighting,
        textFilter,
        allMonths,
        allSessions
      };
    },
    mounted() {
      // document.getElementById('speaks').addEventListener('scroll', this.checkScrollPosition)
    },
    computed: {
      cardUrl() {
        const state = {}
        if (this.type === 'person') {
            state.people = this.cardData.data.filters.people;

        } else if (this.type === 'party') {
            state.parties = this.cardData.data.filters.parties[0];
        }

        if (this.selectedMonths.length > 0) {
          // since dates in month dropdown are generated as m-y we need to prepare them as 1.m.y
          state.time_filter = this.selectedMonths.map(m => {
            const [year, month] = m.id.split('-');
            return [1, month, year].join('.');
          });
        }

        if (this.selectedSessions.length > 0) {
          state.wb = this.selectedSessions.map(s => s.id);
        }

        var encodedQueryData = '';
        if (Object.keys(state).length !== 0) {
          encodedQueryData = this.encodeQueryData(state);
        }

        let textFilter = this.textFilter.length ? this.textFilter : '*';

        return `https://isci.parlameter.si/filter/${textFilter}/${this.card.currentPage}${encodedQueryData}`;
      },
      selectedSessions() {
        return this.allSessions.filter(session => session.selected);
      },
      selectedMonths() {
        return this.allMonths.filter(month => month.selected);
      },
      sessionPlaceholder() {
        return this.selectedSessions.length > 0 ? `Izbranih: ${this.selectedSessions.length}` : 'Izberi';
      },
      monthPlaceholder() {
        return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
      },
      dropdownItems() {
        return {
          months: this.allMonths,
          sessions: this.allSessions
        };
      },
      groupSpeakingDays() {
        return this.speakingDays
          .reduce(function(r, a) {
            r[a.session_id] = r[a.session_id] || [];
            r[a.session_id].push(a);
            return r;
          }, Object.create(null));
      },
      headerConfig() {

        return Object.assign({}, {
          alternative: JSON.parse(this.cardData.cardData.altHeader || 'false'),
          title: this.cardData.cardData.name,
        });
      }
    },
    methods: {
      searchSpeakings(waitTime = 750) {

        if (!Number.isInteger(waitTime)) {
          waitTime = 0;
        }

        this.card.lockLoading = true;
        setTimeout(() => {
          if (!this.card.isLoading) {
            this.card.currentPage = 0;
            this.card.isLoading = true;
            axios.get(this.cardUrl).then(response => {
              this.speakingDays = response.data.highlighting;
              this.speakingDays = response.data.highlighting;
              this.card.isLoading = false;
            })
          }
          this.card.lockLoading = false;
        }, waitTime);

      },
      loadMore() {
        if (this.card.lockLoading || this.card.isLoading) return false;
        this.card.isLoading = true;
        this.card.currentPage++

        axios.get(this.cardUrl).then(response => {
          this.speakingDays = this.speakingDays.concat(response.data.highlighting)

            this.card.isLoading = false;

          // end infinite scrolling
          if (response.data.response.start >= response.data.response.numFound) {
            // @todo decide what to show when no more data
            this.card.lockLoading = true;
          }

        });
      },
      checkScrollPosition() {
        if (!this.card.lockLoading) {
          this.card.lockLoading = true;
          setTimeout(() => {
            if (document) {
              this.card.shouldShadow = document.getElementById('speaks').scrollTop > 0;
            }
            this.card.lockLoading = false;

                    }, 200)
                }
            },
            measurePiwik(filter, sort, order) {
                if (typeof measure === 'function') {
                    if (sort !== '') {
                        measure('s', 'session-sort', `${sort} ${order}`, '');
                    } else if (filter !== '') {
                        measure('s', 'session-filter', filter, '');
                    }
                }
            }
        },
        props: {
            cardData: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                required: true,
                validator: value => ['person', 'party'].indexOf(value) > -1,
            },
            person: Object,
            party: Object,
        }
    };
</script>

<style lang="scss" scoped>
    @import '~parlassets/scss/breakpoints';
    @import '~parlassets/scss/colors';

    .card-scroll {
        padding: 0;

        .search-field {
            background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/search_blue.svg');
        }

        .filters {
            .filter {
                @include respond-to(desktop) {
                    margin-right: 10px;
                    flex: 1;
                }

                @include respond-to(mobile) {
                    width: 100%;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            @include respond-to(mobile) {
                flex-wrap: wrap;
                min-height: 154px;
            }

            .option-party-buttons {
                @include show-for(desktop, flex);

                width: 27.5%;
                padding-top: 26px;

                .party-button:not(:last-child) {
                    margin-right: 3px;
                }
            }
        }

    }

    .speaks {
        flex: 1;
        position: relative;
        padding-bottom: 20px;

        &__list {
            padding: 0 0 10px;
            margin: 0;

        }

        .nalagalnik__wrapper {
            background: rgba(255,255,255,.75);
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;

            .nalagalnik {
                position: absolute;
                top: calc(50% - 50px);
            }
        }
    }

</style>