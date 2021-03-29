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

export default {
  name: 'CardShare',
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      shortenedUrl: `${this.url}&frame=true`,
      copied: false,
    };
  },
  watch: {
    url() {
      this.shortenUrl();
    },
  },
  mounted() {
    this.shortenUrl();
  },
  methods: {
    shortenUrl() {
      axios
        .get(
          `https://parla.me/shortner/generate?url=${encodeURIComponent(
            `${this.url}&frame=true`
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
      // set focus
      this.$refs.urlInput.focus();

      // copy the selection
      this.$refs.urlInput.setSelectionRange(
        0,
        this.$refs.urlInput.value.length
      );
      let succeed = false;
      try {
        succeed = document.execCommand('copy');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('failed to copy to cliboard', e);
        return;
      }

      // change text
      this.copied = succeed;
    },
  },
};
</script>
