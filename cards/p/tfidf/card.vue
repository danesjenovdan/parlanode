<template>
  <card-wrapper
    class="card-halfling card-tfidf-poslanca"
    :id="$options.cardData.cardData._id"
    :card-url="url"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Izpis 10 besed in besednih zvez, ki jih {{ vocabulary.poslanec[gender] }} uporablja pogosteje kot ostali poslanci v DZ.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Analizo izvajamo po statistiki <a href="https://en.wikipedia.org/wiki/Tf-idf">tf-idf</a>.</p>
      <p class="info-text">Korpus predstavljajo vsi govori, dokument pa vsi {{ vocabulary.poslanca3[gender] }} govori.</p>
    </div>

    <word-list :items="data.results" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import WordList from 'components/WordList.vue';

export default {
  components: { WordList },
  mixins: [common],
  name: 'ImeKartice',
  data() {
    const { gender } = this.$options.cardData.data.person;

    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: `Besede, ki ${gender === 'm' ? 'ga' : 'jo'} zaznamujejo`,
      },
      gender,
    };
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
