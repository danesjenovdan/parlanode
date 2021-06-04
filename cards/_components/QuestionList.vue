<template>
  <scroll-shadow ref="shadow">
    <div
      class="questions date-list"
      @scroll="$refs.shadow.check($event.currentTarget)"
    >
      <div v-if="!questionDays?.length" v-t="'no-results'" class="no-results" />
      <div v-else>
        <div v-for="day in questionDays" :key="day.date">
          <div class="date">{{ dateFormatter(day.date) }}</div>
          <event
            v-for="(event, i) in day.events"
            :key="`${day.date}-${i}`"
            :event="event"
            :show-author="showAuthor"
          />
        </div>
      </div>
    </div>
  </scroll-shadow>
</template>

<script>
import ScrollShadow from '@/_components/ScrollShadow.vue';
import Event from '@/_components/Event.vue';
import dateFormatter from '@/_helpers/dateFormatter.js';

export default {
  name: 'QuestionList',
  components: {
    ScrollShadow,
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
  methods: {
    dateFormatter,
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
