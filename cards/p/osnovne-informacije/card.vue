<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="full"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
      <p v-t="'info.text[1]'" class="info-text"></p>
    </div>

    <div class="poslanec osnovne-informacije-poslanca">
      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-skupina" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'party'"></span>:
            <a
              v-if="data.person.party.classification === 'pg'"
              :href="getPersonPartyLink(data.person)"
              class="funblue-light-hover"
            >
              {{ data.person.party.acronym }}
            </a>
            <span v-else>
              {{ data.person.party.acronym }}
            </span>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-delaza" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <i18n
            v-if="data.results.voters && data.person.gender === 'f'"
            path="elected-to-district--f"
            tag="span"
            class="key"
          >
            <b place="numVotes">{{ data.results.voters }}</b>
            <b place="district">{{ data.results.district.join(', ') }}</b>
          </i18n>
          <i18n
            v-else-if="data.results.voters"
            path="elected-to-district--m"
            tag="span"
            class="key"
          >
            <b place="numVotes">{{ data.results.voters }}</b>
            <b place="district">{{ data.results.district.join(', ') }}</b>
          </i18n>
          <i18n
            v-else-if="data.results.points && data.person.gender === 'f'"
            path="elected-to-district-with-points--f"
            tag="span"
            class="key"
          >
            <b place="numVotes">{{ data.results.points }}</b>
            <b place="district">{{ data.results.district.join(', ') }}</b>
          </i18n>
          <i18n
            v-else-if="data.results.points"
            path="elected-to-district-with-points--m"
            tag="span"
            class="key"
          >
            <b place="numVotes">{{ data.results.points }}</b>
            <b place="district">{{ data.results.district.join(', ') }}</b>
          </i18n>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-mandat" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'number-of-terms'"></span>: <b>{{ data.results.mandates }}</b>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-status" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'previous-occupation'"></span>: <b>{{ data.results.previous_occupation }}</b>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-izobrazba" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'education'"></span>: <b>{{ data.results.education }}</b>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-starost" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <i18n path="age" tag="span" class="key">
            <b place="age">{{ age }}</b>
          </i18n>
        </div>
      </div>

      <div class="row">
        <div class="parlaicon-container">
          <span class="parlaicon parlaicon-omrezja" aria-hidden="true"></span>
        </div>
        <div class="bordertop0">
          <span class="key">
            <span v-t="'social-media'"></span>:
            <a
              v-if="data.results.social[0].facebook"
              :href="data.results.social[0].facebook"
              class="socialicon-container"
              target="_blank"
            >
              <div class="parlaicon parlaicon-facebook">
                <svg
                  viewBox="0 0 59 100"
                  width="59"
                  height="100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <rect
                      id="canvas_background"
                      fill="none"
                      height="402"
                      width="582"
                      y="-1"
                      x="-1"
                    />
                  </g>
                  <g>
                    <!-- eslint-disable-next-line max-len -->
                    <path d="m53.515999,0.67l0,14.732l-8.761002,0q-4.799,0 -6.473,2.008999t-1.674,6.027l0,10.547001l16.350002,0l-2.176003,16.517998l-14.173996,0l0,42.355003l-17.076002,0l0,-42.355003l-14.23,0l0,-16.517998l14.23,0l0,-12.165001q0,-10.378999 5.803999,-16.099001t15.458,-5.719999q8.203003,0 12.723,0.67l-0.000999,-0.001z" />
                  </g>
                </svg>
              </div>
            </a>

            <a
              v-if="data.results.social[0].twitter"
              :href="data.results.social[0].twitter"
              class="socialicon-container"
              target="_blank"
            >
              <div class="parlaicon parlaicon-twitter">
                <svg
                  viewBox="0 0 93 100"
                  width="93"
                  height="100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <rect
                      id="canvas_background"
                      fill="none"
                      height="402"
                      width="582"
                      y="-1"
                      x="-1"
                    />
                  </g>
                  <g>
                    <!-- eslint-disable-next-line max-len -->
                    <path id="svg_1" d="m90.402,22.768q-3.738998,5.469 -9.040001,9.319002q0.056,0.780998 0.056,2.343998q0,7.254002 -2.121002,14.480999t-6.445,13.867001t-10.295998,11.747002t-14.396999,8.146996t-18.025,3.041q-15.123001,0 -27.679002,-8.091995q1.953,0.223 4.353,0.223q12.555999,0 22.377,-7.701004q-5.858999,-0.112 -10.490999,-3.598999t-6.362,-8.901001q1.842,0.279003 3.404,0.279003q2.4,0 4.743,-0.614002q-6.25,-1.283001 -10.352,-6.222t-4.102001,-11.467999l0,-0.223q3.795,2.120998 8.147001,2.287998q-3.683,-2.454998 -5.859001,-6.417t-2.176,-8.594q0,-4.910999 2.455,-9.095999q6.752,8.314999 16.434,13.309t20.731001,5.552q-0.445999,-2.121002 -0.445999,-4.129002q0,-7.477999 5.272999,-12.750999t12.750999,-5.273q7.812004,0 13.169998,5.692q6.083,-1.172001 11.440002,-4.353001q-2.065002,6.417 -7.923996,9.933001q5.189995,-0.558001 10.378998,-2.789999l0.001999,0.000999z" />
                  </g>
                </svg>
              </div>
            </a>

            <i v-if="!data.results.social[0].facebook && !data.results.social[0].twitter">
              <b v-t="'no-social-media'"></b>
            </i>
          </span>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import { parseISO, differenceInCalendarYears } from 'date-fns';
import common from 'mixins/common';
import { memberOverview } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';
import { memberHeader } from 'mixins/altHeaders';
import { memberOgImage } from 'mixins/ogImages';
import links from 'mixins/links';

export default {
  name: 'OsnovneInformacijePS',
  components: { },
  mixins: [
    common,
    memberOverview,
    memberTitle,
    memberHeader,
    memberOgImage,
    links,
  ],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.person.id}?altHeader=true`;
    },
    age() {
      return differenceInCalendarYears(new Date(), parseISO(this.data.results.birth_date));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~parlassets/scss/breakpoints";
@import "~parlassets/scss/colors";

.parlaicon-vodja {
  background-image: url("#{getConfig('urls.cdn')}/icons/vodja.svg");
}
.parlaicon-namestnik {
  background-image: url("#{getConfig('urls.cdn')}/icons/namestnik.svg");
}
.parlaicon-sedezi {
  background-image: url("#{getConfig('urls.cdn')}/icons/sedezi.svg");
}
.parlaicon-kontakt {
  background-image: url("#{getConfig('urls.cdn')}/icons/kontakt.svg");
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
  border-top: 1px solid $background;
  padding: 10px 0;
  margin: 5px 0;
}

.bordertop0 {
  border-top: 1px solid $background;
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
    a { color: $font-placeholder; }
  }

  .img-responsive{
    width: 40px;
    margin: 10px 15px 10px 0;
    @include respond-to(desktop) { margin-right: 25px; }
  }
}

.parlaicon-facebook,
.parlaicon-twitter {
  svg {
    width: 22px;
    height: 22px;
    fill: $cta-passive-background;

    &:hover {
      fill: $cta-hover-background;
    }
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
    min-height: 0; // firefox flex bug
    min-height: -moz-fit-content;
    min-height: fit-content;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .key {
      color: $font-default;
    }
  }
}
</style>
