<template>
  <div class="question">
    <div class="parlaicon parlaicon-vprasanje"></div>
    <i18n
      :path="translationKey"
      tag="div"
      class="motion"
    >
      <a
        v-if="showAuthor"
        :href="getPersonLink(question.person)"
        class="funblue-light-hover"
        place="name"
      >{{ question.person.name }}</a>
      <a
        :href="question.url"
        target="_blank"
        class="funblue-light-hover"
        place="title"
      >{{ question.title }}</a>
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
    translationKey() {
      const gender = (this.question.person && this.question.person.gender)
        || (this.$root.data && this.$root.data.person && this.$root.data.person.gender);
      return `question.asked${this.showAuthor ? '--with-name' : ''}--${gender}`;
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/breakpoints';

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
      font-weight: normal;
    }
  }
}
</style>
