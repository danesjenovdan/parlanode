<template>
  <div class="card-footer">
    <div class="card-logo hidden">
      <a :href="slugs.base">
        <img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo">
      </a>
    </div>

    <div class="card-circle-button card-share" data-back="share"></div>
    <div class="card-circle-button card-embed" data-back="embed"></div>
    <div class="card-circle-button card-info" data-back="info">i</div>
  </div>
</template>

<script>
import slugs from '../../../assets/urls.json';

export default {
  name: 'CardFooter',
  data() {
    return { slugs };
  },
};
</script>
