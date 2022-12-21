<template>
  <card-wrapper :header-config="headerConfig">
    <div class="public-questions-form">
      <div v-if="!questionSent && !questionSentError">
        <p>{{ $t('ask-person-a-question') }}</p>
        <textarea
          v-model="question"
          :class="['form-control', 'question-input', { error: questionError }]"
          @input="questionError = sendDisabled"
        ></textarea>
        <!--
          https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed
          If you hide the badge, you need to add this text!
        -->
        <!-- <div class="recaptcha-text">
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a>
          apply.
        </div> -->
        <button
          class="btn-parlameter btn-full-width btn-blue send-button"
          :disabled="sendDisabled"
          @click="sendQuestion"
        >
          {{ $t('send') }}
        </button>
      </div>
      <div v-else-if="questionSentError">
        <h4 class="text-center">{{ $t('error-message') }}</h4>
      </div>
      <div v-else-if="questionSent">
        <h4 class="text-center">{{ $t('thank-you-for-the-question') }}</h4>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import { load as loadRecaptcha } from 'recaptcha-v3';
import common from '@/_mixins/common.js';
import { personOverviewContextUrl } from '@/_mixins/contextUrls.js';
import { personTitle } from '@/_mixins/titles.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';

export default {
  name: 'CardPersonBasicInformation',
  mixins: [
    common,
    personOverviewContextUrl,
    personTitle,
    personHeader,
    personOgImage,
  ],
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      recaptchaSiteKey: cardData.data?.recaptchaSiteKey,
      recaptcha: null,
      question: '',
      questionError: false,
      questionSent: false,
      questionSentError: false,
    };
  },
  computed: {
    sendDisabled() {
      if (this.recaptchaSiteKey && !this.recaptcha) {
        return true;
      }
      if (!this.question?.trim()) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    if (this.recaptchaSiteKey) {
      this.recaptcha = await loadRecaptcha(this.recaptchaSiteKey);
    }
  },
  methods: {
    async sendQuestion() {
      if (this.sendDisabled) {
        return;
      }
      try {
        let token = 'no_recaptcha';
        if (this.recaptchaSiteKey) {
          token = await this.recaptcha.execute('PublicPersonQuestion');
        }
        const response = await axios.post(this.cardData.url, {
          recipient_person: this.cardData.id,
          // author_email: 'ivan@email.com',
          text: this.question,
          recaptcha: token,
        });
        console.log('created question:', response.data.id);
        this.questionSent = true;
      } catch (error) {
        this.questionSentError = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.question-input {
  resize: vertical;
  min-height: 150px;

  &.error {
    border: 1px solid #f00;
  }
}

.send-button {
  &:disabled {
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    color: $white;
    background-color: $tab-hover;
  }

  &:active,
  &:hover:active {
    color: $white;
    background-color: $tab-active;
  }
}

.recaptcha-text {
  margin: 4px 0 2px;
  // max-width: 350px;
  font-size: 12px;
  color: #888;

  a {
    color: $link;
  }
}
</style>
