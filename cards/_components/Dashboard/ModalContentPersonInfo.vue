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
    <vue-pell-editor
      v-model="loadedData.note"
      :actions="editorOptions"
      default-paragraph-separator="p"
      @change="onEditorChange"
    />
  </div>
</template>

<script>
export default {
  name: 'DashboardModalContentPersonInfo',
  props: {
    loadedData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onEditorChange({ editor }) {
      const content = editor.querySelector('.pell-content');
      let nested;
      // eslint-disable-next-line no-cond-assign
      while ((nested = content.querySelector('p > p, p > ul, ul > p')) != null) {
        content.insertBefore(nested, nested.parentElement);
      }

      let children = content.childNodes;
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (child.nodeType === 3 || child.tagName === 'BR') {
          const p = document.createElement('p');
          content.insertBefore(p, child);
          p.appendChild(child);
        }
      }

      children = content.childNodes;
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (!child.innerHTML || !child.innerHTML.trim()) {
          content.removeChild(child);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
