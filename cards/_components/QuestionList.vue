<template>
  <scroll-shadow ref="shadow">
    <div class="questions date-list" @scroll="$refs.shadow.check($event.currentTarget)">
      <div v-for="day in questionDays" :key="day.date">
        <div class="date">{{ day.date }}</div>
        <ul>
          <template v-if="day.questions">
            <li v-for="question in day.questions" :key="question.id">
              <div class="parlaicon parlaicon-vprasanje"></div>
              <div class="motion">
                <a v-if="showAuthor" class="funblue-light-hover" :href="getPersonLink(question.person)">
                  {{ question.person.name }}
                </a>
                {{ getRecipient(question) }}
                <a target="_blank" class="funblue-light-hover" :href="question.url">
                  {{ question.title }}
                </a>
              </div>
            </li>
          </template>
          <template v-else-if="day.events">
            <li v-for="(event, i) in day.events" :key="`${day.date}-${i}`">
              <div :class="['parlaicon', getEventIcon(event)]"></div>
              <div class="motion">
                <template v-if="event.type === 'ballot'">
                  {{ getEventOptionText(event) }}
                  <a class="funblue-light-hover" :href="getSessionVoteLink(event)">{{ event.vote_name }}</a>
                </template>
                <template v-else-if="event.type === 'speech'">
                  <a class="funblue-light-hover" :href="getSessionSpeechLink(event)">{{ getEventOptionText(event) }}</a> na {{ event.session.name }} {{ event.session.org.name }}
                </template>
                <template v-else>
                  {{ getEventOptionText(event) }} <a class="funblue-light-hover" :href="event.content_url" target="_blank">{{ event.title }}</a>
                </template>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </scroll-shadow>
</template>

<script>
import { getPersonLink, getSessionVoteLink, getSessionSpeechLink } from 'components/links';
import { includes } from 'lodash';
import ScrollShadow from 'components/ScrollShadow.vue';

export default {
  name: 'QuestionList',
  components: {
    ScrollShadow,
  },
  props: {
    questionDays: {
      type: Array,
      required: true,
    },
    showAuthor: Boolean,
  },
  methods: {
    getPersonLink,
    getSessionVoteLink,
    getSessionSpeechLink,
    getRecipient(question) {
      return question.recipient_text
        .split(', ')
        .map((recipient) => {
          if (includes(recipient, 'minister')) {
            return `ministru ${recipient.split('minister ')[1]}`;
          } else if (includes(recipient, 'ministrica')) {
            return `ministrici ${recipient.split('ministrica ')[1]}`;
          }
          return 'Vladi';
        })
        .join(', ');
    },
    getEventIcon(event) {
      if (event.type === 'ballot') {
        switch (event.option) {
          case 'za':
            return 'parlaicon-za';
          case 'proti':
            return 'parlaicon-proti';
          case 'ni':
            return 'parlaicon-ni';
          case 'kvorum':
            return 'parlaicon-kvorum';
          default:
            return '';
        }
      } else if (event.type === 'speech') {
        return 'parlaicon-govor';
      }
      return 'parlaicon-vprasanje';
    },
    getEventOptionText(event) {
      if (event.type === 'ballot') {
        switch (event.option) {
          case 'za':
            return (this.$root.data.person.gender === 'm') ? 'Glasoval ZA' : 'Glasovala ZA';
          case 'proti':
            return (this.$root.data.person.gender === 'm') ? 'Glasoval PROTI' : 'Glasovala PROTI';
          case 'ni':
            return (this.$root.data.person.gender === 'm') ? 'NI glasoval za' : 'NI glasovala za';
          case 'kvorum':
            return (this.$root.data.person.gender === 'm') ? 'VZDRŽAL se je glasovanja o' : 'VZDRŽALA se je glasovanja o';
          default:
            return event.option;
        }
      } else if (event.type === 'speech') {
        return (this.$root.data.person.gender === 'm') ? 'Govoril' : 'Govorila';
      }
      let text = (this.$root.data.person.gender === 'm') ? 'Zastavil je vprašanje ' : 'Zastavila je vprašanje ';
      if (event.recipient_text === 'Vlada') {
        text += 'Vladi';
      } else if (event.recipient_text === 'predsednik Vlade') {
        text += 'predsedniku Vlade';
      } else {
        text += event.recipient_text.split(' ')[0] === 'minister'
          ? `ministru ${event.recipient_text.split('minister ')[1]}`
          : `ministrici ${event.recipient_text.split('ministrica ')[1]}`;
      }
      return text;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

.questions {
  min-height: 100px;
  flex: 1;
  overflow-y: auto;
  max-height: 100%;
  position: relative;
  height: 518px;

  &:empty::after {
    color: #c8c8c8;
    content: "Ni rezultatov.";
    left: calc(50% - 41px);
    position: absolute;
    top: calc(50% - 10px);
  }

  .date {
    font-weight: 500;
  }

  ul {
    list-style: none;
    margin: 0 0 7px;
    padding: 0;
  }

  li {
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;

    .date {
      height: auto;
      margin: 0 0 -18px 16px;
      padding: 16px 0;
      width: 54px;
    }

    .icon {
      @include show-for(desktop);

      background-position: center;
      background-repeat: no-repeat;
      background-size: 25px;
      height: 48px;
      width: 52px;

      &.za { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/za.svg"); }
      &.proti { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/proti.svg"); }
      &.ni { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/ni.svg"); }
      &.kvorum { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/vzdrzan.svg"); }
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
      a { font-weight: normal; }
    }

    .outcome {
      font-size: 11px;
      font-weight: 400;
      line-height: 13px;
      padding: 20px 15px 0;
      text-align: left;
      text-transform: uppercase;
      width: 90px;
    }
  }
}
</style>
