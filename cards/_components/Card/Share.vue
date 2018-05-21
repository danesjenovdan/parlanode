<template>
  <div class="card-content-share">
    <div class="card-back-content">
      <div class="share-content">
        <label for="share-url">{{ $t('share.direct-link') }}</label>
        <input type="url" class="form-control share-url" id="share-url" :value="shortenedUrl" ref="urlInput" />
        <button class="btn-parlameter btn-full-width btn-blue" @click="copyLink">{{ copied ? $t('copied') : $t('copy') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardShare',

  data: () => ({
    shortenedUrl: '',
    copied: false,
  }),

  props: {
    url: String,
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
        return e;
      }

      // change text
      this.copied = succeed;
    },
  },

  watch: {
    url() {
      this.shortenUrl();
    },
  },

  mounted() {
    this.shortenUrl();
  },
};
</script>
