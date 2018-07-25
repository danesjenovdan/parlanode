<template>
  <div class="card-content-share">
    <div class="card-back-content">
      <ul>
        <li v-for="prev in this.$root.$options.cardData.data.previous_versions" :key="prev.url">
          <a :href="prev.url" target="_blank" class="funblue-light-hover">{{ prev.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardPrevious',
};
</script>
