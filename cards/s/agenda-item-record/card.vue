<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    class="card-halfling card-seznam-zakonov"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <div v-html="data.content.split('\n').map(l => `<p>${l}</p>`).join('\n')" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';

export default {
  name: 'AgendaItemCard',
  components: {
  },
  mixins: [
    common,
  ],
  data() {
    const data = this.$options.cardData.data;
    return {
      data,
      headerConfig: defaultHeaderConfig(this, {
        title: data.agenda_item_title,
      }),
      ogConfig: defaultOgImage(this),
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.id}?altHeader=true`;
    },
  },
};
</script>

<style lang="scss">
</style>
