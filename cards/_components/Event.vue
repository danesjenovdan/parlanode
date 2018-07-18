<template>
  <div class="event">
    <div :class="['parlaicon', eventIcon]"></div>
    <template v-if="event.type === 'question'">
      <i18n
        :path="translationKey"
        tag="div"
        class="motion"
      >
        <a
          :href="event.content_url"
          target="_blank"
          class="funblue-light-hover"
          place="title"
        >{{ event.title }}</a>
        <span place="recipient">{{ event.recipient_text }}</span>
      </i18n>
    </template>
    <template v-else-if="event.type === 'ballot'">
      <i18n
        :path="translationKey"
        tag="div"
        class="motion"
      >
        <a
          :href="getSessionVoteLink(event)"
          class="funblue-light-hover"
          place="title"
        >{{ event.vote_name }}</a>
      </i18n>
    </template>
    <template v-else-if="event.type === 'speech'">
      <i18n
        :path="translationKey"
        tag="div"
        class="motion"
      >
        <a
          :href="getSessionSpeechLink(event)"
          class="funblue-light-hover"
          place="session"
        >{{ event.session.name }}</a>
        <span place="org">{{ event.session.org.name }}</span>
      </i18n>
    </template>
    <template v-else>
      <a :href="event.content_url" class="funblue-light-hover" target="_blank">
        {{ event.type }}
      </a>
    </template>
  </div>
</template>

<script>
import { getPersonLink, getSessionVoteLink, getSessionSpeechLink } from 'components/links';

function getBallotOption(option) {
  if (option === 'za') {
    return 'for';
  }
  if (option === 'proti') {
    return 'against';
  }
  if (option === 'ni') {
    return 'not';
  }
  if (option === 'kvorum') {
    return 'quorum';
  }
  return option;
}

export default {
  name: 'Event',
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  computed: {
    eventIcon() {
      if (this.event.type === 'question') {
        return 'parlaicon-vprasanje';
      }
      if (this.event.type === 'ballot') {
        // TODO: i18n
        switch (getBallotOption(this.event.option)) {
          case 'for':
            return 'parlaicon-za';
          case 'against':
            return 'parlaicon-proti';
          case 'not':
            return 'parlaicon-ni';
          case 'quorum':
            return 'parlaicon-kvorum';
          default:
            return '';
        }
      }
      if (this.event.type === 'speech') {
        return 'parlaicon-govor';
      }
      return '';
    },
    translationKey() {
      if (this.event.type === 'question') {
        return `question.asked--${this.$root.data.person.gender}`;
      }
      if (this.event.type === 'ballot') {
        return `event.ballot--${getBallotOption(this.event.option)}--${this.$root.data.person.gender}`;
      }
      if (this.event.type === 'speech') {
        return `event.speech--${this.$root.data.person.gender}`;
      }
      return '';
    },
  },
  methods: {
    getPersonLink,
    getSessionVoteLink,
    getSessionSpeechLink,
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/breakpoints';

.event {
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
