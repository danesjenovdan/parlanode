<template>
    <card-wrapper
            class="card-halfling card-featured-legislation"
            :id="$options.cardData.cardData._id"
            :card-url="url"
            :header-config="headerConfig">

        <div slot="info">
            <p class="info-text lead">
                Pregled osnovnih informacij poslanske skupine.
            </p>
            <p class="info-text heading">METODOLOGIJA</p>
            <p class="info-text">
                Vsebine za to kartico smo pridobili s spletnega mesta DZ RS (poslanska skupina, starost, članstva v delovnih telesih) in s spletnega mesta DVK (število prejetih glasov). Za ostale vsebine smo se obrnili na PR službe poslanskih skupin. Podatke so nam posredovali iz NSi, SD, (takrat še) ZaAB in ZL. SMC so nas usmerili na svoje spletno mesto, SDS pa na spletno mesto državnega zbora. Manjkajoče podatke smo pridobili s pomočjo iskalnika Google in jih za morebitne popravke pred objavo ponudili vsem poslanskim skupinam.
            </p>
        </div>

        <div class="p-tabs-2col">
            <p-tabs :start-tab="selectedTab">
                <p-tab label="Pregled">
                    <div class="legislation row">
                        <div class="col-xs-12 col-sm-6 legislation-wrapper" v-for="legislation in data.accepted">
                            <div class="single-legislation">
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
                <p-tab label="Glasovanja">
                    <div class="legislation row">
                        <div class="col-sm-6 legislation-wrapper" v-for="legislation in data.under_consideration">
                            <div class="single-legislation">
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
        </div>
        <div class="all-legislation">
            <a :href="slugs.legislationLink">VSA ZAKONODAJA</a>
        </div>

    </card-wrapper>
</template>

<script>
  import common from 'mixins/common';

  import PTab from 'components/Tab.vue';
  import PTabs from 'components/Tabs.vue';

  export default {
    components: {PTab, PTabs},
    mixins: [common],
    name: 'IzpostavljenaZakonodaja',
    data() {

      console.log(this.$options.cardData.data)
      return {
        data: this.$options.cardData.data,
        state: this.$options.cardData.state,
        selectedTab: this.$options.cardData.state.selectedTab || 0,
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
  };
</script>

<style lang="scss" scoped>

    @import '~parlassets/scss/breakpoints';
    @import '~parlassets/scss/colors';


    .legislation {
        margin-top: 16px;
        overflow: hidden;

        .legislation-wrapper {
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


            .single-legislation {
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
        }
    }

    .all-legislation {
        margin: 4px 0 15px;

        a {
            padding: 3px;
            padding-left: 32px;
            background: url(https://cdn.parlameter.si/v1/parlassets/icons/zakonodaja-modra.svg) no-repeat top left;
            font-size: 14px;
            font-weight: 400;
            color: #227497;
        }
    }

</style>
