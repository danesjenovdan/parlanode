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

    <p-tabs>
      <p-tab label="Poslanci">
        <div class="results"></div>
        <empty-circle v-if="true" :text="emptyText" />
      </p-tab>
      <p-tab label="Poslanske skupine">
        <div class="results"></div>
        <empty-circle v-if="true" :text="emptyText" />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import EmptyCircle from 'components/EmptyCircle.vue';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';

export default {
  components: {
    EmptyCircle,
    PTab,
    PTabs,
  },
  mixins: [common],
  name: 'SkupineBesed',
  data() {
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      emptyText: 'Za prikaz rezultatov dodaj vsaj dve besedi.',
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

<style lang="scss" scoped>
.results {
  height: 400px;
}
</style>
