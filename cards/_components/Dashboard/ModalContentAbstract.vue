<template>
  <div>
    <div>
      <input
        v-model="loadedData.abstractVisible"
        :id="`abstractVisible-${loadedData.id}`"
        type="checkbox"
        class="checkbox"
      >
      <label v-t="'show'" :for="`abstractVisible-${loadedData.id}`"></label>
    </div>
    <textarea v-model="loadedData.note" class="form-control"></textarea>
  </div>
</template>

<script>
export default {
  name: 'DashboardModalContentAbstract',
  props: {
    loadedData: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  min-height: 400px;
  resize: horizontal;
}
</style>
