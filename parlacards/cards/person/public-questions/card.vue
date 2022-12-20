<template>
  <card-wrapper :header-config="headerConfig">
    <div class="">
      <div class="" v-if="!questionSent && !questionSentError">
        <p v-t="'ask-person-a-question'"></p>
        <textarea
          v-model="question"
          ref=""
          class="form-control"
          :class="{ 'error': questionEmptyError }"
          @input="questionEmptyError = false"
        ></textarea>
        <button
          class="btn-parlameter btn-full-width btn-blue"
          @click="sendQuestion"
          v-t="'send'"
        >
        </button>
      </div>
      <div class="" v-if="questionSent">
        <h4 class="text-center" v-t="'thank-you-for-the-question'"></h4>
      </div>
      <div class="" v-if="questionSentError">
        <h4 class="text-center" v-t="'error-message'"></h4>
      </div>
    </div>
    <!-- <hr />
    <div class="">
      <h3>Odgovori poslanca_ke</h3>
    </div> -->
  </card-wrapper>
</template>

<script>
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
    const { cardState, cardData } = this.$root.$options.contextData;

    return {
      question: "",
      questionEmptyError: false,
      questionSent: false,
      questionSentError: false,
    };
  },
  computed: {
  },
  methods: {
    async sendQuestion() {
      if (this.question != "") {
        try {
          const response = await axios.post(
            `${process.env.VITE_PARLADATA_URL}/...`,
            {
              question: this.question
            }
          );
          this.questionSent = true;
        } catch (error) {
          this.questionSentError = true;
        }
      } else {
        this.questionEmptyError = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';
@import 'parlassets/scss/helper';
@import 'parlassets/scss/icons';

.form-control.error {
  border: 1px solid #f00;
}

</style>
