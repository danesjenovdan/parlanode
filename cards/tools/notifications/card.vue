<template>
  <transparent-wrapper>
    <template #generator>
      <tools-tabs current-tool="notifications" />
    </template>
    <div v-if="state.settings && state.uid">
      <form id="obvestilaData">
        <div class="content">
          <div class="">
            <div class="narrow-inner-container">
              <div class="ainnersmall">
                <div class="replaceme padding15">
                  <hr />
                  <div
                    v-for="keyword in keywords"
                    :key="keyword.id"
                    :class="[
                      'obvestiladatatpl',
                      'clearfix',
                      { updatedid: keyword.id === updatedId },
                    ]"
                  >
                    <div class="">
                      <div class="search">
                        <div
                          v-if="keyword.id === updatedId"
                          class="updatedText"
                        >
                          <h4>
                            <span class="glyphicon glyphicon-ok"></span>
                            Uspešno potrjeno!
                          </h4>
                        </div>

                        <div class="parta3">
                          <div
                            :id="`obvestilaKeyword_${keyword.id}`"
                            class="obvestilaKeyword"
                          >
                            {{ keyword.keyword }}
                          </div>
                          <input
                            :id="`keyword${keyword.id}`"
                            :value="keyword.keyword"
                            type="hidden"
                          />
                        </div>

                        <div class="parta4" @click="deleteKeyword(keyword)">
                          <div class="obvestiladelete">
                            <div class="exclude-presiding checkbox-twolines">
                              <!-- <span
                                    :id="`delete${keyword.id}`"
                                    data-deleted="false"
                                    class="glyphicon glyphicon-remove"
                                  ></span> -->
                              <!-- eslint-disable-next-line -->
                              <svg
                                width="100%"
                                height="100%"
                                fill="#fff"
                                xmlns:dc="http://purl.org/dc/elements/1.1/"
                                xmlns:cc="http://creativecommons.org/ns#"
                                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                                xmlns:svg="http://www.w3.org/2000/svg"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                                xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                                version="1.1"
                                x="0px"
                                y="0px"
                                viewBox="0 0 100 100"
                              >
                                <g transform="translate(0,-952.36218)">
                                  <path
                                    style="
                                      font-size: medium;
                                      font-style: normal;
                                      font-variant: normal;
                                      font-weight: normal;
                                      font-stretch: normal;
                                      text-indent: 0;
                                      text-align: start;
                                      text-decoration: none;
                                      line-height: normal;
                                      letter-spacing: normal;
                                      word-spacing: normal;
                                      text-transform: none;
                                      direction: ltr;
                                      block-progression: tb;
                                      writing-mode: lr-tb;
                                      text-anchor: start;
                                      baseline-shift: baseline;
                                      opacity: 1;
                                      color: #000000;
                                      fill: #fff;
                                      fill-opacity: 1;
                                      stroke: none;
                                      stroke-width: 6;
                                      marker: none;
                                      visibility: visible;
                                      display: inline;
                                      overflow: visible;
                                      enable-background: accumulate;
                                      font-family: Sans;
                                      -inkscape-font-specification: Sans;
                                    "
                                    d="M 39 5 C 35.173892 5 32 8.17389 32 12 L 32 15 L 13 15 A 3.0003 3.0003 0 0 0 12.6875 15 A 3.0040663 3.0040663 0 1 0 13 21 L 76.9375 21 L 75 87.90625 C 74.97939 88.61725 74.605076 89 74 89 L 26 89 C 25.394924 89 25.020608 88.61725 25 87.90625 L 23.25 27.9375 A 3.0010171 3.0010171 0 1 0 17.25 28.09375 L 19 88.0625 C 19.107812 91.7818 22.17308 95 26 95 L 74 95 C 77.82692 95 80.892188 91.7818 81 88.0625 L 82.9375 21 L 87 21 A 3.0003 3.0003 0 1 0 87 15 L 68 15 L 68 12 C 68 8.17389 64.826108 5 61 5 L 39 5 z M 39 11 L 61 11 C 61.605888 11 62 11.39411 62 12 L 62 15 L 38 15 L 38 12 C 38 11.39411 38.394112 11 39 11 z M 35.96875 30.9375 A 3.0003 3.0003 0 0 0 33 34 L 33 76 A 3.0003 3.0003 0 1 0 39 76 L 39 34 A 3.0003 3.0003 0 0 0 35.96875 30.9375 z M 49.96875 30.9375 A 3.0003 3.0003 0 0 0 47 34 L 47 76 A 3.0003 3.0003 0 1 0 53 76 L 53 34 A 3.0003 3.0003 0 0 0 49.96875 30.9375 z M 63.96875 30.9375 A 3.0003 3.0003 0 0 0 61 34 L 61 76 A 3.0003 3.0003 0 1 0 67 76 L 67 34 A 3.0003 3.0003 0 0 0 63.96875 30.9375 z "
                                    transform="translate(0,952.36218)"
                                  ></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div class="parta1">
                          <div class="search-dropdown">
                            <select
                              :id="`reminder${keyword.id}`"
                              :name="`reminder${keyword.id}`"
                              class="search-dropdown-input reminder"
                            >
                              <option
                                :selected="keyword.reminder === 'event'"
                                value="event"
                                @click="reminderCallback(keyword, 'event')"
                              >
                                {{ $t('events.event') }}
                              </option>
                              <option
                                :selected="keyword.reminder === 'day'"
                                value="day"
                                @click="reminderCallback(keyword, 'day')"
                              >
                                {{ $t('events.day') }}
                              </option>
                              <option
                                :selected="keyword.reminder === 'week'"
                                value="week"
                                @click="reminderCallback(keyword, 'week')"
                              >
                                {{ $t('events.week') }}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div class="parta2">
                          <div class="search-dropdown">
                            <select
                              :id="`match_mode${keyword.keyword}`"
                              :name="`match_mode${keyword.keyword}`"
                              class="search-dropdown-input match_mode"
                            >
                              <option
                                :selected="keyword.mode === 'natancno'"
                                value="natancno"
                                @click="modeCallback(keyword, 'natancno')"
                              >
                                {{ $t('modes.precise') }}
                              </option>
                              <option
                                :selected="keyword.mode === 'siroko'"
                                value="obe"
                                @click="modeCallback(keyword, 'siroko')"
                              >
                                {{ $t('modes.broad') }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--Nastavitve so spremenjene.-->
                </div>
                <div class="padding15 new-trigger-container">
                  <br />
                  <br />
                  <br />
                  <a
                    v-t="'add_new_trigger'"
                    href="#"
                    class="btn btn-default naprej"
                    @click.prevent="state.settings = false"
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-else>
      <div class="headernew">
        <div class="line"></div>

        <div :class="['hstepboxnew', 'hstep1', { act: currentStep === 1 }]">
          <div class="fakeleft"></div>
          <div class="circlebg">1</div>
          <div class="glyphicon glyphicon-ok"></div>
          <div v-t="'trigger'" class="circlebgtext"></div>
        </div>
        <div :class="['hstepboxnew', 'hstep2', { act: currentStep === 2 }]">
          <div class="circlebg">2</div>
          <div class="glyphicon glyphicon-ok"></div>
          <div v-t="'match'" class="circlebgtext"></div>
        </div>
        <div :class="['hstepboxnew', 'hstep3', { act: currentStep === 3 }]">
          <div class="circlebg">3</div>
          <div class="glyphicon glyphicon-ok"></div>
          <div v-t="'interval'" class="circlebgtext"></div>
        </div>
        <div :class="['hstepboxnew', 'hstep4', { act: currentStep === 4 }]">
          <div class="circlebg">4</div>
          <div class="glyphicon glyphicon-ok"></div>
          <div class="fakeright"></div>
          <div v-t="'email'" class="circlebgtext"></div>
        </div>
      </div>

      <div class="content">
        <div v-if="currentStep === 1" class="step step1">
          <div class="narrow-inner-container">
            <div class="ainnerbig">
              <h2 v-t="'add_trigger'"></h2>
              <div class="input-group search1">
                <input
                  v-model="keyword"
                  type="text"
                  name="keyword"
                  class="form-control simplebox keyword"
                  @keyup.enter="firstAction"
                />
                <div class="input-group-btn" style="padding-left: 10px">
                  <button
                    v-t="'add'"
                    class="action btn btn-default naprej"
                    @click="firstAction"
                  ></button>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <br />
                  <br />
                  <span
                    ><img :src="`${slugs.urls.cdn}/img/obvestila/ena.png`" />
                  </span>
                  <p v-t="'steps[0].textfirst'"></p>
                </div>
                <div class="col-md-12">
                  <br />
                  <br />
                  <span
                    ><img :src="`${slugs.urls.cdn}/img/obvestila/dva.png`"
                  /></span>
                  <p v-t="'steps[0].textsecond'"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2" class="step step2">
          <div class="narrow-inner-container">
            <div class="ainnersmall">
              <h2 v-t="'steps[1].textfirst'" class="left"></h2>
              <ul>
                <li>
                  <div class="exclude-presiding checkbox-twolines">
                    <input
                      id="modenatancno"
                      v-model="matchType"
                      type="radio"
                      name="match_mode[]"
                      value="natancno"
                      checked="checked"
                      class="radio"
                    />
                    <label for="modenatancno">
                      {{ $t('steps[1].firstbullet') }}
                      <span class="fillkeyword">"{{ keyword }}"</span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="exclude-presiding checkbox-twolines">
                    <input
                      id="modesiroko"
                      v-model="matchType"
                      type="radio"
                      name="match_mode[]"
                      value="siroko"
                      class="radio"
                    />
                    <label for="modesiroko">
                      {{ $t('steps[1].secondbullet') }}
                      <span class="fillkeyword">{{ keyword }}</span>
                    </label>
                  </div>
                </li>
              </ul>

              <button
                class="action btn btn-default nazaj top50 w50"
                @click="currentStep -= 1"
              >
                <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
                {{ $t('back') }}
              </button>
              <button
                class="action btn btn-default naprej top50 w50"
                @click="currentStep += 1"
              >
                {{ $t('continue') }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="step step3">
          <div class="narrow-inner-container">
            <div class="ainnersmall">
              <h2 v-t="'steps[2].textfirst'" class="left"></h2>
              <ul>
                <li>
                  <div class="exclude-presiding checkbox-twolines">
                    <input
                      id="reminderevent"
                      v-model="frequency"
                      type="radio"
                      name="reminder[]"
                      value="event"
                      class="radio"
                      checked="checked"
                    />
                    <label
                      v-t="'steps[2].textsecond'"
                      for="reminderevent"
                    ></label>
                  </div>
                </li>
                <li>
                  <div class="exclude-presiding checkbox-twolines">
                    <input
                      id="reminderday"
                      v-model="frequency"
                      type="radio"
                      name="reminder[]"
                      value="day"
                      class="radio"
                    />
                    <label v-t="'steps[2].textthird'" for="reminderday"></label>
                  </div>
                </li>
                <li>
                  <div class="exclude-presiding checkbox-twolines">
                    <input
                      id="reminderweek"
                      v-model="frequency"
                      type="radio"
                      name="reminder[]"
                      value="week"
                      class="radio"
                    />
                    <label
                      v-t="'steps[2].textfourth'"
                      for="reminderweek"
                    ></label>
                  </div>
                </li>
              </ul>

              <button
                class="action btn btn-default nazaj top50 w50"
                @click="currentStep -= 1"
              >
                <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
                {{ $t('back') }}
              </button>
              <button
                class="action btn btn-default naprej top50 w50"
                @click="currentStep += 1"
              >
                {{ $t('continue') }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 4" class="step step4">
          <div class="narrow-inner-container">
            <div class="ainnersmall">
              <h2 v-t="'steps[3].textfirst'"></h2>
              <div>
                <input
                  v-model="email"
                  :class="[
                    'form-control',
                    'simplebox email',
                    { errored: errored },
                  ]"
                  type="text"
                  name="email"
                  required
                />
                <button
                  class="action btn btn-default nazaj top50 w50"
                  @click="currentStep -= 1"
                >
                  <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
                  {{ $t('back') }}
                </button>
                <button
                  class="action btn btn-default naprej top50 w50"
                  @click="submitTrigger"
                >
                  {{ $t('confirm_trigger') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 5" class="step step5">
          <div class="narrow-inner-container">
            <div class="ainnersmall">
              <h2>
                <img :src="`${slugs.urls.cdn}/img/obvestila/yij.png`" />
                {{ $t('steps[4].textfirst') }}
              </h2>

              <p class="replaceme centermytext">
                {{ $t('steps[4].textsecond') }}
                <b>{{ email }}</b>
                {{ $t('steps[4].textthird') }} {{ keyword }}.
                {{ $t('steps[4].textfourth') }}
              </p>

              <div style="text-align: center">
                <div
                  v-t="'add_new_trigger'"
                  class="action btn btn-default naprej top50"
                  @click="
                    currentStep = 1;
                    keyword = '';
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transparent-wrapper>
</template>

<script>
import axios from 'axios';
import common from '@/_mixins/common.js';
import TransparentWrapper from '@/_components/TransparentWrapper.vue';
import ToolsTabs from '@/_components/ToolsTabs.vue';

export default {
  name: 'CardToolsNotifications',
  components: {
    TransparentWrapper,
    ToolsTabs,
  },
  mixins: [common],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardState } = this.$root.$options.contextData;

    return {
      currentStep: 1,
      keyword: '',
      matchType: 'siroko',
      frequency: 'event',
      email: '',
      state: cardState || {},
      keywords: [],
      updatedId: '',
      errored: false,
    };
  },
  computed: {
    emailValid() {
      return this.validateEmail(this.email);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getSettings();
    });
  },
  created() {
    this.$notifApi = axios.create({
      baseURL: this.slugs.urls.notifications_api,
    });

    if (this.state.kid) {
      this.confirmCallback(this.state.kid);
    }
  },
  methods: {
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    firstAction() {
      if (this.keyword !== '') {
        this.currentStep += 1;
      }
    },
    submitTrigger() {
      if (this.validateEmail(this.email)) {
        const data = {
          email: this.email,
          keyword: this.keyword,
          reminder: this.frequency,
          mode: this.matchType,
        };

        this.$notifApi.post('/setSettings/', data);

        this.currentStep += 1;
      } else {
        this.errored = true;
      }
    },
    getSettings() {
      const data = {
        uid: this.state.uid,
      };

      this.$notifApi.post('/getSettings/', data).then((r) => {
        this.keywords = r.data.keywords;
      });
    },
    deleteKeyword(keyword) {
      const data = {
        id: keyword.id,
        keyword: keyword.keyword,
        reminder: keyword.reminder,
        mode: keyword.mode,
        delete: true,
        active: true,
        uid: this.state.uid,
      };

      this.$notifApi.post('/updateSettings/', data).then((r) => {
        if (r.data.result) {
          this.keywords.splice(this.keywords.indexOf(keyword), 1);
        }
      });
    },
    reminderCallback(keyword, reminder) {
      const data = {
        id: keyword.id,
        keyword: keyword.keyword,
        reminder,
        mode: keyword.mode,
        delete: false,
        active: true,
        uid: this.state.uid,
      };

      this.$notifApi.post('/updateSettings/', data);
    },
    modeCallback(keyword, mode) {
      const data = {
        id: keyword.id,
        keyword: keyword.keyword,
        reminder: keyword.reminder,
        mode,
        delete: false,
        active: false,
        uid: this.state.uid,
      };

      this.$notifApi.post('/updateSettings/', data);
    },
    confirmCallback(kid) {
      const data = {
        id: kid,
      };

      this.$notifApi.post('/confirmSettings/', data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';
@import 'parlassets/scss/breakpoints';

.centermytext {
  text-align: center !important;
}

.headernew {
  position: relative;
  padding-bottom: 70px;
  max-width: 700px;
  margin: auto;

  .circlebg {
    position: relative;
    z-index: 10;
    background: $background;
    text-align: center;
    font-size: 12px;
    width: 20px;
    height: 20px;
    display: inline-block;
    line-height: 18px;
    border-radius: 50%;
    margin-bottom: 10px;
    /*float: left;*/

    box-shadow: none;
    border: 1px solid $font-placeholder;
    color: $font-placeholder;
  }

  .line {
    position: absolute;
    border-bottom: 1px solid $font-placeholder;
    height: 1px;
    line-height: 1px;
    width: 100%;
    top: 12px;
  }

  .hstepboxnew {
    text-transform: uppercase;
    width: 24.6%;
    display: inline-block;
    overflow: hidden;
    padding-top: 2px;
    text-align: center;

    @include respond-to(mobile) {
      width: 24%;
    }
  }

  .circlebgtext {
    color: $font-placeholder;

    @include respond-to(mobile) {
      font-size: 12px;
    }
  }

  .glyphicon {
    display: none;
  }

  .hstepboxnew.act {
    cursor: pointer;
  }

  &.success .circlebg,
  .done .circlebg {
    display: none;
  }

  &.success .glyphicon,
  .done .glyphicon {
    box-shadow: none;
    border: 1px solid $first;
    color: #ffffff;
    background: $first;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .act .circlebg {
    background: $background;
    border: 1px solid $first;
    box-shadow: none;
    color: $first;
  }

  .act .circlebgtext {
    color: $first;
  }

  .fakeleft,
  .fakeright {
    width: 65px;
    background: $background;
    height: 10px;
    position: absolute;
    top: 5px;

    @include respond-to(mobile) {
      display: none;
    }
  }

  .fakeright {
    right: 0;
    width: 70px;
  }

  @media (max-width: 767px) {
    .headernew .hstepboxnew {
      font-size: 12px;
    }
  }

  @media (max-width: 510px) {
    .headernew .hstepboxnew {
      font-size: 10px;
    }
  }

  @media (max-width: 992px) {
    .headernew .fakeleft {
      width: 65px;
    }

    .headernew .fakeright {
      width: 75px;
    }
  }

  @media (max-width: 768px) {
    .headernew .fakeleft {
      width: 57px;
    }

    .headernew .fakeright {
      width: 57px;
    }
  }

  @media (max-width: 480px) {
    .headernew .fakeleft {
      width: 45px;
    }

    .headernew .fakeright {
      width: 49px;
    }
  }

  @media (max-width: 350px) {
    .headernew .fakeleft {
      width: 36px;
    }

    .headernew .fakeright {
      width: 36px;
    }
  }
}

/*************************/
.radio {
  display: none;

  & + label {
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-weight: 300;
    line-height: 22px;
    padding-left: 32px;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &::before {
      border: 1px solid $font-placeholder;
      border-radius: 50%;
      box-sizing: border-box;
      content: '';
      height: 22px;
      left: 0;
      position: absolute;
      top: 0;
      width: 22px;
    }
  }

  &:checked + label:before {
    background-position: 4px 4px;
    /*background-image: url('data:image/svg+xml;utf8,<svg version="1.1"      xmlns="http://www.w3.org/2000/svg"      xmlns:xlink="http://www.w3.org/1999/xlink"      x="0px" y="0px"      enable-background="new 0 0 5 2"      xml:space="preserve"      viewBox="0 0 5 2"      preserveAspectRatio="xMinYMid slice">   <circle cx="1" cy="1" r="1" fill="$first"/> </svg>');*/
    background-color: $first;
    border: 2px solid $font-placeholder;
    background-size: 12px 12px;
    background-repeat: no-repeat;
  }
}

.checkbox + label {
  font-size: 14px;
}

/*************************/

.step {
  display: block;
}

h2 {
  font-weight: 500;
  color: $font-default;
  text-align: center;
}

label {
  color: $font-default;
}

.ainnerbig {
  width: 500px;
  text-align: left;
  display: inline-block;
}

.ainnersmall {
  width: 370px;
  text-align: left;
  display: inline-block;
}

.step1 p {
  display: inline-block;
  float: left;
  width: 85%;
  font-size: 16px;
  font-family: 'Roboto Slab', sans-serif;
}

.step1 span {
  display: inline-block;
  float: left;
  width: 15%;
  line-height: 30px;
  color: #dbdbdb;
  text-align: left;
  font-family: 'Roboto Slab', sans-serif;
}

.form-control {
  border-right: 1px solid;
  border-radius: 0;
  border-right: medium none;
  font-size: 20px;
  height: 50px;
  border-color: $font-placeholder;
  border-right: none;
}

.naprej {
  margin: auto;
  position: relative;
  width: auto;
  text-align: center;
  color: $white;
  padding: 13px 30px;
  background-color: $first;
  cursor: pointer;
  margin-top: 0px;
  display: inline-block;

  border: none;
  border-radius: 0;
  height: 50px;
  -webkit-transition: border-color 0.15s;
  transition: border-color 0.15s;

  background-color: $tab-active;

  line-height: 25px;

  &:hover {
    color: $white;
    background-color: $tab-hover;
    text-decoration: none;
  }

  &.active {
    color: $white;
    background-color: $tab-active;
    text-decoration: none;
  }
}

.nazaj {
  margin: auto;
  position: relative;
  width: auto;
  text-align: center;
  color: $first;
  background: none;
  padding: 13px 30px;
  cursor: pointer;
  margin-top: 0px;
  display: inline-block;
  border: 1px solid $font-placeholder;
  border-radius: 0;
  height: 50px;
  -webkit-transition: border-color 0.15s;
  transition: border-color 0.15s;

  line-height: 25px;
}

.btn.w50 {
  width: 49%;

  @include respond-to(mobile) {
    width: 100% !important;
    margin-top: 10px !important;
  }
}

.nazaj:focus {
  outline: none;
}

.disabled {
  margin: auto;
  position: relative;
  width: auto;
  text-align: center;
  color: $font-placeholder;
  padding: 13px 30px;
  background-color: $font-placeholder;
  cursor: auto;
  margin-top: 0px;
  display: inline-block;

  border-color: $font-placeholder;
  border-left: none;
  border-radius: 0;
  height: 50px;
  -webkit-transition: border-color 0.15s;
  transition: border-color 0.15s;
}

ul {
  list-style: none;
  margin: 20px 0 0 0px;
  padding: 0;
}

ul li {
  text-align: left;
  margin-bottom: 20px;
}

.searchinfo {
  top: 15px;
  right: -30px;
  text-align: center;
}

.help-info {
}

.help-info .searchinfo {
  display: inline-block;
  position: unset;
  margin-left: 10px;
}

.top50 {
  margin-top: 50px;
}

.header {
  padding-top: 20px;
  padding-bottom: 70px;
}

.header .hstepbox {
  text-transform: uppercase;
  color: $first;
  width: 24.5%;
  display: inline-block;
  overflow: hidden;
  float: left;
  padding-top: 2px;
}

.header .hstepbox.act {
  cursor: pointer;
}

.header .circlebg {
  box-shadow: 0px 0px 2px $first;
  color: $first;
  text-align: center;
  font-size: 12px;
  width: 20px;
  height: 20px;
  display: inline-block;
  line-height: 20px;
  border-radius: 50%;
  float: left;
  margin-bottom: 10px;
}

.header .glyphicon {
  display: none;
}

.header .circlebglineleft,
.header .circlebglineright {
  background: $first;
  height: 1px;
  display: inline-block;
  width: 42.7%;
  float: left;
  margin-top: 9px;
  margin-bottom: 20px;
}

.header .hstepbox .circlebglineleft.nobg,
.header .hstepbox .circlebglineright.nobg,
.header .hstepbox.grey .circlebglineright.nobg {
  background: none;
}

/* .header .greybg{*/
/*background: grey;*/
/*}*/
/* .header .greycolor{*/
/*color: grey;*/
/*box-shadow: 0px 0px 2px grey;*/
/*}*/
.header .grey {
  color: #dbdbdb;
}

.header .hstepbox.grey .circlebglineleft {
  background: #dbdbdb;
}

.header .hstepbox.grey .circlebg {
  color: #dbdbdb;
  box-shadow: 0px 0px 2px #dbdbdb;
}

.header .hstepbox.grey .circlebglineright {
  background: #dbdbdb;
}

.header.success .hstepbox {
  color: $first;
}

.header.success .circlebglineleft {
  color: $first;
  background: $first;
}

.header.success .circlebg,
.header .done .circlebg {
  display: none;
}

.header.success .glyphicon,
.header .done .glyphicon {
  box-shadow: 0px 0px 2px $first;
  color: #ffffff;
  background: $first;
  width: 20px;
  float: left;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  display: inline-block;
  font-size: 12px;
}

.header.success .circlebglineright {
  color: $first;
  background: $first;
}

.simplebox {
  border-right: 1px solid $font-placeholder;
}

.keyword.error,
.email.error {
  border: 1px solid red;
}

/***********/

#obvestila.settings h2 {
  text-align: left;
  margin-bottom: 0;
}

h2.left {
  text-align: left;
}

#obvestila.settings .narrow-inner-container {
  text-align: left;
  margin: 0 0 20px 330px;
}

#obvestila.settings h2 span {
  text-transform: lowercase;
}

#obvestila.settings .header {
  padding-top: 20px;
  padding-bottom: 0;
}

.search-dropdown-input {
  padding: 6px 19px 6px 8px;
  font-size: 12px;
}

.search-dropdown-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
}

.search-dropdown::after {
  right: 4px;
  top: 11px;
}

.parta1,
.parta2 {
  /*width: 175px;*/
  width: 49.5%;
  // margin-right: 10px;
  display: inline-block;
  // float: left;

  @include respond-to(mobile) {
    width: 100%;
    margin-bottom: 10px;
  }
}

.parta3 {
  /*width: auto;*/
  width: auto;
  text-align: left;
  display: block;
  float: none;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
}

.parta4 {
  /*width: 30px;*/
  width: auto;
  display: inline-block;
  /*float: none;*/
  font-size: 12px;
  /*line-height: 30px;*/
  cursor: pointer;
  padding-left: 20px;
  // float: right;
  line-height: 36px;
  position: absolute;
  right: 0;
  top: 7px;
}

.parta5 {
  /*width: 30px;*/
  width: 37%;
  display: inline-block;
  float: left;
  font-size: 12px;
  line-height: 30px;
  cursor: pointer;
}

.obvestiladatatpl {
  margin-bottom: 10px;
  padding-bottom: 0;
  font-size: 12px;
  line-height: 30px;
  border-bottom: none;
  display: inline-block;
  width: 100%;
  border-top: 2px solid $font-placeholder;
  // padding-top: 10px;
  // padding-left: 15px;
  // padding-right: 15px;
  padding: 0;
  position: relative;
}

.replaceme {
  color: $font-default;
  text-align: left;
}

.obvestiladelete .glyphicon {
  border: 2px solid $font-default;
  border-radius: 4px;
  padding: 1px;
}

.obvestiladelete .exclude-presiding {
  width: 25px;
  height: 25px;
  padding: 0 5px;
  overflow: hidden;
  background-color: $tab-active;
}

.obvestiladelete .exclude-presiding:hover {
  background-color: $tab-hover;
}

.updatedid {
  background: #d8e7ee;
  margin-bottom: 30px;
  display: block;
}

.responseText {
  background: #d8e7ee;
  margin-bottom: 30px;
  display: block;
  padding: 10px 10px 1px 10px;
  text-align: left;
}

.responseText span {
  color: $first;
}

#obvestila.settings .search-dropdown-input {
  background: #f0f0f0;
}

#obvestila.settings .padding15 {
  padding: 10px;
}

#obvestila.settings .obvestilaKeyword {
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 109px;
  line-height: 40px;
}

#obvestila.settings h4 .glyphicon {
  color: #0ca0de;
  margin-right: 10px;
  font-weight: 100;
}

#obvestila.settings h4 {
  font-weight: 300;
}

#obvestila.settings hr {
  border-top: 1px solid $font-default;
  margin: 0 0 30px 0;
}

#obvestila.settings .replaceme {
  color: $font-default;
  display: inline-block;
}

@media (max-width: 767px) {
  .header .hstepbox {
    width: 22.5%;
    font-size: 12px;
  }

  .header .circlebglineleft,
  .header .circlebglineright {
    width: 39.7%;
  }
}

@media (max-width: 510px) {
  .header .hstepbox {
    width: 23.5%;
    font-size: 10px;
  }

  .header .circlebglineleft,
  .header .circlebglineright {
    width: 32.7%;
  }
}

@media (max-width: 992px) {
  #obvestila.settings .narrow-inner-container {
    text-align: left;
    margin: 0 0 20px 0px;
  }

  .ainnerbig {
    width: auto;
  }

  .ainnersmall {
    width: auto;
  }
}

@media (max-width: 480px) {
  .step1 p {
    width: 75%;
  }

  .step1 span {
    width: 25%;
  }
}

.errored {
  border: 2px solid $first;
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.new-trigger-container {
  text-align: center;
}
</style>
