<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="url"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Povzetek <span v-if="data.classification==='zakon'">zakona</span><span v-else>akta</span> in rezultati vseh z njim povezanih glasovanj.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Iz <a class="funblue-light-hover" href="https://www.dz-rs.si">www.dz-rs.si</a> naložimo glasovanja, ki so večinoma opremljena z EPA številkami. Glasovanja, ki imajo isto EPA številko, združimo pod zakonom ali aktom, ki mu številka pripada. Kartico opremimo še s povzetkom zakona, ki ga pripravimo sami.</p>
    </div>

    <!-- Card content goes here -->
    <p-tabs :start-tab="0">
      <p-tab label="Izvleček" variant="light">
        <excerpt
          :content="content"
          :main-law="{ epa: data.epa || '', name: data.text || '', link: `https://parlameter.si/zakonodaja/${data.epa}` }"
          :documents="documents"
          :show-parent="false"
        />
      </p-tab>
      <p-tab label="Glasovanja">
        <seznam-glasovanj
          :data="data"
        >
        </seznam-glasovanj>
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import Excerpt from 'components/Excerpt.vue';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';

export default {
  components: { PTab, PTabs, Excerpt, SeznamGlasovanj },
  mixins: [common],
  name: 'Zakon',
  data() {
    const documents = this.$options.cardData.data.votes.reduce((prev, cur) => {
      cur.documents.forEach((document) => { // TODO fix after data is fixed
        prev.push(document);
      });
      console.log(prev, cur);
      return prev;
    }, []);
    const title = this.$options.cardData.parlaState.fullName
      ? this.$options.cardData.data.text.slice(0, 100) + '...'
      : 'Zakon';
    return {
      data: this.$options.cardData.data,
      documents,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title,
      },
    };
  },
  computed: {
    content() {  
      if (this.data.abstract) {
        return this.data.abstract.replace(/style=.*?>/g, '>').replace(/<p>&nbsp;<\/p>/g, '');
      }
      return '';
    },
  },
  methods: {
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
};
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
#s-zakon {
  .card-content {
    height: 518px;
  }
  .filters {
    margin-top: 10px;
  }
  #votingCard {
    max-height: 372px;
  }
}
</style>
