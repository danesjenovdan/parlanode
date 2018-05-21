<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">
        {{ $t('info.lead') }}
      </p>
      <p class="info-text heading">{{ $t('info.methodology') }}</p>
      <p class="info-text">
        {{ $t('info.text') }}
      </p>
    </div>

    <div class="poslanec osnovne-informacije-poslanca">
      <div v-for="(person, index) in people" class="row" :key="person.gov_id">
        <div class="parlaicon-container parlaicon-containermp">
          <span :class="['parlaicon', `parlaicon-${index === 0 ? 'vodja' : 'namestnik'}`]" aria-hidden="true"></span>
        </div>
        <div class="bordertop">
          <div class="verticalmember">
            <div class="row">
              <a :href="getPersonLink(person)" :title="person.name">
                <img class="img-circle img-responsive" :src="getPersonPortrait(person)" alt=""/>
              </a>
              <div class="member_data">
                <h3>
                  <a :href="getPersonLink(person)" class="funblue-light-hover">{{ person.name }}</a>
                </h3>
                <h4 v-if="index === 0">{{ $t('party-leader') }}</h4>
                <h4 v-else>{{ person.gender === 'f' ? $t('deputy-leader-f') : $t('deputy-leader-m') }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-sedezi" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            {{ $t('number-of-seats') }} <strong>{{data.numberOfSeats}}</strong>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-kontakt" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            {{ $t('contact') }} <a class="funblue-light-hover" :href="`mailto:${data.social.email}`">{{ data.social.email }}</a>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-omrezja" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            {{ $t('social-media') }}
            <a v-if="data.social.facebook" :href="data.social.facebook" class="socialicon-container" target="_blank">
              <div class="parlaicon parlaicon-facebook">
                <svg viewBox="0 0 59 100" width="59" height="100" xmlns="http://www.w3.org/2000/svg"><g><rect fill="none" id="canvas_background" height="402" width="582" y="-1" x="-1"/></g><g><path d="m53.515999,0.67l0,14.732l-8.761002,0q-4.799,0 -6.473,2.008999t-1.674,6.027l0,10.547001l16.350002,0l-2.176003,16.517998l-14.173996,0l0,42.355003l-17.076002,0l0,-42.355003l-14.23,0l0,-16.517998l14.23,0l0,-12.165001q0,-10.378999 5.803999,-16.099001t15.458,-5.719999q8.203003,0 12.723,0.67l-0.000999,-0.001z"/></g></svg>
              </div>
            </a>

            <a v-if="data.social.twitter" :href="data.social.twitter" class="socialicon-container" target="_blank">
              <div class="parlaicon parlaicon-twitter">
                <svg viewBox="0 0 93 100" width="93" height="100" xmlns="http://www.w3.org/2000/svg"><g><rect fill="none" id="canvas_background" height="402" width="582" y="-1" x="-1"/></g><g><path id="svg_1" d="m90.402,22.768q-3.738998,5.469 -9.040001,9.319002q0.056,0.780998 0.056,2.343998q0,7.254002 -2.121002,14.480999t-6.445,13.867001t-10.295998,11.747002t-14.396999,8.146996t-18.025,3.041q-15.123001,0 -27.679002,-8.091995q1.953,0.223 4.353,0.223q12.555999,0 22.377,-7.701004q-5.858999,-0.112 -10.490999,-3.598999t-6.362,-8.901001q1.842,0.279003 3.404,0.279003q2.4,0 4.743,-0.614002q-6.25,-1.283001 -10.352,-6.222t-4.102001,-11.467999l0,-0.223q3.795,2.120998 8.147001,2.287998q-3.683,-2.454998 -5.859001,-6.417t-2.176,-8.594q0,-4.910999 2.455,-9.095999q6.752,8.314999 16.434,13.309t20.731001,5.552q-0.445999,-2.121002 -0.445999,-4.129002q0,-7.477999 5.272999,-12.750999t12.750999,-5.273q7.812004,0 13.169998,5.692q6.083,-1.172001 11.440002,-4.353001q-2.065002,6.417 -7.923996,9.933001q5.189995,-0.558001 10.378998,-2.789999l0.001999,0.000999z"/></g></svg>
              </div>
            </a>

            <i v-if="!data.social.facebook && !data.social.twitter">
              <b>{{ $t('no-social-media') }}</b>
            </i>
          </span>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import { getPersonLink, getPersonPortrait } from 'components/links';

export default {
  components: { },
  mixins: [common, partyOverview, partyTitle],
  name: 'OsnovneInformacijePS',
  data() {
    const { party } = this.$options.cardData.data;
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        heading: party.name,
        subheading: `${party.acronym} | ${party.is_coalition ? 'koalicija' : 'opozicija'}`,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
        circleText: party.acronym,
        circleClass: `${party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
      },
    };
  },
  computed: {
    people() {
      return [
        this.data.headOfPG,
        ...this.data.viceOfPG,
      ];
    },
    generatedCardUrl() {
      return `${this.url}${this.data.party.id}?altHeader=true`;
    },
  },
  methods: {
    getPersonLink,
    getPersonPortrait,
  },
};
</script>

<style lang="scss" scoped>
@import "~parlassets/scss/breakpoints";

.parlaicon-vodja {
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/vodja.svg");
}
.parlaicon-namestnik {
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/namestnik.svg");
}
.parlaicon-sedezi {
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/sedezi.svg");
}
.parlaicon-kontakt {
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/kontakt.svg");
}
.parlaicon-omrezja{
  width: 30px;
  height: 30px;
  line-height: normal;
}

.parlaicon-container {
  padding: 10px 16px;
  @include respond-to(desktop) { min-width: 70px; }
}

.bordertop {
  border-top: 1px solid #f0f0f0;
  padding: 10px 0;
  margin: 5px 0;
}

.bordertop0 {
  border-top: 1px solid #f0f0f0;
  padding: 0;
  margin: 0;
}

.bordertop, .bordertop0 { flex: 1; }

.poslanec h3 { font-weight: 400; }

.verticalmember {
  width: 100%;

  .member_data {
    text-align: left;
    h4 { margin: 5px 0; }
    a { color: #505050; }
  }

  .img-responsive{
    width: 40px;
    margin: 10px 15px 10px 0;
    @include respond-to(desktop) { margin-right: 25px; }
  }
}

.parlaicon-facebook, .parlaicon-twitter {
  svg {
    width: 22px;
    height: 22px;
    fill: #197197;
    &:hover { fill: #009cdd; }
  }
}

.osnovne-informacije-poslanca {
  display: flex;
  flex-direction: column;
  height: 100%;

  .row {
    display: flex;
    flex: 1;
    margin: 0;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
