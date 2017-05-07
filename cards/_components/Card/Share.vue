<template>
  <div class="card-content-share hidden">
    <div class="card-back-content">
      <div class="share-content">
        <label for="share-url">Neposredna povezava do kartice</label>
        <input type="url" class="form-control share-url" id="share-url" :value="url"
        />
        <button class="btn-parlameter btn-full-width btn-blue">KOPIRAJ</button>
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
};
</script>
