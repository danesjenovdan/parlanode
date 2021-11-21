<template>
  <div class="card-content-share">
    <div class="card-back-content">
      <div class="share-content">
        <label v-t="'share.direct-link'" for="share-url"></label>
        <input
          id="share-url"
          ref="urlInput"
          :value="shortenedUrl"
          type="url"
          class="form-control share-url"
        />
        <button
          class="btn-parlameter btn-full-width btn-blue"
          @click="copyLink"
        >
          <span v-if="copied" v-t="'copied'"></span>
          <span v-else v-t="'copy'"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import copyInput from '@/_helpers/copyInput.js';

export default {
  name: 'CardShare',
  props: {
    analysis: {
      type: String,
      default: null,
    }
  },
  data() {
    // Get card url from a parent with common mixin which defines a computed url property
    let url;
    let parent = this.$parent;
    while (parent) {
      if (parent.url) {
        url = parent.url;
        break;
      }
      parent = parent.$parent;
    }
    // set analysis if it is selected
    url = `${url}&locale=${this.$i18n.locale}&template=share&analysis=${this.analysis}`;
    return {
      url,
      copied: false,
      shortenedUrl: url,
    };
  },
  mounted() {
    this.shortenUrl();
  },
  methods: {
    shortenUrl() {
      axios
        .get(
          `https://parla.me/shortner/generate?url=${encodeURIComponent(
            this.url
          )}`
        )
        .then((response) => {
          this.shortenedUrl = response.data;
          this.copied = false;
          this.$nextTick(() => {
            this.$refs.urlInput.select();
          });
        });
    },
    copyLink() {
      this.copied = copyInput(this.$refs.urlInput);
    },
  },
};
</script>
