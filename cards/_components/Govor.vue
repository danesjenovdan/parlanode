<template>
  <li :class="cssClass">
    <div class="person-container">
      <a :href="getPersonLink(speech.person)" class="portrait">
        <img :src="getPersonPortrait(speech.person)">
      </a>

      <div class="name">
        <a :href="getPersonLink(speech.person)" class="funblue-light-hover">{{ speech.person.name }}</a><br>
      </div>
    </div>

    <div class="motion">
      <a :href="getSessionSpeechLink(speech)" class="funblue-light-hover" v-html="speech.content_t.substr(0, 180) + '...'"></a>
    </div>
  </li>
</template>

<script>
import { getPersonPortrait, getPersonLink, getSessionSpeechLink } from './links';

export default {
  props: {
    speech: {
      type: Object,
      required: true,
    },
    cssClass: {
      type: String,
      reqired: false,
      default: '',
    },
  },
  methods: {
    getPersonPortrait,
    getPersonLink,
    getSessionSpeechLink,
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';
.person-speech {
  border-bottom: 1px solid $grey;
  padding: 15px 0;
  list-style: none;
  display: flex;
  align-items: center;

  @include respond-to(mobile) {
    flex-wrap: wrap;
  }

  &:last-child {
    border-bottom: 0;
  }

  .person-container {
    flex: 2;
    display: flex;
    @include respond-to(mobile) {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 100%;
    }

    .portrait {
      margin-left: 7px;
      float: left;
      flex: none;

      @include respond-to(mobile) {
          margin-left: 0;
      }
      img {
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
    }
    .name {
      text-align: left;
      font-size: 14px;
      font-weight: 300;
      padding-right: 10p;
      margin: 0 5px 0 15px;
      flex: 1;
      align-self: center;
      a {
        text-decoration: none;
      }
    }
  }
  .motion {
    flex: 4;

    @include respond-to(mobile) {
        padding-top: 10px;
    }
    a {
      color: $black;
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      font-weight: 300;
      margin-right: 20px;
      padding-right: 5px;
      font-family: 'Roboto Slab', serif;
    }
  }
}
</style>
