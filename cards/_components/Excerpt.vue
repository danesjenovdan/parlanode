<template>
  <div class="excerpt">
    <div class="rich-text" v-html="content" />
    <div class="no-abstract" v-if="content.length === 0">
      <p>Za ta zakon žal nimamo izvlečka.</p>
    </div>
    <div class="metacontainer">
      <hr v-if="((mainLaw.epa !== '') && showParent) || (documents.length !== 0)">
      <div class="metadata">
        <div class="main-law-label" v-if="(mainLaw.epa !== '') && showParent">
          Matični zakon:
        </div>
        <div class="main-law-name">
          <a :href="mainLaw.link" v-if="(mainLaw.epa !== '') && showParent">{{ mainLaw.name }}</a>
        </div>
        <div v-if="documents.length > 0" class="documents">
          <p-search-dropdown
            single
            small
            :items="mappedDocuments"
            placeholder="Dokumenti"
            :select-callback="openDocument"
            :up="true"
          />
        </div>
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
    showParent: {
      type: Boolean,
      default: true,
    }
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
  font-size: 13px;
  font-family: "Roboto Slab", serif;
  font-weight: 300;
  line-height: 1.5em;
  margin: 12px 0;
  padding: 12px 24px;
  background: $grey;
  height: 442px;
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
@import '~parlassets/scss/colors';

.excerpt .rich-text {
  ul {
    padding-left: 14px;
    margin-bottom: 1em;
    li { margin-bottom: 1em; }
  }
}

.no-abstract {
  font-family: 'Roboto Slab', serif;
  text-align: center;
  font-size: 16px;
  color: $grey-dark;
  width: 100%;
  font-style: italic;
  padding-bottom: 40px;

  p {
    max-width: 150px;
    margin: auto;
    margin-top: 18px;
    font-size: 13px;
  }

  &::before {
    content: '';
    width: 70px;
    height: 70px;
    position: relative;
    margin: auto;
    margin-top: 100px;
    display: block;
    background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/missing-excerpt.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}

.metacontainer {
  position: absolute;
  width: calc(100% - 48px);
  bottom: 30px;
}
</style>
