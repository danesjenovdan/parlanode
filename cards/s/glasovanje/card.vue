<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Nabor glasovanj pridobimo s spletnega mesta DZ RS.</p>
      <p class="info-text">Rezultat posameznega glasovanja ima tri različne izpise: na nivoju poslancev, na nivoju poslanskih skupin ter glede na stran vlade.</p>
      <div class="info-text">
        <ul>
          <li>Prvi zavihek omogoča pregled glasov poslancev, filtriranje glede na vrednost glasovnice (ZA, PROTI, VZDRŽAN/-A, NI GLASOVAL/-A) ter iskanje posameznih poslancev. Poleg krožnega grafikona se izpisuje večinski glas DZ na tem glasovanju. "60% ZA" npr. pomeni, da je ZA glasovalo 60 od 90 poslancev.</li>
          <li>Drugi zavihek prikaže glasove poslanskih skupin. Na koncu vsake vrstice je izpisan večinski glas poslanske skupine, gumbi z vrednostmi glasovnic pa odpirajo sezname poslancev, ki so oddali tak glas. S strelo opozarjamo na razkole v poslanskih skupinah - izrišemo jo nad tistimi glasovi, ki niso enaki večinskemu, pri čemer so odsotni izvzeti. Če je bila večina poslancev poslanske skupine odsotnih, večinskega glasu ni.</li>
          <li>Tretji zavihek rezultat izpiše glede na stran vlade. Tudi tu s strelo opozarjamo na nepričakovane glasove - označujemo odstopanje od večinskega glasu koalicije.</li>
        </ul>
      </div>
      <p class="info-text heading">OZNAČEVANJE S STRELO</p>
      <p class="info-text">S strelo opozarjamo na razkole v poslanskih skupinah oziroma v koaliciji - izrišemo jo nad tistimi glasovanji,  ki vsebujejo glasove, ki niso enaki večinskemu glasu poslanske skupine / koalicije, pri čemer so odsotni glasovi izvzeti. Če je bila večina poslancev poslanske skupine odsotnih, večinskega glasu ni.</p>
      <p class="info-text heading">OZNAČEVANJE S PLAMENOM</p>
      <p class="info-text">Za označevanje nepričakovanih rezultatov glasovanj uporabljamo probabilistično metodo analize glavnih komponent, <a href="http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html">kot je implementirana v knjižicah scikit-learn</a> in opisana v <a href="http://www.miketipping.com/papers/met-mppca.pdf">M. Tipping and C. Bishop, Probabilistic Principal Component Analysis.</a></p>
      <p class="info-text">Vsa glasovanja pretvorimo v štiridimenzionalne vektorje, kjer vsaka od komponent pomeni število oddanih glasovnic s specifičnim glasom (ZA, PROTI, NI, VZDRŽAN). PCA model prilagodimo matriki in s funkcijo <a href="https://github.com/scikit-learn/scikit-learn/blob/14031f6/sklearn/decomposition/pca.py#L485">score_samples</a> pridobimo "log-likelihood" vsakega glasovanja v našem modelu. Model deluje tako, da skuša pri prilagajanju "log-likelihood" vrednost maksimizirati za čim več glasovanj. Ko smo pridobili vse "log-likelihood" vrednosti jih razvrstimo od najmanjše proti največji in uporabimo četrtino vseh glasovanj, ki se modelu najslabše prilegajo. Ker v primerjavi z našim modelom ta glasovanja najbolj izstopajo, so kot taka najbolj "nepričakovana." V kartici jih označimo z ikono ognja.</p>
    </div>

    <div :class="['summary', { 'fire-badge': data.result.is_outlier }]">
      <div class="result">
        <template v-if="data.result.accepted">
          <i class="accepted glyphicon glyphicon-ok"></i>
          <div class="text">sprejet</div>
        </template>
        <template v-else>
          <i class="not-accepted glyphicon glyphicon-remove"></i>
          <div class="text">zavrnjen</div>
        </template>
      </div>
      <div class="name">{{ data.name }}</div>
      <!-- <div v-if="data.documents.length > 0" class="documents">
        <div class="dropdown-label">Dokumenti</div>
        <p-search-dropdown
          single
          small
          :items="mappedDocuments"
          placeholder="Izberi dokument"
          :select-callback="openDocument"
        />
      </div> -->
    </div>
    <!-- TODO please return excerpt -->
    <!-- <div class="izvlecek-switch visible-xs" @click="showMobileExcerpt = !showMobileExcerpt">Izvleček</div>
    <excerpt
      :content="data.abstract.replace(/style=.*?>/g, '>').replace(/<p>&nbsp;<\/p>/g, '')"
      :main-law="{ epa: data.legislation.epa, name: data.legislation.text }"
      :documents="data.documents"
      class="visible-xs"
      v-if="showMobileExcerpt"
    /> -->
    <p-tabs @switch="focusTab" :start-tab="selectedTab" class="visible-xs">
      <p-tab label="Poslanci">
        <poslanci
          :members="data.members"
          :member-votes="data.all"
          :result="data.result"
          :state="state"
        />
      </p-tab>
      <p-tab label="Poslanske skupine">
        <poslanske-skupine
          ref="parties"
          :members="data.members"
          :parties="data.parties"
          :state="state"
          :selectedParty="state.selectedParty || null"
          :selectedOption="state.selectedOption || null"
        />
      </p-tab>
      <p-tab label="Stran vlade">
        <poslanske-skupine
          ref="sides"
          :members="data.members"
          :parties="coalitionOpositionParties"
          :state="state"
          :selectedParty="state.selectedParty || null"
          :selectedOption="state.selectedOption || null"
        />
      </p-tab>
    </p-tabs>
    <p-tabs @switch="focusTab" :start-tab="selectedTab" class="hidden-xs">
      <!-- <p-tab label="Izvleček" variant="light" v-if="data.abstractVisible">
        <excerpt
          :content="data.abstract.replace(/style=.*?>/g, '>').replace(/<p>&nbsp;<\/p>/g, '')"
          :main-law="{ epa: data.legislation.epa, name: data.legislation.text }"
          :documents="data.documents"
        />
      </p-tab> -->
      <p-tab label="Poslanci">
        <poslanci
          :members="data.members"
          :member-votes="data.all"
          :result="data.result"
          :state="state"
        />
      </p-tab>
      <p-tab label="Poslanske skupine">
        <poslanske-skupine
          ref="parties"
          :members="data.members"
          :parties="data.parties"
          :state="state"
          :selectedParty="state.selectedParty || null"
          :selectedOption="state.selectedOption || null"
        />
      </p-tab>
      <p-tab label="Stran vlade">
        <poslanske-skupine
          ref="sides"
          :members="data.members"
          :parties="coalitionOpositionParties"
          :state="state"
          :selectedParty="state.selectedParty || null"
          :selectedOption="state.selectedOption || null"
        />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import { pick } from 'lodash';
import common from 'mixins/common';
import PSearchDropdown from 'components/SearchDropdown.vue';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import Excerpt from 'components/Excerpt.vue';
import Poslanci from './Poslanci.vue';
import PoslanskeSkupine from './PoslanskeSkupine.vue';

export default {
// puščam not develop verzijo, tukaj je verzija glasovanje-update za lažji debugging, če bo potreben
  // components: {
    // Excerpt,
    // Poslanci,
    // PoslanskeSkupine,
    // PTab,
    // PTabs,
  // },
  components: { Poslanci, PoslanskeSkupine, PSearchDropdown, PTab, PTabs, Excerpt },
  mixins: [common],
  name: 'GlasovanjeSeje',
  data() {
    console.log(this.$options.cardData);
    return {
      showMobileExcerpt: false,
      data: this.$options.cardData.data,
      state: this.$options.cardData.parlaState,
      selectedTab: this.$options.cardData.parlaState.selectedTab || 0,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      coalitionOpositionParties: ['coalition', 'opposition'].map(side => ({
        party: {
          id: side,
          name: side === 'coalition' ? 'KOALICIJA' : 'OPOZICIJA',
        },
        votes: pick(this.$options.cardData.data.gov_side[side].votes, ['abstain', 'for', 'against', 'not_present']),
        max: {
          maxOptPerc: this.$options.cardData.data.gov_side[side].max.maxOptPerc,
          max_opt: this.$options.cardData.data.gov_side[side].max.max_opt,
        },
        outliers: this.$options.cardData.data.gov_side[side].outliers,
      })),
    };
  },
  computed: {
    generatedCardUrl() {
      return `https://glej.parlameter.si/s/glasovanje/${this.data.id}?state={}`;
    },
  },
  methods: {
    focusTab(tabNumber) {
      if (tabNumber !== 1) {
        this.$refs.parties.expandedParty = null;
        this.$refs.parties.expandedOption = null;
      }
      if (tabNumber !== 2) {
        this.$refs.sides.expandedParty = null;
        this.$refs.sides.expandedOption = null;
      }
      if (this.state.selectedTab === 1) {
        this.$refs.sides.expandedParty = this.state.selectedGroup || null;
        this.$refs.sides.expandedOption = this.state.selectedOption || null;
      }
      if (this.state.selectedTab === 2) {
        this.$refs.sides.expandedParty = this.state.selectedGroup || null;
        this.$refs.sides.expandedOption = this.state.selectedOption || null;
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
    },
  },
// glasovanje-update je bilo prazno, created() je iz developa
  created() {
    this.$options.cardData.template.contextUrl =
      `${this.slugs.base}/seja/glasovanje/${this.data.session.id}/${this.data.id}`;
  },
  mounted() {
    this.$on('selectedoption', (newSelectedOption) => {
      this.state.selectedOption = newSelectedOption;
    });
    this.$on('selectedparty', (newSelectedParty) => {
      this.state.selectedParty = newSelectedParty;
    });

    // this.$emit('selectedoption', 'for');
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.summary {
  $section-border: 1px solid $black;
  background: $grey;
  margin: 7px 0 8px 0;
  min-height: 90px;
  padding: 10px 14px;
  position: relative;

  @include respond-to(desktop) {
    display: flex;
    margin-bottom: 24px;
  }

  .result {
    align-items: center;
    border-bottom: $section-border;
    display: flex;
    justify-content: center;
    padding: 0 0 10px 0;

    @include respond-to(desktop) {
      border-bottom: none;
      border-right: $section-border;
      padding: 0 22px 0 0;
    }

    .glyphicon {
      font-size: 24px;
      margin-bottom: 4px;
      &.accepted { color: $funblue; }
      &.not-accepted { color: $red; }

      @include respond-to(desktop) { font-size: 29px; }
    }

    .text {
      color: #333;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: 12px;
    }
  }

  .name {
    font-family: Roboto Slab, Times New Roman, serif;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.45em;
    padding: 10px 0 4px 0;

    @include respond-to(desktop) {
      align-items: center;
      display: flex;
      flex: 4;
      font-size: 14px;
      padding: 5px 0 5px 12px;
    }
  }

  .documents {
    border-top: $section-border;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 6px 0 0 0;

    @include respond-to(desktop) {
      border-left: $section-border;
      border-top: none;
      flex: 2;
      margin: 0 0 0 12px;
      min-width: 204px;
      padding-left: 16px;
    }

    .dropdown-label {
      @include show-for(desktop);
      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 14px;
      font-weight: 300;
      line-height: 21px;
      margin-bottom: 5px;
    }

    .p- {
      margin: 10px -2px 3px -2px;
      @include respond-to(desktop) { margin: 0; }
    }
  }
}

.tabs .tab-content { overflow: hidden; }
</style>

<style lang="scss">
@import '~parlassets/scss/colors';

.lightning-badge::before {
  background: $darkgrey;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  bottom: -6px;
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

.izvlecek-switch {
  width: 100%;
  height: 40px;
  line-height: 20px;
  padding: 10px;
  text-align: center;
  text-transform: uppercase;
  background: $grey-medium;
  margin-bottom: 10px;
}
</style>
