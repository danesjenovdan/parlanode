<template>
  <div class="card-content-share">
    <div class="card-back-content">
      <div class="share-content">
        <label for="share-url">Neposredna povezava do kartice</label>
        <input type="url" class="form-control share-url" id="share-url" :value="shortenedUrl" ref="urlInput" />
        <button class="btn-parlameter btn-full-width btn-blue" @click="copyLink" ref="copyButton">KOPIRAJ</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardShare',

  data: () => ({
    shortenedUrl: '',
  }),

  props: {
    url: String,
  },

  methods: {
    shortenUrl() {
      return new Promise(() => {
        $.get(`https://parla.me/shortner/generate?url=${encodeURIComponent(`${this.url}&frame=true`)}`, (response) => {
          this.$refs.copyButton.textContent = 'KOPIRAJ';
          this.shortenedUrl = response;
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
          succeed = document.execCommand("copy");
      } catch (e) {
          return e;
      }

      // change text
      if (succeed) {
        this.$refs.copyButton.textContent = "SKOPIRANO!";
      }
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
