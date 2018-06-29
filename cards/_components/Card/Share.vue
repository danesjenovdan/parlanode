<template>
  <div class="card-content-share">
    <div class="card-back-content">
      <div class="share-content">
        <label v-t="'share.direct-link'" for="share-url"></label>
        <input id="share-url" ref="urlInput" :value="shortenedUrl" type="url" class="form-control share-url">
        <button class="btn-parlameter btn-full-width btn-blue" @click="copyLink">
          <span v-t="'copied'" v-if="copied"></span>
          <span v-t="'copy'" v-else></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardShare',

  props: {
    url: String,
  },

  data: () => ({
    shortenedUrl: '',
    copied: false,
  }),

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
      return new Promise(() => {
        $.get(`https://parla.me/shortner/generate?url=${encodeURIComponent(`${this.url}&frame=true`)}`, (response) => {
          this.shortenedUrl = response;
          this.copied = false;
          this.$nextTick(() => {
            this.$refs.urlInput.select();
          });
        });
      });
    },

    copyLink() {
      // set focus
      this.$refs.urlInput.focus();

      // copy the selection
      this.$refs.urlInput.setSelectionRange(0, this.$refs.urlInput.value.length);
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
