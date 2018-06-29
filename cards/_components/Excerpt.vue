<template>
  <div class="excerpt">
    <div
      v-if="icon"
      :class="{'show-parent': showParent}"
      class="icon-container"
    >
      <div :style="{'background-image': `url('https://cdn.parlameter.si/v1/parlassets/icons/legislation/${icon}')`}" class="icon"></div>
    </div>
    <div
      v-if="content || (content.length !== 0)"
      :class="{'show-parent': showParent, 'show-documents': documents.length > 0}"
      class="rich-text"
    >
      <div class="text-container" v-html="content">
      </div>
    </div>
    <div v-else class="no-abstract">
      <p>Za ta zakon žal nimamo povzetka.</p>
    </div>
    <div
      v-if="((mainLaw.epa !== '') && showParent) || (documents.length !== 0)"
      class="metacontainer"
    >
      <hr>
      <div class="metadata">
        <div v-if="(mainLaw.epa !== '') && showParent" class="main-law-label">
          Matični zakon:
        </div>
        <div class="main-law-name">
          <a v-if="(mainLaw.epa !== '') && showParent" :href="mainLaw.link">{{ mainLaw.name }}</a>
        </div>
        <div v-if="documents.length > 0" class="documents">
          <p-search-dropdown
            :items="mappedDocuments"
            :select-callback="openDocument"
            :up="true"
            single
            small
            placeholder="Dokumenti"
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
      default: () => [],
    },
    showParent: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: '',
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
  font-size: 13px;
  font-family: "Roboto Slab", serif;
  font-weight: 300;
  line-height: 1.5em;
  margin: 12px 0;
  padding: 40px;
  background: $grey;
  height: 442px;
  position: relative;
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
      min-width: 160px;
    }
  }
}
</style>

<style lang="scss">
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.excerpt {
  display: flex;
  flex-wrap: no-wrap;

  .icon-container {
    display: flex;
    @include respond-to(mobile) {
      display: none;
    }
    &.show-parent,
    &.show-documents {
      max-height: 349px;
    }
    .icon {
      display: block;
      flex: 1;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 65%;
      width: 100px;
      height: 100px;
      background-color: $white;
      border-radius: 50%;
      align-self: center;

    }
    // padding-left: 20px;
    // padding-right: 20px;
  }

  .rich-text {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 40px;

    max-height: 360px;

    display: flex;
    margin: auto;

    &.show-parent,
    &.show-documents {
      max-height: 349px;
      @include respond-to(mobile) {
        padding: 0;
        min-height: 320px;
      }
    }

    @include respond-to(mobile) {
      padding: 0;
      height: 320px;
    }

    p {
      flex: 2;
      font-size: 18px;
      border-bottom: 1px solid $black;
      margin-bottom: 0;
      padding-top: 1em;
      padding-bottom: 1em;
    }

    ul {
      padding-left: 0;
      margin-bottom: 1em;
      font-size: 14px;
      li {
        list-style-type: none;
        padding-left: 20px;
        padding-top: 1em;
        padding-bottom: 1em;
        border-bottom: 1px solid $black;

        &:last-child {
          border-bottom: none !important;
        }

        // &::before {
        //   content: '';
        //   display: inline-block;
        //   width: 10px;
        //   height: 10px;
        //   background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/puscica-izvlecki.svg');
        //   background-size: contain;
        //   margin-right: 5px;
        //   margin-left: -18px;
        // }
      }
    }
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
  width: calc(100% - 80px);
  bottom: 10px;
  background: $grey;
}

.search-dropdown-input {
  background-color: #ffffff;
  font-family: 'Roboto', sans-serif;
}

.search-dropdown-label {
  font-family: 'Roboto', sans-serif;
}

</style>
