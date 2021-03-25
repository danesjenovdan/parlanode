<template>
  <div class="card-content-share">
    <div class="card-back-content">
      <ul>
        <li v-for="prev in previous" :key="prev.url">
          <a :href="prev.url" target="_blank" class="funblue-light-hover">{{
            prev.title
          }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardPrevious',
  data() {
    const { cardData } = this.$root.$options;
    return {
      previous: (cardData.data && cardData.data.previous_versions) || [],
    };
  },
};
</script>
