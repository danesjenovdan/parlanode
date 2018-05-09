<template>
  <div class="questions date-list">
    <div
      v-for="day in questionDays"
      :key="day.date">
      <div class="date">{{ day.date }}</div>
      <ul>
        <li
          v-for="question in day.questions"
          :key="question.id">
          <div class="parlaicon parlaicon-vprasanje"></div>
          <div class="motion">
            <a
              v-if="showAuthor"
              class="funblue-light-hover"
              :href="getPersonLink(question.person)">
              {{ question.person.name }}
            </a>
            {{ getRecipient(question) }}
            <a
              target="_blank"
              class="funblue-light-hover"
              :href="question.url">
              {{ question.title }}
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getPersonLink } from 'components/links';
import { includes } from 'lodash';

export default {
  name: 'QuestionList',
  props: {
    questionDays: {
      type: Array,
      required: true,
    },
    showAuthor: Boolean,
  },
  methods: {
    getPersonLink,
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
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/breakpoints';

.questions {
  min-height: 100px;
  flex: 1;
  overflow-y: auto;
  margin-top: 18px;
  max-height: 100%;
  position: relative;

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
