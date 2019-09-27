<template>
  <transparent-wrapper
    :id="`${$options.cardData.mountId}`"
    :card-url="url"
  >
    <iframe
      v-if="articleId !== ''"
      :src="`https://frontmentality.djnd.si/parlaembed.html#id=${articleId}`"
      width="100%"
      style="border: none;"
      id="parlameter-commentality-embed"
      @load="iframeLoaded"
    ></iframe>
  </transparent-wrapper>
</template>

<script>
import axios from 'axios';
import common from 'mixins/common';
import TransparentWrapper from 'components/TransparentWrapper.vue';
import links from 'mixins/links';
import iFrameResize from 'iframe-resizer/js/iframeResizer';

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
  methods: {
    iframeLoaded () {
      iFrameResize({log: false}, '#parlameter-commentality-embed');
      console.log('ping');
    }
  },
};
</script>

<style lang="scss">
@import "~parlassets/scss/colors";

#c-commentality .card-content {
  padding: 0 !important;
}

iframe {
  .wrapper {
    background: none;
    box-shadow: none;
    border: 2px solid $tools-border;
  }
}
</style>
