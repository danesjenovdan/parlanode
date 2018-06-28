<template>
  <div :class="['speech-holder', {'just-quote': showQuote}]" :id="speech.results.speech_id">
    <input type="hidden" class="mywords" :value="getSpeechContent(speech)" />
    <div class="person-session">
      <div class="person">
        <template v-if="speech.person.type === 'mp'">
          <a :href="getPersonLink(speech.person)">
            <img class="portrait" :src="getPersonPortrait(speech.person)" />
          </a>
          <a :href="getPersonLink(speech.person)" class="funblue-light-hover">
            <span class="name">{{speech.person.name}}</span>
          </a>
        </template>
        <template v-else>
          <img class="portrait" :src="getPersonPortrait(speech.person)" />
          <span class="name">{{speech.person.name}}</span>
        </template>
      </div>
      <div v-if="showSession" class="session">
        <a :href="getSessionTranscriptLink(speech.results.session)" class="funblue-light-hover">{{speech.results.session.name}}</a><br>
        <span class="date">{{speech.results.session.date}}</span>
      </div>
    </div>
    <div class="everything">
      <div class="speech-text">
        {{getSpeechContent(speech)}}
        <div class="quote-button">“</div>
      </div>
    </div>
    <div v-if="speech.results.quoted_text" class="quote">
      <div class="speech-text">
        {{quotePaddingBefore}}
        <span class="quote-text">{{speech.results.quoted_text}}</span>
        {{quotePaddingAfter}}
      </div>
      <a href="#" class="full-text-link" @click="showFullSpeech" v-t="'full-speech'"></a>
      <div class="quote-button">“</div>
    </div>
    <div class="links">
      <a :href="getSessionSpeechLink(speech.results)" class="link"></a>
      <a :href="`${slugs.urls.glej}/s/govor/${speech.results.speech_id}?frame=true`" v-if="!showSession" class="share"></a>
    </div>
  </div>
</template>

<script>
import {
  getPersonPortrait,
  getPersonLink,
  getSessionSpeechLink,
  getSessionTranscriptLink,
} from 'components/links';

const PADDING_LENGTH = 30;

export default {
  name: 'Speech',
  props: {
    speech: {
      type: Object,
      required: true,
    },
    showSession: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      getPersonPortrait,
      getPersonLink,
      getSessionSpeechLink,
      getSessionTranscriptLink,
      hideQuote: false,
    };
  },
  computed: {
    showQuote() {
      return this.speech.results.quoted_text && !this.hideQuote;
    },
    quotePaddingBefore() {
      const splitQuote = this.speech.results.content.replace(/\n+/g, ' ').trim().split(this.speech.results.quoted_text);
      const paddingBefore = splitQuote[0].slice(-PADDING_LENGTH);
      return paddingBefore ? `...${paddingBefore}` : '';
    },
    quotePaddingAfter() {
      const splitQuote = this.speech.results.content.replace(/\n+/g, ' ').trim().split(this.speech.results.quoted_text);
      const paddingAfter = splitQuote[1].slice(0, PADDING_LENGTH);
      return paddingAfter ? `${paddingAfter}...` : '';
    },
  },
  methods: {
    getSpeechContent(speech) {
      return speech.results.content.replace(/\n+/g, ' ').trim();
    },
    showFullSpeech(event) {
      event.preventDefault();
      this.hideQuote = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

@function icon-link($color) {
  @return 'data:image/svg+xml;utf8,<svg fill="%23#{str_slice('#{$color}', 2)}" xmlns="http://www.w3.org/2000/svg" height="50.456" width="50.45" viewBox="0 0 50.449501 50.456001"><path d="M16.712 45.482a5.394 5.394 0 0 1-7.62 0l-4.12-4.122a5.393 5.393 0 0 1 0-7.618l6.775-6.775-2.404-2.404-6.775 6.776c-3.424 3.426-3.424 9 0 12.425l4.12 4.123a8.766 8.766 0 0 0 6.216 2.568c2.25 0 4.5-.857 6.213-2.57l13.55-13.55a8.72 8.72 0 0 0 2.575-6.214 8.73 8.73 0 0 0-2.574-6.213l-4.123-4.12-2.404 2.403 4.124 4.12a5.352 5.352 0 0 1 1.578 3.81c0 1.438-.56 2.79-1.578 3.808L16.712 45.483z"/><path d="M43.76 2.575A8.728 8.728 0 0 0 37.545 0h-.002a8.73 8.73 0 0 0-6.213 2.574l-13.548 13.55a8.725 8.725 0 0 0-2.576 6.214 8.73 8.73 0 0 0 2.574 6.215l4.12 4.12 2.405-2.403-4.12-4.12a5.357 5.357 0 0 1-1.58-3.812c0-1.438.562-2.79 1.58-3.81l13.55-13.55a5.348 5.348 0 0 1 3.81-1.578c1.44 0 2.792.56 3.81 1.578l4.12 4.12c2.1 2.1 2.1 5.52 0 7.618l-6.774 6.777 2.405 2.404 6.775-6.777c3.426-3.427 3.426-9 0-12.426l-4.12-4.12z"/></svg>'
};

@function icon-share($color) {
  @return 'data:image/svg+xml;utf8,<svg fill="%23#{str_slice('#{$color}', 2)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 80" width="82" height="80"><path d="M68 52c-4.828 0-9.094 2.457-11.61 6.188l-29.04-13.98a13.964 13.964 0 0 0 0-8.416l29.035-13.98C58.905 25.542 63.17 28 67.998 28c7.72 0 14-6.28 14-14s-6.28-14-14-14-14 6.28-14 14c0 1.465.23 2.88.648 4.207L25.61 32.187C23.095 28.457 18.83 26 14 26 6.28 26 0 32.28 0 40s6.28 14 14 14c4.83 0 9.094-2.457 11.61-6.188l29.038 13.98A13.933 13.933 0 0 0 54 66c0 7.718 6.28 14 14 14s14-6.282 14-14-6.28-14-14-14zm0-48c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10S62.486 4 68 4zM14 50C8.486 50 4 45.514 4 40s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm54 26c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10z"/></svg>'
};

$blue: #009cdd;
$light-blue: #b4e9ff;
$medium-gray: #d0d0d0;

%text-styling {
  font-family: Roboto Slab;
  font-size: 14px;
  font-weight: 300;
  line-height: 28px;

  @include respond-to(desktop) {
    font-size: 16px;
  }
}

%link-styling {
  color: $blue;
  display: block;
  font-size: 16px;
  text-align: center;
  text-decoration: underline;
  text-transform: uppercase;

  &:hover {
    color: $blue;
  }
}

.person-session {
  $portrait-size: 34px;
  $portrait-margin: 14px;
  display: flex;
  height: 86px;
  justify-content: space-between;

  @include respond-to(desktop) {
    flex-direction: column;
    flex-wrap: wrap;
    height: auto;
    justify-content: flex-start;
    width: 220px;
  }

  .person {
    align-items: center;
    display: flex;

    @include respond-to(desktop) {
      width: 100%;
    }

    .portrait {
      border-radius: 50%;
      box-shadow: 0 0 4px #dddddd;
      height: $portrait-size;
      width: $portrait-size;
      margin-right: $portrait-margin;
    }

    .name {
      font-size: 16px;
      font-weight: 300;
    }
  }

  .session {
    font-size: 14px;
    line-height: 22px;
    padding: 21px 0 0 8px;

    @include respond-to(desktop) {
      padding: 7px 0 0 $portrait-size + $portrait-margin;
      width: 100%;
    }

    .date {
      font-family: Roboto Slab;
    }
  }
}

.speech-text {
  @extend %text-styling;
  margin: 0;
  padding: 0;
  position: relative;
}

.quote-button {
  background: #197197;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: none;
  font-family: Times New Roman, serif;
  font-size: 44px;
  height: 33px;
  left: -42px;
  line-height: 52px;
  margin-top: -16px;
  position: absolute;
  text-align: center;
  user-select: none;
  width: 33px;

  @include respond-to(mobile) {
    display: none !important;
  }
}

.links {
  display: flex;
  padding: 6px 0 16px 0;

  @include respond-to(desktop) {
    justify-content: flex-end;
    padding: 0;
    width: 110px;
  }

  .link,
  .share {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 17px 17px;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    display: block;
    color: red;

    &:not(:first-child) {
      margin-left: 9px;
    }

    &:hover {
      background-color: $light-blue;
      cursor: pointer;
    }
  }

  .link {
    background-image: url('#{icon-link($funblue)}');
    &:hover { background-image: url('#{icon-link($sadblue)}'); }
  }

  .share {
    background-position-x: 5px;
    background-image: url('#{icon-share($funblue)}');
    &:hover { background-image: url('#{icon-share($sadblue)}'); }
  }
}

.speech-holder {
  padding-left: 16px;
  padding-right: 16px;
  margin-left: -20px;
  margin-right: -20px;

  .everything,
  .quote {
    flex: 1;
    ::selection { background: $light-blue; }
    @include respond-to(desktop) {
      padding: 2px 8px 0 8px;
    }
  }

  .everything {
    display: block;
  }

  .quote {
    display: none;
    position: relative;
  }

  &.just-quote {
    .quote-button {
      background: $medium-gray;
      cursor: default;
      display: block;
      top: 50%;
    }

    .speech-text {
      color: #cacaca;

      .quote-text {
        color: #000000;
      }
    }

    .full-text-link {
      $width: 90px;
      @extend %link-styling;
      bottom: -36px;
      left: calc(50% - #{$width/2});
      position: absolute;
      width: $width;
    }

    .everything {
      display: none;
    }

    .quote {
      display: block;
    }
  }

  @include respond-to(desktop) {
    display: flex;
    padding-top: 15px;
    padding-bottom: 57px;
  }
}
</style>
