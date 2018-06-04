<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">Pregled vseh glasovanj, ki so se zgodila na seji</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Za vsa glasovanja na posamezni seji preštejemo vse glasove (ZA, PROTI, VZDRŽAN/-A) in število poslancev, ki niso glasovali, ter izpišemo rezultate.</p>
      <p class="info-text">Nabor glasovanj pridobimo s spletnega mesta <a href="http://www.dz-rs.si">DZ RS</a>.</p>
      <p class="info-text">Za označevanje nepričakovanih rezultatov glasovanj uporabljamo probabilistično metodo analize glavnih komponent, <a href="http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html">kot je implementirana v knjižicah scikit-learn</a> in opisana v <a href="http://www.miketipping.com/papers/met-mppca.pdf">M. Tipping and C. Bishop, Probabilistic Principal Component Analysis, Journal of the Royal Statistical Society, Series B, 61, Part 3, pp. 611-622</a>.</p>
      <p class="info-text">Vsa glasovanja pretvorimo v štiridimenzionalne vektorje, kjer vsaka od komponent pomeni število oddanih glasovnic s specifičnim glasom (ZA, PROTI, NI, VZDRŽAN). PCA model prilagodimo matriki in s funkcijo <a href="https://github.com/scikit-learn/scikit-learn/blob/14031f6/sklearn/decomposition/pca.py#L485">score_samples</a> pridobimo "log-likelihood" vsakega glasovanja v našem modelu. Model deluje tako, da skuša pri prilagajanju "log-likelihood" vrednost maksimizirati za čim več glasovanj. Ko smo pridobili vse "log-likelihood" vrednosti jih razvrstimo od najmanjše proti največji in uporabimo četrtino vseh glasovanj, ki se modelu najslabše prilegajo. Ker v primerjavi z našim modelom ta glasovanja najbolj izstopajo, so kot taka najbolj "nepričakovana." V kartici jih označimo z ikono ognja.</p>
    </div>

    <seznam-glasovanj :data="votes" :filters="filters" @filters-changed="onFiltersChanged" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';

export default {
  mixins: [
    common,
  ],
  components: {
    SeznamGlasovanj,
  },
  name: 'GlasovanjaSeja',
  created() {
    this.$options.cardData.template.contextUrl =
      `${this.slugs.base}/seja/glasovanja/${this.data.session.id}`;
    this.$options.cardData.template.pageTitle =
      `Druga glasovanja - ${this.$options.cardData.data.session.name}`;
  },
  data() {
    const state = this.$options.cardData.parlaState;
    const text = state && state.text ? state.text : '';
    const tags = state && state.tags ? state.tags : [];
    const results = state && state.results ? state.results : [];

    const sessionName = this.$options.cardData.data.session.name;
    let imageName = 'seja-redna';
    if (sessionName.indexOf('izredna') !== -1) {
      imageName = 'seja-izredna';
    } else if (sessionName.indexOf('nujna') !== -1) {
      imageName = 'seja-nujna';
    }
    return {
      data: this.$options.cardData.data,
      filters: {
        text,
        tags,
        results,
      },
      headerConfig: {
        mediaImage: imageName,
        heading: this.$options.cardData.data.session.name,
        subheading: this.$options.cardData.data.session.date,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    generatedCardUrl() {
      const state = {};

      if (this.filters.text) {
        state.text = this.filters.text;
      }
      if (this.filters.tags.length) {
        state.tags = this.filters.tags;
      }
      if (this.filters.results.length) {
        state.results = this.filters.results;
      }
      if (this.$options.cardData.parlaState && this.$options.cardData.parlaState.onlyOther) {
        state.onlyOther = true;
      }

      return `${this.url}${this.data.session.id}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    votes() {
      let votes = this.data.results.map(v => v.results);
      if (this.$options.cardData.parlaState && this.$options.cardData.parlaState.onlyOther) {
        votes = votes.filter(vote => !vote.epa);
      }
      return {
        votes,
        session: this.data.session,
        tags: this.data.tags,
      };
    },
  },
  methods: {
    onFiltersChanged(newFilters) {
      this.filters = newFilters;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
