<template>
  <div class="card-container card-halfling card-glasovanja-seja" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div class="filters">
          <div class="filter option-party-buttons">
            <div v-for="result in allResults"
            :class="['party-button', result.class, { selected: selectedResults.indexOf(result.id) > -1 }]"
            @click="toggleResult(result.id)">{{ result.label }}</div>
          </div>
          <div class="filter text-filter">
            <div class="filter-label">Išči po naslovu glasovanja</div>
            <input class="text-filter-input" type="text" v-model="textFilter">
          </div>
          <div class="filter tag-dropdown">
            <div class="filter-label">Matično delovno telo</div>
            <search-dropdown :items="dropdownItems.tags" :placeholder="tagPlaceholder"></search-dropdown>
          </div>
        </div>
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

  import CardInfo from 'components/Card/Info.vue';
  import CardEmbed from 'components/Card/Embed.vue';
  import CardShare from 'components/Card/Share.vue';
  import CardHeader from 'components/Card/Header.vue';
  import CardFooter from 'components/Card/Footer.vue';
  import initializeBack from 'mixins/initializeBack';

  export default {
    components: {
      CardInfo,
      CardEmbed,
      CardShare,
      CardHeader,
      CardFooter
    },
    mixins: [initializeBack],
    name: 'Glasovanja - seja',
    data() {

      const selectFromState = (items, stateItemIds) =>
        items.map(item =>
          Object.assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }),
        );

      let votes = this.$options.cardData.data.results.map(function (e) {
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

      let allResults = [
        { id: true, class: 'sprejet', label: 'SPREJET', selected: false },
        { id: false, class: 'zavrnjen', label: 'ZAVRNJEN', selected: false },
      ];

      let allTags = this.$options.cardData.data.tags.map(
        tag => ({ id: tag, label: tag, selected: false }),
      );

      let textFilter = '';

      if (this.$options.cardData.state) {
        const state = this.$options.cardData.state;
        console.log('state');
        console.log(state);
        if (state.text) textFilter = state.text;
        if (state.tags) allTags.map((tag) => {
          if (state.tags.indexOf(tag.id) !== -1) {
            tag.selected = true;
          }
        });
        if (state.results) allResults.map((result) => {
          if (state.results.indexOf(result.id) !== -1) {
            result.selected = true;
          }
        });
      }

      console.log(this.$options.cardData.data.session.name);

      return {
        data: this.$options.cardData.data,
        slugs: this.$options.cardData.urlsData,
        shortenedCardUrl: '',
        headerConfig: {
          circleIcon: 'og-list',
          heading: '&nbsp;',
          subheading: '7. sklic parlamenta',
          alternative: this.$options.cardData.cardData.altHeader === 'true',
          title: this.$options.cardData.data.session.name,
        },
        cardMethod: this.$options.cardData.cardData.method,
        cardGroup: this.$options.cardData.cardData.group,
        textFilter,
        votes,
        allTags,
        allResults,
      };
    },
    computed: {
      generatedCardUrl() {
        const state = {};

        if (this.selectedTags.length > 0) state.tags = this.selectedTags;
        if (this.textFilter.length > 0) state.text = this.textFilter;
        if (this.selectedResults.length > 0) state.results = this.selectedResults;

        return `https://glej.parlameter.si/${this.cardGroup}/${this.cardMethod}/${this.data.session.id}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
      },
      filteredVotes() {
        return this.getFilteredVotes();
      },
      tagPlaceholder() {
        return this.selectedTags.length > 0 ? `Izbranih: ${this.selectedTags.length}` : 'Izberi';
      },
      dropdownItems() {
        const validTags = [];

        this.votes.forEach((vote) => {
          vote.results.tags.forEach((tag) => {
            if (validTags.indexOf(tag) === -1) validTags.push(tag);
          });
        });
        return {
          tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
        }
      },
      selectedTags() {
        return this.allTags
          .filter(tag => tag.selected)
          .map(tag => tag.id);
      },
      selectedResults() {
        return this.allResults.filter(result => result.selected)
          .map(result => result.id);
      },
    },
    methods: {
      toggleResult(resultId) {
        const clickedResult = this.allResults.filter(result => result.id === resultId)[0];
        clickedResult.selected = !clickedResult.selected;
      },
      getFilteredVotes() {
        const filterVotes = (vote) => {
          const textMatch = this.textFilter === '' || vote.results.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
          const tagMatch = this.selectedTags.length === 0 || vote.results.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
          const resultMatch = this.selectedResults.length === 0 || this.selectedResults.indexOf(vote.results.result) > -1;

          return textMatch && tagMatch && resultMatch;
        }
        return this.votes.filter(filterVotes);
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
      console.log(this.generatedCardUrl);
      this.shortenUrl(this.generatedCardUrl);
    },
  };
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';

  .lightning-badge {
    background: $darkgrey;
    border-radius: 50%;
    height: 31px;
    left: 30px;
    position: absolute;
    top: -7px;
    width: 31px;
    background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/strela.svg");
    background-size: 11px 19px;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .fire-badge::before {
  background: $darkgrey;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  top: -7px;
  width: 31px;
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/ogenj.svg");
  background-size: 40px 40px;
  background-position: center center;
  background-repeat: no-repeat;
}

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
    padding: 12px 0 0 12px;

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

  .accepted.nay {
    color: #ff5e41;
  }

  .accepted.aye {}

  .session_voting .accepted {
    line-height: normal;
    height: 95px;
  }

  .session_voting .accepted p {
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);

    margin: 0;
    line-height: 30px;
    margin-top: 6px;
  }

  .session_voting .session_title {
    height: 95px;
    margin: 0;
    @include respond-to(mobile) {
      margin-top: 15px;
      margin-bottom: 10px;
    }
  }

  .session_voting .session_title p {
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-family: Roboto Slab;
    margin-top: 6px;
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
    .single_voting:hover {
      .border-left {
        border-top-color: #cadde6;
      }
    }

    .single_voting {
      padding-bottom: 15px;
    }
  }

  .single_voting {
    position: relative;
  }

  .session_voting .session_title p {
    font-size: 14px;
  }


  .session_voting .single_voting {
    margin-bottom: 15px;
  }

  .single_voting:hover {
    background-color: #e1f6ff;

    .border-left {
      border-left-color: #cadde6;
    }
  }

  .seja_anchor:hover {
    color: #525252;
  }

  .card-content-front {
    overflow-y: auto;
  }

  // filters
  .filters {
    padding-left: 12px;
    padding-bottom: 6px;
    @include respond-to(mobile) {
      flex-wrap: wrap;
      min-height: 154px;
    }
    $label-height: 26px;

    display: flex;

    .filter {
      padding-right: 10px;
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

    .text-filter {
      @include respond-to(desktop) { width: 26%; }
      @include respond-to(mobile) { width: 100%; }

      width: 26%; // 100%

      .text-filter-input {
        background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/search.svg');
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: right 9px center;
        border: 1px solid #c8c8c8;
        font-size: 16px;
        height: 51px;
        line-height: 27px;
        outline: none;
        padding: 12px 42px 12px 14px;
        width: 100%;
      }
    }

    .tag-dropdown {
      @include respond-to(desktop) { width: 26%; }

      width: 100%;
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
    .search-dropdown input {
      background-color: #ffffff;
    }

    .search-dropdown-input {
      padding-top: 11px;
      padding-bottom: 11px;
      background-color: #ffffff;
      line-height: 27px;
    }

    .search-dropdown-options {
      top: 50px;
    }
  }
</style>
