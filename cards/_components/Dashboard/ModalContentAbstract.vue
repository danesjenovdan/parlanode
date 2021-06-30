<template>
  <div>
    <div>
      <input
        :id="`abstractVisible-${loadedData.id}`"
        v-model="loadedData.abstractVisible"
        type="checkbox"
        class="checkbox"
      />
      <label v-t="'show'" :for="`abstractVisible-${loadedData.id}`"></label>
    </div>
    <vue-pell-editor
      v-model="loadedData.note"
      :actions="editorOptions"
      default-paragraph-separator="p"
      @change="onEditorChange($event, 'note')"
    />
    <vue-pell-editor
      v-if="typeof loadedData.extra_note !== 'undefined'"
      v-model="loadedData.extra_note"
      :actions="editorOptions"
      default-paragraph-separator="p"
      @change="onEditorChange($event, 'extra_note')"
    />
  </div>
</template>

<script>
/* global Vue */
if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  const VuePellEditor = require('vue-pell-editor');
  Vue.use(VuePellEditor);
}

export default {
  name: 'DashboardModalContentAbstract',
  props: {
    loadedData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      editorOptions: ['paragraph', 'ulist'],
    };
  },
  methods: {
    onEditorChange({ editor }, key) {
      const content = editor.querySelector('.pell-content');

      /*
       * Fix all illegal variations of nested paragraphs and lists,
       * and move them out of each other
       */
      let nested;
      // eslint-disable-next-line no-cond-assign
      while (
        (nested = content.querySelector('p > p, p > ul, ul > p')) != null
      ) {
        content.insertBefore(nested, nested.parentElement);
      }

      /*
       * Remove paragraph and div elements inside of list elements
       */
      // eslint-disable-next-line no-cond-assign
      while ((nested = content.querySelector('li p, li div')) != null) {
        nested.outerHTML = nested.innerHTML;
      }

      /*
       * Remove all span elements since they are only used for styling and we
       * remove styles
       */
      // eslint-disable-next-line no-cond-assign
      while ((nested = content.querySelector('span')) != null) {
        nested.outerHTML = nested.innerHTML;
      }

      /*
       * If there is a top level br element wrap it in a paragraph
       */
      let children = content.childNodes;
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (child.nodeType === 3 || child.tagName === 'BR') {
          const p = document.createElement('p');
          content.insertBefore(p, child);
          p.appendChild(child);
        }
      }

      /*
       * If there are empty top level elements remove them
       */
      children = content.childNodes;
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (!child.innerHTML || !child.innerHTML.trim()) {
          content.removeChild(child);
        }
      }

      /*
       * Remove all style and dir attributes on all elements
       */
      const all = content.querySelectorAll('*');
      for (let i = 0; i < all.length; i += 1) {
        const el = all[i];
        el.removeAttribute('style');
        el.removeAttribute('dir');
      }

      /*
       * Save the fixed markup to the model
       */
      this.loadedData[key] = content.innerHTML;
    },
  },
};
</script>

<style lang="scss" scoped>
.vp-editor {
  background-color: #fff;

  :deep(.pell-content) {
    height: 200px;
  }

  & + .vp-editor {
    margin-top: 10px;
  }
}
</style>
