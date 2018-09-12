<template>
  <transparent-wrapper :id="$options.cardData.cardData._id" :card-url="url" :header-config="headerConfig" :og-config="ogConfig">

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
      <div
        v-if="currentStep === 1"
        class="step step1"
      >
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
              >

              <div class="input-group-btn" style="padding-left: 10px;">
                <div
                  v-t="'add'"
                  @click="firstAction"
                  class="action btn btn-default naprej"
                ></div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <br>
                <br>
                <span><img src="https://obvestila.parlameter.si/static/ena.png"> </span>
                <p v-t="'steps[0].textfirst'">
                </p>
              </div>
              <div class="col-md-12">
                <br>
                <br>
                <span><img src="https://obvestila.parlameter.si/static/dva.png"></span>
                <p v-t="'steps[0].textsecond'">
                </p>
              </div>
            </div>
          </div>


        </div>


      </div>
      <div
        v-if="currentStep === 2"
        class="step step2"
      >
        <div class="narrow-inner-container">
          <div class="ainnersmall">
            <h2 v-t="'steps[1].textfirst'" class="left"></h2>
            <ul>
              <li>
                <div class="exclude-presiding checkbox-twolines">
                  <input id="modenatancno" type="radio" name="match_mode[]" value="natancno" checked="checked" class="radio">
                  <label for="modenatancno">{{ $t('steps[1].firstbullet') }} <span class="fillkeyword">"{{ keyword }}"</span></label>
                </div>
              </li>
              <li>
                <div class="exclude-presiding checkbox-twolines">
                  <input id="modesiroko" type="radio" name="match_mode[]" value="siroko" class="radio">
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
      <div
        v-if="currentStep === 3"
        class="step step3"
      >
        <div class="narrow-inner-container">
          <div class="ainnersmall">
            <h2 class="left">{% trans 'Kako pogosto naj ti pišemo' %}</h2>

            <ul>
              <li>
                <div class="exclude-presiding checkbox-twolines"><input id="reminderevent" type="radio" name="reminder[]" value="event" class="radio" checked="checked"> <label for="reminderevent">{% trans 'ob dogodku' %}</label></div>
              </li>
              <li>
                <div class="exclude-presiding checkbox-twolines"><input id="reminderday" type="radio" name="reminder[]" value="day" class="radio">
                  <label for="reminderday">{% trans 'največ enkrat na dan' %}</label></div>
              </li>
              <li>
                <div class="exclude-presiding checkbox-twolines"><input id="reminderweek" type="radio" name="reminder[]" value="week" class="radio">
                  <label for="reminderweek">{% trans 'največ enkrat na teden' %}</label></div>
              </li>
            </ul>

            <div class="action btn btn-default nazaj top50 w50" data-step="2">
              <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
              {% trans 'Nazaj' %}
            </div>
            <div class="action btn btn-default naprej top50 w50" data-step="4">
              {% trans 'Nadaljuj' %}
            </div>
          </div>
        </div>

      </div>
      <div
        v-if="currentStep === 4"
        class="step step4"
      >
        <div class="narrow-inner-container">
          <div class="ainnersmall">
            <h2>{% trans 'Samo še tvoj e-naslov' %}</h2>

            <div class="search">
              <input type="email" name="email" class="form-control simplebox email" required />

              <div class="action btn btn-default nazaj top50 w50" data-step="3">
                <span class="glyphicon glyphicon-arrow-left">&nbsp;</span>
                {% trans 'Nazaj' %}
              </div>
              <div class=" btn btn-default naprej disabled top50 w50" data-step="5" id="obvestilasubmitNew">
                {% trans 'Nastavi opomnik' %}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentStep === 5"
        class="step step5"
      >
        <div class="narrow-inner-container">
          <div class="ainnersmall">
            <h2><img src="https://obvestila.parlameter.si/static/yij.png">{% trans ' Zabeleženo!' %}</h2>

            <p class="replaceme">
              {% trans 'Na e-naslov <b>#email#</b> si vklopil/-a obvestila za iskalni niz "#keyword#". Povezava za
              potrditev naročila in urejanje drugih nastavitev te čaka na mejlu.' %}
            </p>

            <div style="text-align: center">
              <div class="action btn btn-default naprej top50 w50" data-step="1">
                {% trans 'Dodaj nov opomnik' %}
              </div>
            </div>

          </div>
        </div>


      </div>
    </div>
    <!-- Card content goes here -->
  </transparent-wrapper>
</template>

<script>
import common from 'mixins/common';
import TransparentWrapper from 'components/TransparentWrapper.vue';

export default {
  // TODO: remove eslint comment
  // eslint-disable-next-line vue/name-property-casing
  name: 'Obvestila',
  components: {
    TransparentWrapper,
  },
  mixins: [common],
  data() {
    return {
      currentStep: 1,
      keyword: '',
      data: this.$options.cardData.data,
      headerConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/altHeaders'
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$t('card.title'),
      },
      ogConfig: {
        // TODO: fix this when developing card
        // best if you include a mixin from 'mixins/ogImages'
      },
    };
  },

  computed: {
    emailValid() {
      return this.validateEmail(this.email);
    },
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
}

.headernew .circlebg {
    position: relative;
    z-index: 10;
    background: #f0f0f0;
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
    border: 1px solid #c8c8c8;
    color: #c8c8c8;
}

.headernew .line {
    position: absolute;
    border-bottom: 1px solid #c8c8c8;
    height: 1px;
    line-height: 1px;
    width: 100%;
    top: 12px;
}

.headernew .hstepboxnew {
    text-transform: uppercase;
    width: 24.5%;
    display: inline-block;
    overflow: hidden;
    padding-top: 2px;
    text-align: center;
}

.headernew .circlebgtext {
  color: #c8c8c8;
}

.headernew .glyphicon {
    display: none;
}

.headernew .hstepboxnew.act {
    cursor: pointer;
}

.headernew.success .circlebg,
.headernew .done .circlebg {
    display: none;
}

.headernew.success .glyphicon,
.headernew .done .glyphicon {
    box-shadow: none;
    border: 1px solid #009cdd;
    color: #ffffff;
    background: #009cdd;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-size: 12px;
    margin-bottom:10px;
}

.headernew .act .circlebg {
    background: #f0f0f0;
    border: 1px solid #009cdd;
    box-shadow: none;
    color: #009cdd;
}
.headernew .act .circlebgtext{
    color: #009cdd;
}

.headernew .fakeleft,
.headernew .fakeright {
    width: 65px;
    background: #f0f0f0;
    height: 10px;
    position: absolute;
    top: 5px;
}

.headernew .fakeright {
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
/*************************/
.radio {
    display: none;
}

.radio + label {
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
}

.radio + label:before {
    border: 1px solid #c8c8c8;
    border-radius: 50%;
    box-sizing: border-box;
    content: '';
    height: 22px;
    left: 0;
    position: absolute;
    top: 0;
    width: 22px;
}

.radio:checked + label:before {
    background-position: 4px 4px;
    /*background-image: url('data:image/svg+xml;utf8,<svg version="1.1"      xmlns="http://www.w3.org/2000/svg"      xmlns:xlink="http://www.w3.org/1999/xlink"      x="0px" y="0px"      enable-background="new 0 0 5 2"      xml:space="preserve"      viewBox="0 0 5 2"      preserveAspectRatio="xMinYMid slice">   <circle cx="1" cy="1" r="1" fill="#009cdd"/> </svg>');*/
    background-color: #009cdd;
    border: 2px solid #eaeaea;
    background-size: 12px 12px;
    background-repeat: no-repeat;
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
    color: #525252;
    text-align: center;
}

label {
    color: #525252;
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
    border-right: 1px solid #c8c8c8;
    border-radius: 0;
    border-right: medium none;
    font-size: 20px;
    height: 50px;
    border-color: #c8c8c8;
    border-right: none;
}

.naprej {
    margin: auto;
    position: relative;
    width: auto;
    text-align: center;
    color: #ffffff;
    padding: 13px 30px;
    background-color: #009cdd;
    cursor: pointer;
    margin-top: 0px;
    display: inline-block;

    border-color: #c8c8c8;
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
    color: #009cdd;
    background: none;
    padding: 13px 30px;
    cursor: pointer;
    margin-top: 0px;
    display: inline-block;
    border: 1px solid #c8c8c8;
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
    color: #ffffff;
    padding: 13px 30px;
    background-color: #c8c8c8;
    cursor: auto;
    margin-top: 0px;
    display: inline-block;

    border-color: #c8c8c8;
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
    color: #009cdd;
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

    box-shadow: 0px 0px 2px #009cdd;
    color: #009cdd;
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
    background: #009cdd;
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
    color: #009cdd;
}

.header.success .circlebglineleft {
    color: #009cdd;
    background: #009cdd;
}

.header.success .circlebg,
.header .done .circlebg {
    display: none;
}

.header.success .glyphicon,
.header .done .glyphicon {
    box-shadow: 0px 0px 2px #009cdd;
    color: #ffffff;
    background: #009cdd;
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
    color: #009cdd;
    background: #009cdd;
}

.simplebox {
    border-right: 1px solid #c8c8c8;
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
    width:100%;
}

.replaceme {
    color: #525252;
    text-align: left;
}

.obvestiladelete .glyphicon {
    border: 2px solid #525252;
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
    color: #009cdd;
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
    border-top: 1px solid #525252;
    margin: 0 0 30px 0;
}

#obvestila.settings .replaceme {
    color: #525252;
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
</style>