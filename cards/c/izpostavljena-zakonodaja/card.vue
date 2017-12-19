<template>
    <card-wrapper
            class="card-halfling card-featured-legislation"
            :id="$options.cardData.cardData._id"
            :card-url="url"
            :header-config="headerConfig"
            contentHeight="518px">

        <div slot="info">
            <p class="info-text lead">Iz nabora vseh zakonov, obravnavanih v tem sklicu, izberemo šest takšnih, ki so še v obravnavi in šest takšnih, ki so bili nedavno sprejeti.</p>
            <p class="info-text heading">METODOLOGIJA</p>
            <p class="info-text">Izpostavljene zakone kot edino stvar na Parlametru določamo uredniško in sicer glede na to, koliko zanimanja zanje zaznamo v medijih in civilni družbi.</p>
        </div>

        <div class="p-tabs-2col legislation">
            <p-tabs :start-tab="selectedTab">
                <p-tab label="Trenutno v obravnavi">
                    <div class="row">
                        <div class="col-xs-12 col-sm-6 legislation__wrapper" v-for="legislation in data.accepted">
                            <a :href="slugs.legislationLink + legislation.epa"></a>
                            <div class="legislation__single">
                                <div class="icon">
                                    <div class="img-circle circle"><img v-if="legislation.icon" :src="'https://cdn.parlameter.si/v1/parlassets/icons/legislation/' + legislation.icon" /></div>
                                </div>

                                <div class="text">
                                    {{ legislation.text}}
                                </div>
                            </div>
                        </div>
                    </div>

                </p-tab>
                <p-tab label="Nedavno sprejeto">
                    <div class="legislation row">
                        <div class="col-sm-6 legislation__wrapper" v-for="legislation in data.under_consideration">
                            <a :href="slugs.legislationLink + legislation.epa"></a>
                            <div class="legislation__single">
                                <div class="icon">
                                    <div class="img-circle circle"><img v-if="legislation.icon" :src="'https://cdn.parlameter.si/v1/parlassets/icons/legislation/' + legislation.icon" /></div>
                                </div>

                                <div class="text">
                                    {{ legislation.text}}
                                </div>
                            </div>
                        </div>
                    </div>
                </p-tab>
            </p-tabs>
            <div class="legislation__all">
                <a :href="`https://parlameter.si${slugs.legislationLink}`">VSA ZAKONODAJA</a>
            </div>
        </div>

    </card-wrapper>
</template>

<script>
  import common from 'mixins/common';

  import PTab from 'components/Tab.vue';
  import PTabs from 'components/Tabs.vue';

  export default {
    components: { PTab, PTabs },
    mixins: [common],
    name: 'IzpostavljenaZakonodaja',
    data() {
      console.log(this.$options.cardData.data)
      return {
        data: this.$options.cardData.data,
        state: this.$options.cardData.parlaState || {},
        selectedTab: 0,
        headerConfig: {
          circleIcon: 'og-list',
          heading: '&nbsp;',
          alternative: this.$options.cardData.cardData.altHeader === 'true',
          title: this.$options.cardData.cardData.name,
        },
      };
    },
    methods: {
      measurePiwik(filter, sort, order) {
        if (typeof measure === 'function') {
          if (sort !== '') {
            measure('s', 'session-sort', `${sort} ${order}`, '');
          } else if (filter !== '') {
            measure('s', 'session-filter', filter, '');
          }
        }
      },
    },
    created() {
      if (this.state.selectedTab) {
        this.selectedTab = this.state.selectedTab;
      }
    }
  };
</script>

<style lang="scss" scoped>

    @import '~parlassets/scss/breakpoints';
    @import '~parlassets/scss/colors';

    .legislation {
        overflow: hidden;

        .tab-content {
            margin-top: 15px;
            overflow-y: auto;
            height: 420px;
        }

        &__single {
            background: $grey;
            color: $black;
            display: flex;
            align-items: center;
            height: 125px;
            padding: 13px 12px 11px;

            .text {
                line-height: 18px;
                font-weight: 300;
                font-size: 14px;
            }

            .circle {
                height: 101px;
                width: 102px;
                background-color: $white;
                padding: 27px 15px 24px 27px;
            }

            .icon {
                margin-right: 32px;
            }
        }

        &__wrapper {
            margin-bottom: 15px;

            &:nth-child(odd)  {
                @include respond-to(desktop) {
                    padding-right: 7px;
                }
            }

            &:nth-child(even) {
                @include respond-to(desktop) {
                    padding-left: 7px;
                }
            }
        }

        &__all {
            position: absolute;
            left: 0;
            bottom: 0;
            padding: 4px 20px 15px 20px;
            background: #ffffff;
            width: 100%;

            a {
                padding: 3px;
                padding-left: 32px;
                background: url(https://cdn.parlameter.si/v1/parlassets/icons/zakonodaja-modra.svg) no-repeat top left;
                font-size: 14px;
                font-weight: 400;
                color: #227497;
            }
        }

    }


</style>
