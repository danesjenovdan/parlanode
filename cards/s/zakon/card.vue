<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="url"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <!-- Card content goes here -->
    <p-tabs :start-tab="0">
      <p-tab label="Izvleček" variant="light">
        <excerpt
          :content="content"
          :main-law="{ epa: '', name: '' }"
          :documents="documents"
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
    return {
      data: this.$options.cardData.data,
      documents,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.data.text, // this.$options.cardData.cardData.name,
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
