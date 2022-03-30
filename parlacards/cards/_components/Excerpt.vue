<template>
  <div :class="{ 'show-documents': documents.length > 0 }" class="excerpt">
    <div
      v-if="icon"
      :class="{ 'show-parent': showParent }"
      class="icon-container"
    >
      <div
        :style="{
          'background-image': `url('${slugs.urls.cdn}/icons/legislation/${icon}')`,
        }"
        class="icon"
      />
    </div>
    <div
      v-if="content || content.length !== 0"
      :class="{
        'show-parent': showParent,
        'show-documents': documents.length > 0,
      }"
      class="rich-text"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="text-container" v-html="content"></div>
    </div>
    <div v-else class="no-abstract">
      <p v-t="'no-abstract'"></p>
    </div>
    <div
      v-if="(mainLaw.epa !== '' && showParent) || documents.length !== 0"
      class="metacontainer"
    >
      <hr />
      <div class="metadata">
        <div v-if="mainLaw.epa !== '' && showParent" class="main-law-label">
          Matični zakon:
        </div>
        <div class="main-law-name">
          <a v-if="mainLaw.epa !== '' && showParent" :href="mainLaw.link">{{
            mainLaw.name
          }}</a>
        </div>
        <div v-if="documents.length > 0" class="documents">
          <p-search-dropdown
            :value="mappedDocuments"
            up
            single
            small
            placeholder="Dokumenti"
            @select="openDocument"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import { find } from 'lodash-es';

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
  data() {
    return {
      slugs: this.$root.slugs,
    };
  },
  computed: {
    mappedDocuments() {
      return this.documents.map((document, index) => ({
        id: document.name + index,
        label:
          document.name.substring(0, 3) === ' | '
            ? `Dokument brez imena${document.name}`
            : document.name,
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
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.excerpt {
  font-size: 13px;
  font-weight: 300;
  line-height: 1.5em;
  margin: 12px 0;
  padding: 40px;
  background: $background;
  height: 442px;
  position: relative;

  @include respond-to(mobile) {
    padding: 20px;
  }

  &.show-documents {
    padding-bottom: 60px;
  }
}

hr {
  background: $font-placeholder;
  height: 1px;
  margin: 10px 0 0 0;
}

.metadata {
  font-size: 14px;
  @include respond-to(desktop) {
    display: flex;
  }

  .main-law-label {
    background-image: url('#{get-parlassets-url()}/icons/zakon.svg');
    background-size: 20px 19px;
    background-repeat: no-repeat;
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
@import 'parlassets/scss/colors';
@import 'parlassets/scss/breakpoints';

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
    width: 100%;

    @include respond-to(mobile) {
      padding: 0 20px 0 10px;
      height: 320px;
    }

    .text-container {
      width: 100%;
    }

    &.show-parent,
    &.show-documents {
      max-height: 320px;

      @include respond-to(mobile) {
        padding: 0;
        min-height: 320px;
      }
    }

    p {
      flex: 2;
      font-size: 18px;
      border-bottom: 1px solid $font-placeholder;
      margin-bottom: 0;
      padding-top: 1em;
      padding-bottom: 1em;

      &:empty {
        display: none;
      }

      > br:only-child {
        display: none;
      }
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
        border-bottom: 1px solid $font-placeholder;

        &:last-child {
          border-bottom: none !important;
        }

        // &::before {
        //   content: '';
        //   display: inline-block;
        //   width: 10px;
        //   height: 10px;
        //   background-image: url('#{get-parlassets-url()}/icons/puscica-izvlecki.svg');
        //   background-size: contain;
        //   margin-right: 5px;
        //   margin-left: -18px;
        // }
      }
    }
  }
}

.no-abstract {
  text-align: center;
  font-size: 16px;
  color: $font-default;
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
    background-image: url('#{get-parlassets-url()}/icons/missing-excerpt.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}

.metacontainer {
  position: absolute;
  width: calc(100% - 80px);
  bottom: 10px;
  background: $background;
}

.search-dropdown-input {
  background-color: $white;
}

.search-dropdown-label {
}
</style>
