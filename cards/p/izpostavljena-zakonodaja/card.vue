<template>
    <card-wrapper
            class="card-halfling card-featured-legislation"
            :id="$options.cardData.cardData._id"
            :card-url="url"
            :header-config="headerConfig">

        <div slot="info">
            <p class="info-text lead"></p>
            <p class="info-text heading">METODOLOGIJA</p>
            <p class="info-text"></p>
        </div>

        <tabs :start-tab="selectedTab" :css-class="'iz-tabs'">
            <tab label="Pregled">
                <div class="legislation">
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

            </tab>
            <tab label="Glasovanja">
                <div class="legislation">
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
            </tab>
        </tabs>

        <div class="all-legislation">
            <a href="#">VSA ZAKONODAJA</a>
        </div>

    </card-wrapper>
</template>

<script>
    import common from 'mixins/common';

    import Tab from 'components/Tab.vue';
    import Tabs from 'components/Tabs.vue';

    export default {
        components: {Tab, Tabs},
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

    .navigation-tabs {
        ul {
            padding: 0;

            li {
                overflow: hidden;
                text-align: center;
                list-style: none;
                float: left;
                margin-right: 10px;


                &:last-child {
                    margin-right: 0;
                }

                a {
                    vertical-align: middle;
                    display: block;
                    font-size: 16px;
                    font-weight: 300;
                    line-height: 30px;
                    padding: 10px 40px;
                    color: #fff;
                    border: 1px solid #dbdbdb;
                    text-transform: uppercase;
                    background-color: #227497;
                    text-decoration: none;

                    &.active,
                    &:hover {
                        color: #fff;
                        background: #009cdd;
                        text-decoration: none;
                    }
                }
            }
        }
    }

    .legislation {
        margin-top: 16px;


        .legislation-wrapper {
            margin-bottom: 15px;

            @include respond-to(mobile) {
                padding: 0;
            }

            &:nth-child(odd)
            {
                @include respond-to(desktop) {
                    padding: 0;
                }
            }

            &:nth-child(even)
            {
                @include respond-to(desktop) {
                    padding-right: 0;
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
