<template>
  <scroll-shadow ref="shadow">
    <div
      class="questions date-list"
      @scroll="$refs.shadow.check($event.currentTarget)"
    >
      <div
        v-if="questionDays.length === 0"
        v-t="'no-results'"
        class="no-results"
      />
      <div v-else>
        <div v-for="day in questionDays" :key="day.date">
          <div class="date">{{ day.date }}</div>
          <template v-if="day.questions">
            <question
              v-for="question in day.questions"
              :key="question.id"
              :question="question"
              :show-author="showAuthor"
            />
          </template>
          <template v-else-if="day.events">
            <event
              v-for="(event, i) in day.events"
              :key="`${day.date}-${i}`"
              :event="event"
            />
          </template>
        </div>
      </div>
    </div>
  </scroll-shadow>
</template>

<script>
import ScrollShadow from '@/_components/ScrollShadow.vue';
import Question from '@/_components/Question.vue';
import Event from '@/_components/Event.vue';

export default {
  name: 'QuestionList',
  components: {
    ScrollShadow,
    Question,
    Event,
  },
  props: {
    questionDays: {
      type: Array,
      required: true,
    },
    showAuthor: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';
@import 'parlassets/scss/breakpoints';

.questions {
  min-height: 100px;
  flex: 1;
  overflow-y: auto;
  max-height: 100%;
  position: relative;
  height: $full-card-height;

  .date {
    font-weight: 500;
  }
}
</style>
