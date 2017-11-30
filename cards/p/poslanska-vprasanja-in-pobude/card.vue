<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    content-class="full"
    :card-url="url"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Pregled osnovnih informacij poslanske skupine.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Vsebine za to kartico smo pridobili s spletnega mesta DZ RS (poslanska skupina, starost, članstva v delovnih telesih) in s spletnega mesta DVK (število prejetih glasov). Za ostale vsebine smo se obrnili na PR službe poslanskih skupin. Podatke so nam posredovali iz NSi, SD, (takrat še) ZaAB in ZL. SMC so nas usmerili na svoje spletno mesto, SDS pa na spletno mesto državnega zbora. Manjkajoče podatke smo pridobili s pomočjo iskalnika Google in jih za morebitne popravke pred objavo ponudili vsem poslanskim skupinam.</p>
    </div>

    <question-list :questionDays="data.results" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { memberOverview } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';
import QuestionList from 'components/QuestionList.vue';

export default {
  name: 'PoslanskaVprasanjaInPobudePoslanca',
  mixins: [common, memberOverview, memberTitle],
  components: { QuestionList },
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
