<template>
  <div class="card-content__empty">
    <div class="card-content__empty-inner">
      <img :src="`${slugs.urls.cdn}/img/icons/no-data.svg`">
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardEmpty',
  props: {
    text: {
      type: String,
      default: 'Podatki trenutno niso na voljo.',
    },
  },
  data() {
    return {
      slugs: this.$root.$options.cardData.urls,
    };
  },
};
</script>
