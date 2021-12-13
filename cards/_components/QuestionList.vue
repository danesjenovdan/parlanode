<template>
  <scroll-shadow ref="shadow">
    <div
      v-infinite-scroll="() => $emit('load-more')"
      class="questions date-list"
      @scroll="$refs.shadow.check($event.currentTarget)"
    >
      <empty-state v-if="!questionDays?.length" />
      <div v-else>
        <div v-for="day in questionDays" :key="day.date">
          <div class="date">{{ formatDate(day.date) }}</div>
          <event
            v-for="(event, i) in day.events"
            :key="`${day.date}-${i}`"
            :event="event"
            :show-author="showAuthor"
          />
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="nalagalnik__wrapper">
      <div class="nalagalnik"></div>
    </div>
  </scroll-shadow>
</template>

<script>
import ScrollShadow from '@/_components/ScrollShadow.vue';
import Event from '@/_components/Event.vue';
import EmptyState from '@/_components/EmptyState.vue';
import dateFormatter from '@/_helpers/dateFormatter.js';
import infiniteScroll from '@/_directives/infiniteScroll.js';

export default {
  name: 'QuestionList',
  directives: {
    infiniteScroll,
  },
  components: {
    ScrollShadow,
    Event,
    EmptyState,
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
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['load-more'],
  methods: {
    formatDate: dateFormatter,
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

.nalagalnik__wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: $white-hover;
  z-index: 4;

  .nalagalnik {
    position: absolute;
    top: calc(50% - 50px);
  }
}
</style>
