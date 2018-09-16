<template>
  <div :id="$options.cardData.cardData._id">
    <generator>
      <div slot="generator">
        <tools-tabs current-tool="notifications" />
      </div>
      <transparent-wrapper
        :card-url="url"
        :header-config="headerConfig"
        :og-config="ogConfig"
      >

        <div v-if="state.settings && state.uid">
          <form id="obvestilaData">
            <div class="content">
              <div class="">
                <div class="narrow-inner-container">
                  <div class="ainnersmall">
                    <div class="replaceme padding15">
                      <hr>
                      <div
                        v-for="keyword in keywords"
                        :key="keyword.id"
                        :class="['obvestiladatatpl', 'clearfix', {'updatedid': (keyword.id === updatedId)}]"
                      >
                        <div class="">
                          <div class="search padding15">
                            <div
                              v-if="keyword.id === updatedId"
                              class="updatedText"
                            >
                              <h4><span class="glyphicon glyphicon-ok"></span> Uspešno potrjeno!</h4>
                            </div>

                            <div class="parta1">
                              <div class="search-dropdown">
                                <select
                                  :name="`reminder${keyword.id}`"
                                  :id="`reminder${keyword.id}`"
                                  class="search-dropdown-input reminder"
                                >
                                  <option @click="reminderCallback(keyword, 'event')" value="event" :selected="keyword.reminder === 'event'">{{ $t('events.event') }}</option>
                                  <option @click="reminderCallback(keyword, 'day')" value="day" :selected="keyword.reminder === 'day'">{{ $t('events.day') }}</option>
                                  <option @click="reminderCallback(keyword, 'week')" value="week" :selected="keyword.reminder === 'week'">{{ $t('events.week') }}</option>
                                </select>
                              </div>
                            </div>

                            <div class="parta3">
                              <div :id="`obvestilaKeyword_${keyword.id}`" class="obvestilaKeyword">
                                {{ keyword.keyword }}
                              </div>
                              <input :id="`keyword${keyword.id}`" :value="keyword.keyword" type="hidden">
                            </div>

                            <div class="parta4" @click="deleteKeyword(keyword)">
                              <div class="obvestiladelete">
                                <div class="exclude-presiding checkbox-twolines">
                                  <label
                                    :id="`delete${keyword.id}`"
                                    data-deleted="false"
                                    class="glyphicon glyphicon-remove"
                                  ></label>
                                </div>
                              </div>
                            </div>

                            <div class="parta2">
                              <div class="search-dropdown">
                                <select
                                  :name="`match_mode${keyword.keyword}`"
                                  :id="`match_mode${keyword.keyword}`"
                                  class="search-dropdown-input match_mode"
                                >
                                  <option @click="modeCallback(keyword, 'natancno')" value="natancno" :selected="keyword.match_mode === 'natancno'">{{ $t('modes.precise') }}</option>
                                  <option @click="modeCallback(keyword, 'siroko')" value="obe" :selected="keyword.match_mode === 'siroko'">{{ $t('modes.broad') }}</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--Nastavitve so spremenjene.-->
                    </div>
                    <div class="padding15">
                      <br>
                      <br>
                      <br>
                      <a v-t="'add_new_trigger'" href="./" class="btn btn-default naprej"></a>
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

            <div :class="['hstepboxnew', 'hstep1', {'act': currentStep === 1}]">
              <div class="fakeleft"></div>
              <div class="circlebg"> 1</div>
              <div class="glyphicon glyphicon-ok"></div>
              <div v-t="'trigger'" class="circlebgtext"></div>
            </div>
            <div :class="['hstepboxnew', 'hstep2', {'act': currentStep === 2}]">
              <div class="circlebg"> 2</div>
              <div class="glyphicon glyphicon-ok"></div>
              <div v-t="'match'" class="circlebgtext"></div>
            </div>
            <div :class="['hstepboxnew', 'hstep3', {'act': currentStep === 3}]">
              <div class="circlebg"> 3</div>
              <div class="glyphicon glyphicon-ok"></div>
              <div v-t="'interval'" class="circlebgtext"></div>
            </div>
            <div :class="['hstepboxnew', 'hstep4', {'act': currentStep === 4}]">
              <div class="circlebg"> 4</div>
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
                    <input v-model="keyword" type="text" name="keyword" class="form-control simplebox keyword" @keyup.enter="firstAction">

                    <div class="input-group-btn" style="padding-left: 10px;">
                      <div
                        v-t="'add'"
                        class="action btn btn-default naprej"
                        @click="firstAction"
                      ></div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-12">
                      <br>
                      <br>
                      <span><img :src="`${slugs.urls.cdn}/img/obvestila/ena.png`"> </span>
                      <p v-t="'steps[0].textfirst'">
                      </p>
                    </div>
                    <div class="col-md-12">
                      <br>
                      <br>
                      <span><img :src="`${slugs.urls.cdn}/img/obvestila/dva.png`"></span>
                      <p v-t="'steps[0].textsecond'">
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 2" class="step step2">
              <div class="narrow-inner-container">
                <div class="ainnersmall">
                  <h2
                    v-t="'steps[1].textfirst'"
                    class="left"
                  ></h2>
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
                        >
                        <label for="modenatancno">{{ $t('steps[1].firstbullet') }} <span class="fillkeyword">"{{ keyword }}"</span></label>
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
                        >
                        <label for="modesiroko">{{ $t('steps[1].secondbullet') }} <span class="fillkeyword">{{ keyword }}</span></label>
                      </div>
                    </li>
                  </ul>

                  <div class="action btn btn-default nazaj top50 w50" @click="currentStep -= 1">
                    <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
                    {{ $t('back') }}
                  </div>
                  <div class="action btn btn-default naprej top50 w50" @click="currentStep += 1">
                    {{ $t('continue') }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 3" class="step step3">
              <div class="narrow-inner-container">
                <div class="ainnersmall">
                  <h2
                    v-t="'steps[2].textfirst'"
                    class="left"
                  ></h2>
                  <ul>
                    <li>
                      <div class="exclude-presiding checkbox-twolines">
                        <input id="reminderevent" type="radio" name="reminder[]" v-model="frequency" value="event" class="radio" checked="checked">
                        <label v-t="'steps[2].textsecond'" for="reminderevent"></label>
                      </div>
                    </li>
                    <li>
                      <div class="exclude-presiding checkbox-twolines">
                        <input id="reminderday" type="radio" name="reminder[]" v-model="frequency" value="day" class="radio">
                        <label v-t="'steps[2].textthird'" for="reminderday"></label>
                      </div>
                    </li>
                    <li>
                      <div class="exclude-presiding checkbox-twolines">
                        <input id="reminderweek" type="radio" name="reminder[]" v-model="frequency" value="week" class="radio">
                        <label v-t="'steps[2].textfourth'" for="reminderweek"></label>
                      </div>
                    </li>
                  </ul>

                  <div class="action btn btn-default nazaj top50 w50" @click="currentStep -= 1">
                    <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
                    {{ $t('back') }}
                  </div>
                  <div class="action btn btn-default naprej top50 w50" @click="currentStep += 1">
                    {{ $t('continue') }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 4" class="step step4">
              <div class="narrow-inner-container">
                <div class="ainnersmall">
                  <h2 v-t="'steps[3].textfirst'"></h2>

                  <div class="input-group search1">
                    <input
                      v-model="email"
                      :class="['form-control', 'simplebox email', {errored: errored}]"
                      type="text"
                      name="email"
                      required
                    ></input>

                    <div class="action btn btn-default nazaj top50 w50" @click="currentStep -= 1">
                      <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
                      {{ $t('back') }}
                    </div>
                    <div class="action btn btn-default naprej top50 w50" @click="submitTrigger">
                      {{ $t('confirm_trigger') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 5" class="step step5">
              <div class="narrow-inner-container">
                <div class="ainnersmall">
                  <h2><img :src="`${slugs.urls.cdn}/img/obvestila/yij.png`">{{ $t('steps[4].textfirst') }}</h2>

                  <p class="replaceme">
                    {{ $t('steps[4].textsecond') }} <b>{{ email }}</b> {{ $t('steps[4].textthird') }} {{ keyword }}. {{ $t('steps[4].textfourth') }}
                  </p>

                  <div style="text-align: center">
                    <div
                      v-t="'add_new_trigger'"
                      class="action btn btn-default naprej top50 w50"
                      @click="currentStep = 1; keyword = '';"
                    ></div>
                  </div>

                </div>
              </div>


            </div>
          </div>
        </div>
        <!-- Card content goes here -->
      </transparent-wrapper>
    </generator>
  </div>
</template>

<script>
import axios from 'axios';
import common from 'mixins/common';
import TransparentWrapper from 'components/TransparentWrapper.vue';
import Generator from 'components/Generator.vue';
import ToolsTabs from 'components/ToolsTabs.vue';

export default {
  // TODO: remove eslint comment
  // eslint-disable-next-line vue/name-property-casing
  name: 'Obvestila',
  components: {
    TransparentWrapper,
    Generator,
    ToolsTabs,
  },
  mixins: [common],
  data() {
    return {
      currentStep: 1,
      keyword: '',
      matchType: 'siroko',
      frequency: 'event',
      email: '',
      data: this.$options.cardData.data,
      headerConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/altHeaders'
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$t('card.title'),
      },
      ogConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/ogImages'
      },
      state: this.$options.cardData.parlaState,
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

  methods: {
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

        const obvestila = axios.create({
          baseURL: 'https://obavijesti.parlametar.hr', // TODO this.slugs.urls.obvestila
        });
        obvestila.post('/setSettings/', data);

        this.currentStep += 1;
      } else {
        this.errored = true;
      }
    },
    getSettings() {
      const settings = axios.create({
        baseUrl: 'https://obavijesti.parlametar.hr', // TODO this.slugs.urls.obvestila
      });

      const data = {
        uid: this.state.uid,
      };

      settings.post('https://obavijesti.parlametar.hr/getSettings/', data).then((r) => {
        console.log(r);
        this.keywords = r.data.keywords;
      });
    },
    deleteKeyword(keyword) {
      const settings = axios.create({
        baseUrl: 'https://obavijesti.parlametar.hr', // TODO this.slugs.urls.obvestila
      });

      const data = {
        id: keyword.id,
        keyword: keyword.keyword,
        reminder: keyword.reminder,
        mode: keyword.match_mode,
        delete: true,
        active: false,
        uid: this.state.uid,
      };

      settings.post('https://obavijesti.parlametar.hr/updateSettings/', data).then((r) => {
        if (r.data.result) {
          this.keywords.splice(this.keywords.indexOf(keyword), 1);
        }
      });
    },
    reminderCallback(keyword, reminder) {
      const settings = axios.create({
        baseUrl: 'https://obavijesti.parlametar.hr', // TODO this.slugs.urls.obvestila
      });

      const data = {
        id: keyword.id,
        keyword: keyword.keyword,
        reminder,
        mode: keyword.match_mode,
        delete: false,
        active: false,
        uid: this.state.uid,
      };

      settings.post('https://obavijesti.parlametar.hr/updateSettings/', data);
    },
    modeCallback(keyword, mode) {
      const settings = axios.create({
        baseUrl: 'https://obavijesti.parlametar.hr', // TODO this.slugs.urls.obvestila
      });

      const data = {
        id: keyword.id,
        keyword: keyword.keyword,
        reminder: keyword.reminder,
        mode,
        delete: false,
        active: false,
        uid: this.state.uid,
      };

      settings.post('https://obavijesti.parlametar.hr/updateSettings/', data);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/colors';

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
      width: 24.5%;
      display: inline-block;
      overflow: hidden;
      padding-top: 2px;
      text-align: center;
    }

    .circlebgtext {
      color: $font-placeholder;
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

    &+label {
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

    &:checked+label:before {
      background-position: 4px 4px;
      /*background-image: url('data:image/svg+xml;utf8,<svg version="1.1"      xmlns="http://www.w3.org/2000/svg"      xmlns:xlink="http://www.w3.org/1999/xlink"      x="0px" y="0px"      enable-background="new 0 0 5 2"      xml:space="preserve"      viewBox="0 0 5 2"      preserveAspectRatio="xMinYMid slice">   <circle cx="1" cy="1" r="1" fill="$first"/> </svg>');*/
      background-color: $first;
      border: 2px solid $font-placeholder;
      background-size: 12px 12px;
      background-repeat: no-repeat;
    }
  }

  .checkbox+label {
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
    font-family: "Roboto Slab", sans-serif;
  }

  .step1 span {
    display: inline-block;
    float: left;
    width: 15%;
    line-height: 30px;
    color: #dbdbdb;
    text-align: left;
    font-family: "Roboto Slab", sans-serif;

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

    border-color: $font-placeholder;
    border-left: none;
    border-radius: 0;
    height: 50px;
    -webkit-transition: border-color 0.15s;
    transition: border-color 0.15s;
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
  }

  .btn.w50 {
    width: 49%;
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

  .help-info {}

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

  .parta1 {
    /*width: 175px;*/
    width: 165px;
    margin-right: 15px;
    display: inline-block;
    float: left;
  }

  .parta1 .search-dropdown-input {
    /*width: 172px;*/
    width: 162px;
  }

  .parta2 {
    /*width: 231px;*/
    width: 231px;
    margin-right: 15px;
    display: inline-block;
    float: left;
  }

  .parta2 .search-dropdown-input {
    /*width: 228px;*/
    width: 228px;
  }

  .parta3 {
    /*width: auto;*/
    width: auto;
    text-align: left;
    display: inline-block;
    float: none;
    font-size: 12px;
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
    float: right;
    line-height: 36px;
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
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>