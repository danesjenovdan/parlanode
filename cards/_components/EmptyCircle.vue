<template>
  <div class="empty">
    <div class="circle">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'EmptyCircle',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.empty {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  .circle {
    $size: 220px;
    background-image: url('https://cdn.parlameter.si/v1/parlassets/img/icons/primerjalnik-empty-no-text.png');
    background-size: $size;
    font-size: 17px;
    font-family: 'Roboto Slab', 'Times New Roman', Times, serif;
    font-style: italic;
    font-weight: 300;
    height: $size;
    left: calc(50% - #{$size / 2});
    line-height: 19px;
    padding: 125px 26px 0;
    position: absolute;
    text-align: center;
    top: calc(50% - #{$size / 2});
    width: $size;
  }
}
</style>
