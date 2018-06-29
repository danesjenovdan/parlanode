<template>
  <div class="card-content__empty">
    <div class="card-content__empty-inner">
      <img src="//cdn.parlameter.si/v1/parlassets/img/icons/no-data.svg" />
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
};
</script>
