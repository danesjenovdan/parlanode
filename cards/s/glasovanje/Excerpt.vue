<template>
  <div class="excerpt">
    <div class="rich-text" v-html="content" />
    <hr>
    <div class="metadata">
      <div class="main-law-label">
        Matični zakon:
      </div>
      <div class="main-law-name">
        <a :href="mainLaw.link">{{ mainLaw.name }}</a>
      </div>
      <div v-if="documents.length > 0" class="documents">
        <p-search-dropdown
          single
          small
          :items="mappedDocuments"
          placeholder="Dokumenti"
          :select-callback="openDocument"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PSearchDropdown from 'components/SearchDropdown.vue';
import { find } from 'lodash';

export default {
  name: 'Excerpt',
  components: {
    PSearchDropdown,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    mainLaw: {
      type: Object,
      required: true,
    },
    documents: {
      type: Array,
      required: false,
    },
  },
  computed: {
    mappedDocuments() {
      return this.documents.map((document, index) => ({
        id: document.name + index,
        label: document.name.substring(0, 3) === ' | ' ? `Dokument brez imena${document.name}` : document.name,
        selected: false,
        url: document.url,
      }));
    },
  },
  methods: {
    openDocument(documentId) {
      const selectedDocument = find(this.mappedDocuments, { id: documentId });
      window.open(selectedDocument.url, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import "~parlassets/scss/colors";

.excerpt {
  font-size: 12px;
  font-family: "Roboto Slab", serif;
  font-weight: 300;
  line-height: 1.5em;
  margin: 12px 0;
  padding: 12px 24px;
  background: $grey;
}

hr {
  background: $black;
  height: 1px;
  margin: 10px 0 0 0;
}

.metadata {
  font-size: 14px;
  @include respond-to(desktop) { display: flex; }

  .main-law-label {
    background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/zakon.svg");
    background-size: 20px 19px;
    background-repeat: no-repeat;
    font-family: Roboto, sans-serif;
    font-weight: 300;
    margin-top: 12px;
    padding-left: 30px;
    width: 130px;
  }

  .main-law-name {
    flex: 1;
    margin-top: 12px;
  }

  .documents {
    margin-top: 12px;
    @include respond-to(desktop) {
      margin-left: 12px;
      width: 160px;
    }
  }
}
</style>

<style lang="scss">
.excerpt .rich-text {
  ul {
    padding-left: 14px;
    margin-bottom: 1em;
    li { margin-bottom: 1em; }
  }
}
</style>
