<template>
  <div class="card-content-share hidden">
    <div class="card-back-content">
      <div class="share-content">
        <label for="share-url">Neposredna povezava do kartice</label>
        <input type="url" class="form-control share-url" id="share-url" :value="shortenedUrl" />
        <button class="btn-parlameter btn-full-width btn-blue">KOPIRAJ</button>
      </div>
    </div>
  </div>
</template>

<script>
/* globals $ */

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
        $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${this.url}&frame=true`)}`, (response) => {
          this.$el.querySelector('.card-content-share button').textContent = 'KOPIRAJ';
          this.shortenedUrl = response;
        });
      });
    },
  },
  watch: {
    url() {
      this.shortenUrl();
    },
  },
  created() {
    this.shortenUrl();
  },
};
</script>
