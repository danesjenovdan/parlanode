<template>
  <div class="question">
    <div class="parlaicon parlaicon-vprasanje"></div>
    <i18n
      :path="translationKey"
      tag="div"
      class="motion"
    >
      <span v-if="showAuthor" place="name">
        <span v-for="(author, index) in authors" :key="author.id">
          <a
            :href="getPersonLink(author)"
            class="funblue-light-hover"
          >{{ author.name }}</a><span v-if="(index + 1) < authors.length">, </span>
        </span>
      </span>
      <span place="title">
        <a
          v-if="question.url"
          :href="question.url"
          target="_blank"
          class="funblue-light-hover"
        >{{ question.title }}</a>
        <strong v-else>{{ question.title }}</strong>
      </span>
      <span place="recipient">{{ question.recipient_text }}</span>
    </i18n>
  </div>
</template>

<script>
import links from 'mixins/links';

export default {
  name: 'Question',
  mixins: [
    links,
  ],
  props: {
    question: {
      type: Object,
      required: true,
    },
    showAuthor: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    authors() {
      return this.question.authors || [this.question.person];
    },
    translationKey() {
      if (this.authors.length > 1) {
        return `question.asked${this.showAuthor ? '--with-name' : ''}--plural`;
      }
      const gender = (this.authors[0] && this.authors[0].gender)
        || (this.$root.data && this.$root.data.person && this.$root.data.person.gender);
      return `question.asked${this.showAuthor ? '--with-name' : ''}--${gender}`;
    },
  },
};
</script>

<style lang="scss">
@import 'parlassets/scss/breakpoints';

.question {
  display: flex;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  margin: 7px 0;

  .parlaicon {
    height: auto;
    margin-right: 10px;
  }

  .motion {
    flex: 1;
    font-weight: 300;
    line-height: 20px;
    padding: 15px 0;
    margin-right: 10px;

    a {
      font-weight: 400;
    }

    strong {
      font-weight: 400;
    }
  }
}
</style>
