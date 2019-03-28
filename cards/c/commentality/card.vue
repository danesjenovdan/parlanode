<template>
  <transparent-wrapper
    :id="`${$options.cardData.cardData._id}`"
    :card-url="url"
  >
    <iframe
      :src="`https://frontmentality.djnd.si/embed.html#id=${articleId}`"
      width="100%"
      height="800px"
      style="border: none;"
    ></iframe>
  </transparent-wrapper>
</template>

<script>
import axios from 'axios';
import common from 'mixins/common';
import TransparentWrapper from 'components/TransparentWrapper.vue';
import links from 'mixins/links';

export default {
  name: 'Search',
  components: {
    TransparentWrapper,
  },
  mixins: [
    common,
    links,
  ],
  data() {
    return {
      articleId: '',
    };
  },
  created() {
    // this.articleId = this.$options.cardData.parlaState.articleId;
    console.log('created');
    const { cardGlobals } = this.$root.$options.cardData;
    const { EPA } = this.$root.$options.cardData.parlaState
    console.log(cardGlobals, EPA);
    console.log(`${cardGlobals.commentalityAPI}/api/v2/articles/by_title/${EPA}`);
    axios.get(`${cardGlobals.commentalityAPI}/api/v2/articles/by_title/${EPA}`).then((response) => {
      console.log(response);
      this.articleId = response.data.uid;
    });
  },
  computed: {
    allItems() {
      return this.people.concat(this.parties);
    },
  },
};
</script>

<style lang="scss">
@import "~parlassets/scss/colors";

iframe {
  .wrapper {
    background: none;
    box-shadow: none;
    border: 2px solid $tools-border;
  }
}
</style>
