<template>
  <div class="question">
    <div class="question-row">
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
    <div class="question-row progress-row">
      <div class="parlaicon"></div> <!-- just a spacer -->
      <div class="progress-text">
        <div class="progress-text-left">
          Broj dana čekanja na odgovor
        </div>
        <div class="progress-text-right">
          {{ daysSinceAsked }}
        </div>
      </div>
    </div>
    <div class="question-row progress-row">
      <div class="parlaicon"></div> <!-- just a spacer -->
      <div class="progress-container">
        <div class="progress-bar" :class="{red: isLate}" :style="{width: progressWidth}"></div>
      </div>
    </div>
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
      const data = this.$root.$options.cardData.data;
      const gender = (this.authors[0] && this.authors[0].gender)
        || (data && data.person && data.person.gender);
      return `question.asked${this.showAuthor ? '--with-name' : ''}--${gender}`;
    },
    isAnswered() {
      return this.question.answer_date ? true : false;
    },
    daysSinceAsked() {
      const questionDate = new Date(this.question.question_date);
      let answerDate = new Date();
      if (this.isAnswered) {
        answerDate = new Date(this.question.answer_date);
      }
      const days = (answerDate.getTime() - questionDate.getTime()) / (1000 * 60 * 60 * 24);
      return Math.floor(days);
    },
    progressWidth() {
      const deadline = 30;
      const percent = Math.min(deadline, this.daysSinceAsked) / deadline * 100;
      return `${percent}%`;
    },
    isLate() {
      return this.daysSinceAsked > 30;
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
  flex-wrap: wrap;

  .question-row {
    width: 100%;
    flex-wrap: nowrap;
    display: flex;
  }

  .progress-row {
    margin-right: 20px;
  }

  .progress-text {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
  }

  .progress-text-left,
  .progress-text-right {
    font-size: 13px;
    font-weight: 300;
    font-style: normal;
    letter-spacing: normal;
    line-height: 20px;
    text-align: left;
  }

  .progress-container {
    /* Style for "Rounded Re" */
    width: 100%;
    height: 13px;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    background-color: #f0f0f0;
  }

  .progress-bar {
    height: 100%;
    background-image: linear-gradient(to left, #ff5555 0%, #ff5555 24%, #258498 69%, #258498 100%);
    border-radius: 7px;

    &.red {
      background-image: linear-gradient(to left, #ff5555 0%, #ff5555 24%, #ff5555 69%, #ff5555 100%);;
    }
  }

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
