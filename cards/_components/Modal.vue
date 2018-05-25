<template>
  <div class="card-modal">
    <div class="card-modal-header">
      {{ header }}
      <div
        class="closeme"
        @click="$emit('close')"
      />
    </div>
    <div class="card-modal-content">
      <slot />
      <div
        class="card-modal-button"
        @click="$emit('ok')"
      >
        {{ button }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    header: {
      type: String,
      required: true,
    },
    button: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';
@import '~parlassets/scss/helper';

.card-modal {
  position: absolute;
  width: 280px;
  left: 50%;
  margin-left: -120px;
  top: 100px;
  z-index: 100;
  background-color: #F0F5F8;

  @include card(2);

  &-button {
    width: 100%;
    line-height: 40px;
    font-size: 16px;
    color: #ffffff;
    background-color: $funblue;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;
    text-transform: uppercase;

    &:hover {
      opacity: 0.7;
    }
  }

  &-header {
    width: 100%;
    background-color: $funblue;
    color: #ffffff;
    font-family: 'Roboto Slab', serif;
    padding: 10px 50px 10px 10px;

    .closeme {
      display: block;
      position: absolute;
      right: 10px;
      top: -1px;
      font-size: 40px;
      cursor: pointer;

      &::before {
        content: '×';
      }
    }
  }

  &-content { padding: 10px; }
}
</style>
