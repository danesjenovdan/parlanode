<template>
  <div class="card-container card-halfling card-glasovanja-seja" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div class="filters">
          <div class="filter text-filter">
            <div class="filter-label">Išči po naslovu glasovanja</div>
            <search-field v-model="textFilter"/>
          </div>
          <div class="filter tag-dropdown">
            <div class="filter-label">Matično delovno telo</div>
            <search-dropdown :items="dropdownItems.tags" :placeholder="tagPlaceholder"></search-dropdown>
          </div>
          <div class="filter month-dropdown">
            <div class="filter-label">Časovno obdobje</div>
            <search-dropdown :items="dropdownItems.months" :placeholder="monthPlaceholder" :alphabetise="false"></search-dropdown>
          </div>
          <div class="filter button-filter">
            <div class="filter-label">Prikaži</div>
            <div class="filter-content">
              <striped-button
                v-for="voteType in voteTypes"
                :color="voteType.color"
                :key="voteType.id"
                :selected="selectedVoteTypes.indexOf(voteType.id) > -1"
                :small-text="voteType.label"
                :click-handler="() => toggleVoteType(voteType.id)"
              />
            </div>
          </div>
        </div>
        <div id="votingCard" class="date-list">
          <div class="session_voting"
               v-for="votingDay in filteredVotingDays"
               :key="votingDay.date">
            <div class="date">{{ votingDay.date }}</div>
            <div class="clearfix single_voting"
                 v-for="(vote, index) in votingDay.results"
                 :key="index">
              <a :href="vote.url">
                <div v-if="vote.is_outlier" class="fire-badge"></div>
                <div v-if="vote.has_outliers && vote.is_outlier" class="lightning-badge"></div>
                <div v-if="vote.has_outliers && !vote.is_outlier" class="lightning-badge" style="left: -37px; position: absolute;"></div>
                <div class="col-md-1">
                  <div :class="vote.accepted">
                    <p>
                      <i :class="vote.accepted_glyph"></i>
                    </p>
                  </div>
                </div>
                <div class="col-md-11 border-left">
                  <div class="col-md-6">
                    <div class="session_title">
                      <p>
                        {{ vote.text.split(' ').length > 19 ? vote.text.split(' ').splice(0, 19).join(' ') + ' ...' : vote.text }}
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="session_votes">
                      <div class="progress smallbar">
                        <div class="progress-bar fontblue" :style="{ width: `${vote.percent_votes_for}%` }">
                          <span class="sr-only">{{ vote.percent_votes_for }}% votes for</span>
                        </div>
                        <div class="progress-bar funblue" :style="{ width: `${vote.percent_against}%` }">
                          <span class="sr-only">{{ vote.percent_against }}% votes for</span>
                        </div>
                        <div class="progress-bar ignoreblue" :style="{ width: `${vote.percent_abstain}%` }">
                          <span class="sr-only">{{ vote.percent_abstain }}% votes for</span>
                        </div>
                        <div class="progress-bar noblue" :style="{ width: `${vote.percent_not_present}%` }">
                          <span class="sr-only">{{ vote.percent_not_present }}% votes for</span>
                        </div>
                      </div>
                      <div class="row ">
                        <div class="col-xs-3 ">
                          {{ vote.votes_for }}
                          <div class="type ">Za</div>
                          <div class="indicator aye ">&nbsp;</div>
                        </div>
                        <div class="col-xs-3 ">
                          {{ vote.against }}
                          <div class="type ">Proti</div>
                          <div class="indicator ney ">&nbsp;</div>
                        </div>
                        <div class="col-xs-3 ">
                          {{ vote.abstain }}
                          <div class="type ">Vzdržan</div>
                          <div class="indicator abstention ">&nbsp;</div>
                        </div>
                        <div class="col-xs-3 ">
                          {{ vote.not_present }}
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

      <card-info>
        <p class="info-text lead">Pregled vseh glasovanj, ki so se zgodila na seji</p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text">Za vsa glasovanja na posamezni seji preštejemo vse glasove (ZA, PROTI, VZDRŽAN/-A) in število poslancev, ki niso glasovali, ter izpišemo rezultate.</p>
        <p class="info-text">Nabor glasovanj pridobimo s spletnega mesta <a href="http://www.dz-rs.si">DZ RS</a>.</p>
        <p class="info-text">Za označevanje nepričakovanih rezultatov glasovanj uporabljamo probabilistično metodo analize glavnih komponent, <a href="http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html">kot je implementirana v knjižicah scikit-learn</a> in opisana v <a href="http://www.miketipping.com/papers/met-mppca.pdf">M. Tipping and C. Bishop, Probabilistic Principal Component Analysis, Journal of the Royal Statistical Society, Series B, 61, Part 3, pp. 611-622</a>.</p>
        <p class="info-text">Vsa glasovanja pretvorimo v štiridimenzionalne vektorje, kjer vsaka od komponent pomeni število oddanih glasovnic s specifičnim glasom (ZA, PROTI, NI, VZDRŽAN). PCA model prilagodimo matriki in s funkcijo <a href="https://github.com/scikit-learn/scikit-learn/blob/14031f6/sklearn/decomposition/pca.py#L485">score_samples</a> pridobimo "log-likelihood" vsakega glasovanja v našem modelu. Model deluje tako, da skuša pri prilagajanju "log-likelihood" vrednost maksimizirati za čim več glasovanj. Ko smo pridobili vse "log-likelihood" vrednosti jih razvrstimo od najmanjše proti največji in uporabimo četrtino vseh glasovanj, ki se modelu najslabše prilegajo. Ker v primerjavi z našim modelom ta glasovanja najbolj izstopajo, so kot taka najbolj "nepričakovana." V kartici jih označimo z ikono ognja.</p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="shortenedCardUrl" />
    </div>
    <card-footer :link="slugs.base" />
  </div>
</template>

<script>
  /* globals window $ measure */
  import { format as formatDate } from 'date-fns';
  import { find } from 'lodash';

  import voteMapper from 'helpers/voteMapper';
  import stateLoader from 'helpers/stateLoader';
  import generateMonths from 'helpers/generateMonths';
  import common from 'mixins/common';
  import SearchField from 'components/SearchField.vue';
  import StripedButton from 'components/StripedButton.vue';

  const formattedDateToMonthId = (date) => {
    const [day, month, year] = date.split('. ');
    return formatDate(new Date(year, month - 1, day), 'YYYY-M');
  };

  export default {
    components: { SearchField, StripedButton },
    mixins: [common],
    name: 'VlozeniAmandmaji',
    data() {
      const loadFromState = stateLoader(this.$options.cardData.state);

      const voteTypes = [
        { id: true, color: 'for', label: 'sprejeti', selected: false },
        { id: false, color: 'against', label: 'zavrnjeni', selected: false },
      ];

      const votingDays = this.$options.cardData.data.results.map(votingDay => ({
        date: votingDay.date,
        results: votingDay.votes.map(voteMapper),
      }));

      const allTags = this.$options.cardData.data.all_tags.map(
        tag => ({ id: tag, label: tag, selected: false }),
      );

      const allMonths = generateMonths();

      return {
        data: this.$options.cardData.data,
        slugs: this.$options.cardData.urlsData,
        shortenedCardUrl: '',
        headerConfig: {
          circleIcon: 'og-list',
          heading: '&nbsp;',
          subheading: '7. sklic parlamenta',
          alternative: this.$options.cardData.cardData.altHeader === 'true',
          title: 'Vloženi amandmaji',
        },
        cardMethod: this.$options.cardData.cardData.method,
        cardGroup: this.$options.cardData.cardData.group,
        textFilter: loadFromState('text') || '',
        votingDays,
        allTags: loadFromState('tags', allTags) || allTags,
        allMonths: loadFromState('months', allMonths) || allMonths,
        voteTypes: loadFromState('voteTypes', voteTypes) || voteTypes,
      };
    },
    computed: {
      generatedCardUrl() {
        const state = {};

        if (this.selectedTags.length > 0) state.tags = this.selectedTags;
        if (this.selectedMonths.length > 0) state.months = this.selectedMonths;
        if (this.selectedVoteTypes.length > 0) state.voteTypes = this.selectedVoteTypes;
        if (this.textFilter.length > 0) state.text = this.textFilter;

        return `https://glej.parlameter.si/${this.cardGroup}/${this.cardMethod}/${this.data.party.id}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
      },
      filteredVotingDays() {
        return this.getFilteredVotingDays();
      },
      tagPlaceholder() {
        return this.selectedTags.length > 0 ? `Izbranih: ${this.selectedTags.length}` : 'Izberi';
      },
      monthPlaceholder() {
        return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
      },
      dropdownItems() {
        const validTags = [];
        const validMonths = [];

        this.getFilteredVotingDays(true).forEach((votingDay) => {
          const monthId = formattedDateToMonthId(votingDay.date);
          if (validMonths.indexOf(monthId) === -1) validMonths.push(monthId);
          votingDay.results.forEach((vote) => {
            vote.tags.forEach((tag) => {
              if (validTags.indexOf(tag) === -1) validTags.push(tag);
            });
          });
        });

        return {
          tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
          months: this.allMonths.filter(month => validMonths.indexOf(month.id) > -1),
        };
      },
      selectedTags() {
        return this.allTags
          .filter(tag => tag.selected)
          .map(tag => tag.id);
      },
      selectedMonths() {
        return this.allMonths
          .filter(month => month.selected)
          .map(month => month.id);
      },
      selectedVoteTypes() {
        return this.voteTypes
          .filter(voteType => voteType.selected)
          .map(voteType => voteType.id);
      },
    },
    methods: {
      getFilteredVotingDays(onlyFilterByText = false) {
        const filterVotes = (vote) => {
          const textMatch = this.textFilter === '' || vote.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
          const tagMatch = onlyFilterByText || this.selectedTags.length === 0 ||
            vote.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
          const voteTypeMatch = onlyFilterByText || this.selectedVoteTypes.length === 0 ||
            this.selectedVoteTypes.indexOf(vote.result) > -1;
          return textMatch && tagMatch && voteTypeMatch;
        };

        return this.votingDays
          .map(votingDay => ({
            date: votingDay.date,
            results: votingDay.results.filter(filterVotes),
          }))
          .filter((votingDay) => {
            if (votingDay.results.length === 0) return false;
            const monthId = formattedDateToMonthId(votingDay.date);
            return onlyFilterByText || this.selectedMonths.length === 0 ||
              this.selectedMonths.indexOf(monthId) > -1;
          });
      },
      toggleVoteType(voteTypeId) {
        const clickedResult = find(this.voteTypes, { id: voteTypeId });
        clickedResult.selected = !clickedResult.selected;
      },
      shortenUrl(url) {
        return new Promise((resolve) => {
          $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${url}&frame=true`)}`, (
            response) => {
            this.$el.querySelector('.card-content-share button').textContent = 'KOPIRAJ';
            this.shortenedCardUrl = response;
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
    },
    beforeMount() {
      this.shortenUrl(this.generatedCardUrl);
    },
  };
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';

  .card-header h1,
  .card-footer h1 {
    color: #525252;
  }

  #votingCard {
    height: 500px;
    overflow-y: auto;
  }

  #votingCard div.member span {
    color: #525252;
    font-weight: 500;
  }

  #votingCard .member:last-child {
    border: none;
  }

  #votingCard .member.lastel {
    border: none;
    padding-bottom: 10px;
  }

  .session_voting {
    font-weight: 400;
    padding: 0;

    &:empty::after {
      color: #c8c8c8;
      content: "Ni rezultatov.";
      left: calc(50% - 41px);
      position: absolute;
      top: calc(50% - 10px);
    }

    .session_votes .progress.smallbar {
      height: 15px;
    }

    .session_votes {
      font-size: 30px;
      line-height: 40px;
      margin: 15px 0 10px 0;

      .type {
        font-size: 14px;
        line-height: 20px;
        text-transform: uppercase;
      }
    }

  }

  .session_voting {
    padding-left: 10px;
    .accepted {
      line-height: normal;
      height: 95px;
      p {
        position: relative;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);

        margin: 0;
        line-height: 30px;
        margin-top: 6px;
      }
    }
    .session_title {
      height: 95px;
      margin: 0;
      @include respond-to(mobile) {
        margin-top: 15px;
        margin-bottom: 10px;
      }
      p {
        position: relative;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        font-family: Roboto Slab;
        margin-top: 6px;
      }
    }
  }





  @media (max-width: 991px) {
    .session_voting .session_title {
      height: 93px;
    }
    .session_voting .accepted {
      height: 60px;
    }

    .border-left {
      border-left: none;
      border-top: 2px solid #dbdbdb;
    }

    .single_voting {
      padding-bottom: 15px;
      &:hover {
        .border-left {
          border-top-color: #cadde6;
        }
      }
    }
  }

  .single_voting {
    position: relative;
    &:hover {
      background-color: #e1f6ff;
      .border-left { border-left-color: #cadde6; }
    }
  }

  .session_voting .session_title p {
    font-size: 14px;
  }

  .session_voting .single_voting {
    margin-top: 15px;
  }

  .seja_anchor:hover {
    color: #525252;
  }

  .card-content-front {
    overflow-y: auto;
  }

  // filters
  .filters {
    padding-bottom: 12px;
    @include respond-to(mobile) {
      flex-wrap: wrap;
      min-height: 154px;
    }
    $label-height: 26px;

    display: flex;

    .filter {
      @include respond-to(desktop) {
        flex: 1;
        &:not(:last-child) { padding-right: 10px; }
      }
      width: 100%;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 300;
      line-height: $label-height;
    }

    .option-party-buttons {
      @include show-for(desktop, flex);
      @include show-for(mobile, flex);
      @include respond-to(mobile) { width: 100%; padding-top: 0; }

      width: 27.5%;
      padding-top: $label-height;

      .party-button:not(:last-child) {
        margin-right: 3px;
      }
    }

    .button-filter {
      @include show-for(desktop);

      .filter-content {
        display: flex;
        .striped-button {
          flex: 1;
          height: 51px;
          &:not(:last-child) { margin-right: 5px; }
        }
      }
    }

    .search-dropdown-options { top: 50px; }
  }

  .option-party-buttons {
    .sprejet {
      border-bottom-color: $funblue;

      &.selected, &:hover {
        background-color: $funblue;
      }
    }

    .zavrnjen {
      border-bottom-color: $red;

      &.selected, &:hover {
        background-color: $red;
      }
    }
  }
</style>
<style lang="scss">
  .card-glasovanja-seja {
    .search-dropdown-input {
      padding-top: 11px;
      padding-bottom: 11px;
      background-color: #ffffff;
    }

    .search-dropdown-options { top: 50px; }
  }
</style>
