<template>
  <div class="event">
    <div :class="['parlaicon', eventIcon]"></div>
    <template v-if="event.type === 'question'">
      <i18n-t :keypath="translationKey" tag="div" class="motion">
        <template #name>
          <span v-if="showAuthor">
            <span v-for="(author, index) in authors" :key="author.id">
              <a :href="getPersonLink(author)" class="funblue-light-hover">{{
                author.name
              }}</a
              ><span v-if="index + 1 < authors.length">, </span>
            </span>
          </span>
        </template>
        <template #title>
          <component
            :is="event.url ? 'a' : 'strong'"
            :href="event.url"
            :class="{ 'funblue-light-hover': event.url }"
            target="_blank"
            >{{ event.title }}</component
          >
        </template>
        <template #recipient>
          <span>{{ event.recipient_text }}</span>
        </template>
      </i18n-t>
    </template>
    <template v-else-if="event.type === 'ballot'">
      <i18n-t :keypath="translationKey" tag="div" class="motion">
        <template #title>
          <a :href="getVoteLink(event)" class="funblue-light-hover">{{
            event.vote?.title
          }}</a>
        </template>
      </i18n-t>
    </template>
    <template v-else-if="event.type === 'speech'">
      <i18n-t :keypath="translationKey" tag="div" class="motion">
        <template #session>
          <a :href="getSpeechLink(event)" class="funblue-light-hover">{{
            event.session?.name
          }}</a>
        </template>
        <template #org>
          <span>{{
            event.session?.organizations?.map((o) => o.name).join(', ')
          }}</span>
        </template>
      </i18n-t>
    </template>
    <template v-else>
      <a :href="event.content_url" class="funblue-light-hover" target="_blank">
        {{ event.type }}
      </a>
    </template>
  </div>
</template>

<script>
import links from '@/_mixins/links.js';

export default {
  name: 'Event',
  mixins: [links],
  props: {
    event: {
      type: Object,
      required: true,
    },
    showAuthor: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    eventIcon() {
      if (this.event.type === 'question') {
        return 'parlaicon-vprasanje';
      }
      if (this.event.type === 'ballot') {
        switch (this.event.option) {
          case 'for':
            return 'parlaicon-za';
          case 'against':
            return 'parlaicon-proti';
          case 'absent':
            return 'parlaicon-ni';
          case 'abstain':
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
    authors() {
      if (this.$root.cardData.data?.person) {
        return [this.$root.cardData.data?.person];
      }
      return this.event.authors || [];
    },
    translationKey() {
      let gender = 'plural';
      if (this.event.authors.length === 1) {
        gender = this.event.authors[0].preferred_pronoun === 'she' ? 'f' : 'm';
      }
      if (this.event.type === 'question') {
        return `question.asked${
          this.showAuthor ? '--with-name' : ''
        }--${gender}`;
      }
      if (this.event.type === 'ballot') {
        return `event.ballot--${this.event.option}--${gender}`;
      }
      if (this.event.type === 'speech') {
        return `event.speech--${gender}`;
      }
      return '';
    },
  },
};
</script>

<style lang="scss">
@import 'parlassets/scss/breakpoints';

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

    a,
    strong {
      font-weight: normal;
    }
  }
}
</style>
