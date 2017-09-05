<template>
  <card-wrapper
    class="card-clani-poslanske-skupine"
    content-class="full"
    :id="$options.cardData.cardData._id"
    :card-url="url"
    :header-config="headerConfig">
    <div slot="info">
      <p class="info-text lead">Seznam vseh članov poslanske skupine.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Imena ter slike poslancev, ki predstavljajo posamezno poslansko skupino, črpamo s <a href="http://www.dz-rs.si/wps/portal/Home/ODrzavnemZboru/KdoJeKdo/PoslanskeSkupine" class="funblue-light-hover">spletnega mesta DZ</a>. Prikazani so samo trenutno aktivni poslanci.
      </p>
    </div>

    <person-list class="person-list" :people="data.results" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import PersonList from 'components/PersonList.vue';

export default {
  components: { PersonList },
  mixins: [common],
  name: 'ClaniPoslanskeSkupine',
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
    };
  },
};
</script>

<style lang="scss" scoped>
.person-list {
  max-height: 100%;
  overflow-y: auto;
}
</style>
