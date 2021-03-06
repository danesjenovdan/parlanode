<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Glasovanja o amandmajih objavljena na spletnem mestu <a href="http://www.dz-rs.si">DZ RS</a> imajo ime zapisano po vnaprej določeni strukturi:
      </p>
      <div class="info-text">
        <!-- eslint-disable-next-line max-len -->
        <pre>&#123;ime zakona&#125; - Amandma: &#123;K X. členu&#125; &#123;datum&#125; [&#123;kratica poslanske skupine&#125; - &#123;ime poslanske skupine&#125;]</pre>
      </div>
      <p class="info-text">
        Število amandmajev, ki jih vložila posamezna poslanska skupina dobimo tako, da preštejemo
        vsa glasovanja, v imenu katerih se pojavi beseda amandma. Med preštetimi glasovanji poiščemo
        tista, katerih ime vsebije kratico poslanske skupine. Ta amandma prištejemo k tej poslanski
        skupini.
      </p>
    </div>

    <p-tabs @switch="focusTab">
      <p-tab label="Št. članov PS">
        <bar-chart :data="seatCountData" show-numbers />
      </p-tab>
      <p-tab label="Št. vloženih amandmajev">
        <bar-chart :data="amandmajiData" show-numbers />
      </p-tab>
      <p-tab label="Št. vloženih amandmajev na poslanca">
        <bar-chart :data="amandmajiNaPoslancaData" show-numbers />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import BarChart from 'components/BarChart.vue';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';

export default {
  name: 'ObcasnikAmandmaji',
  components: {
    BarChart,
    PTab,
    PTabs,
  },
  mixins: [common],
  data() {
    return {
      data: this.$options.cardData.data.data,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
      generatedCardUrl: `${this.url}?customUrl=https%3A%2F%2Fcdn.parlameter.si%2Fv1%2Fdata%2Famandmaji.json`,
    };
  },
  computed: {
    seatCountData() {
      return this.data.map(row => ({
        label: row.party.acronym,
        value: row.results.seat_count,
      }));
    },
    amandmajiData() {
      return this.data.map(row => ({
        label: row.party.acronym,
        value: row.results.amandmaji,
      }));
    },
    amandmajiNaPoslancaData() {
      return this.data.map(row => ({
        label: row.party.acronym,
        value: row.results.amandmaji_na_poslanca,
      }));
    },
  },
  methods: {
    focusTab() {
      return true;
    },
  },
};
</script>
