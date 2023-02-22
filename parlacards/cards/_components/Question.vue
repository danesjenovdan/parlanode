<template>
  <div class="question">
    <div :class="['parlaicon', eventIcon]"></div>
    <div
      class="motion"
      :class="{ shorten: shorten }"
      @click="shorten = !shorten"
    >
      <span class="funblue-light-hover" target="_blank">
        {{ question.text }}
      </span>
    </div>
  </div>
  <div class="answer" v-if="question.answer && !shorten">
    <p>{{ question.answer.text }}</p>
  </div>
</template>

<script>
import links from '@/_mixins/links.js';

export default {
  name: 'Question',
  mixins: [links],
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      shorten: true,
    };
  },
  computed: {
    eventIcon() {
      return 'parlaicon-vprasanje';
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
    cursor: pointer;

    span {
      font-weight: bolder;
    }

    &.shorten {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.answer {
  margin-left: 40px;

  p {
    margin-top: -10px;
  }
}

.answer:last-child {
  padding-bottom: 15px;
}

</style>
