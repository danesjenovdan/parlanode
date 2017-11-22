<template>
    <card-wrapper
        :id="cardData.cardData._id"
        :data-id="`${cardGroup}/${cardMethod}`"
        content-class="full card-scroll"
        v-bind="{ cardUrl, headerConfig }">

        <div slot="info">
            <p class="info-text lead"></p>
            <p class="info-text heading">METODOLOGIJA</p>
            <p class="info-text"></p>
        </div>

        <div class="filters filters--shadow">
            <div class="filter text-filter">
                <div class="filter-label">Išči po vsebini govorov</div>
                <search-field v-model="textFilter" @input="searchSpeakings()" />
            </div>
            <div class="filter month-dropdown">
                <div class="filter-label">Časovno obdobje</div>
                <search-dropdown
                    :items="dropdownItems.months"
                    :placeholder="monthPlaceholder"
                    :alphabetise="false"
                    :select-callback="searchSpeakings"
                    :clear-callback="searchSpeakings">
                </search-dropdown>
            </div>

            <div class="filter month-dropdown">
                <div class="filter-label">Vrsta seje</div>
                <search-dropdown
                    :items="dropdownItems.sessions"
                    :placeholder="sessionPlaceholder"
                    :alphabetise="true"
                    :select-callback="searchSpeakings"
                    :clear-callback="searchSpeakings">
                </search-dropdown>
            </div>
        </div>

        <div class="speaks">
            <div class="speaks__wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <div v-for="(speakingDay, key, index) in groupSpeakingDays">
                    <div class="date">{{ speakingDay[0].session.date }}, {{ speakingDay[0].session.name }}, <span v-for="(org, indexOrg) in speakingDay[0].session.orgs">{{ org.name }} <span v-if="indexOrg < (speakingDay[0].session.orgs.length - 1)">,</span></span></div>
                    <ul class="speaks__list">
                        <li class="speaks__list--speak" v-for="speak in speakingDay">
                            <a :href="getPersonLink(speak.person)" class="portrait">
                                <img :src="getPersonPortrait(speak.person)" />
                            </a>

                            <div class="name">
                                <a :href="getPersonLink(speak.person)" class="funblue-light-hover">{{ speak.person.name }}</a><br>
                            </div>

                            <div class="motion">
                                <!--@todo url manjka-->
                                <a href="#" class="funblue-light-hover" v-html="speak.content_t"></a>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="speakingDays.length===0">
                    tukaj pride empty state komponenta
                </div>
            </div>
            <div v-if="card.isLoading" class="nalagalnik__wrapper">
                <div class="nalagalnik"></div>
            </div>

        </div>
    </card-wrapper>
</template>

<script>
    import SearchField from 'components/SearchField.vue';
    import SearchDropdown from 'components/SearchDropdown.vue';
    import { getPersonPortrait, getPersonLink } from 'components/links';

    import generateMonths from 'helpers/generateMonths';
    import common from 'mixins/common';

    import axios from 'axios';
    import infiniteScroll from 'vue-infinite-scroll'

    export default {
        directives: { infiniteScroll },
        components: { SearchField, SearchDropdown },
        mixins: [common],
        data() {
            let textFilter = '';
            let allMonths = generateMonths();

            const arrayColumn = (arr, n) => arr.map(x => x[n]);

            let highlightingSession = arrayColumn( this.cardData.data.highlighting, 'session');
            let highlightingOrgs = [].concat.apply([], arrayColumn( highlightingSession, 'orgs'));
            let allSessions = highlightingOrgs.map(
                org => ({ id: org.id, label: org.name, selected: false})
            );

            allSessions = allSessions.map(JSON.stringify).reverse().filter(function (e, i, a) {
                return a.indexOf(e, i+1) === -1;
            }).reverse().map(JSON.parse)


            return {
                card: {
                    currentPage: 0,
                    isLoading: false,
                    lockLoading: false
                },
                cardMethod: this.cardData.cardData.method,
                cardGroup: this.cardData.cardData.group,
                speakingDays: this.cardData.data.highlighting,
                textFilter,
                allMonths,
                allSessions
            };
        },
        computed: {
            cardUrl() {
                const state = {}

                if (this.type === 'person') {
                    state.people = this.cardData.state.people
                } else if (this.type === 'party') {
                    state.parties = this.cardData.state.parties
                }

                if (this.selectedMonths.length > 0) {
                    // since dates in month dropdown are generated as m-y we need to prepare them as 1.m.y
                    state.time_filter = this.selectedMonths.map(m => {
                        const [year, month] = m.id.split('-');
                        return [1, month, year].join('.');
                    });
                }

                if (this.selectedSessions.length > 0) {
                    state.orgs = this.selectedSessions.map(s => s.id);
                }


                var encodedQueryData = '';
                if (Object.keys(state).length !== 0) {
                    encodedQueryData = this.encodeQueryData(state);
                }

                let textFilter = this.textFilter.length ? this.textFilter : this.cardData.state.text;

                return `https://isci.parlameter.si/filter/${textFilter}/${this.card.currentPage}${encodedQueryData}`;
            },
            selectedSessions() {
                return this.allSessions.filter(session => session.selected);
            },
            selectedMonths() {
                return this.allMonths.filter(month => month.selected);
            },
            sessionPlaceholder() {
                return this.selectedSessions.length > 0 ? `Izbranih: ${this.selectedSessions.length}` : 'Izberi';
            },
            monthPlaceholder() {
                return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
            },
            dropdownItems() {
                return {
                    months: this.allMonths,
                    sessions: this.allSessions
                };
            },
            groupSpeakingDays() {
                return this.speakingDays
                    .reduce(function (r, a) {
                        r[a.session_id] = r[a.session_id] || [];
                        r[a.session_id].push(a);
                        return r;
                    }, Object.create(null));
            },
            headerConfig() {

                return Object.assign({}, {
                    alternative: JSON.parse(this.cardData.cardData.altHeader || 'false'),
                    title: this.cardData.cardData.name,
                });
            }
        },
        methods: {
            searchSpeakings (waitTime = 750) {
                if (this.card.lockLoading) return false;

                if (! Number.isInteger(waitTime)) {
                    waitTime = 0;
                }

                this.card.lockLoading = true;
                setTimeout(() => {
                    if (! this.card.isLoading) {
                        this.card.isLoading = true;
                        axios.get(this.cardUrl).then( response => {
                            this.speakingDays = response.data.highlighting;
                            this.speakingDays = response.data.highlighting;
                            this.card.isLoading = false;
                        })
                    }
                    this.card.lockLoading = false;
                }, waitTime);

            },
            loadMore () {
                if (this.card.lockLoading || this.card.isLoading) return false;
                this.card.isLoading = true;

                axios.get(this.cardUrl).then(response => {
                    this.speakingDays = this.speakingDays.concat(response.data.highlighting)
                    this.card.currentPage++

                    this.card.isLoading = false;

                    // end infinite scrolling
                    if (response.data.response.start >= response.data.response.numFound) {
                        // @todo decide what to show when no more data
                        // this.card.lockLoading = true;
                    }

                });
            },
            measurePiwik(filter, sort, order) {
                if (typeof measure === 'function') {
                    if (sort !== '') {
                        measure('s', 'session-sort', `${sort} ${order}`, '');
                    } else if (filter !== '') {
                        measure('s', 'session-filter', filter, '');
                    }
                }
            },
            getPersonPortrait,
            getPersonLink
        },
        props: {
            cardData: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                required: true,
                validator: value => ['person', 'party'].indexOf(value) > -1,
            },
            person: Object,
            party: Object,
        }
    };
</script>

<style lang="scss" scoped>
    @import '~parlassets/scss/breakpoints';
    @import '~parlassets/scss/colors';

    //@todo remove me

    .search-field {
        height: 53px !important;
    }

    .card-scroll {
        padding: 0;

        .filters {
            padding: 0 20px 20px;
            display: flex;
            position: relative;
            z-index: 9;
            justify-content: space-between;
            $label-height: 26px;

            &--shadow {
                box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.24), 0 1.5px 6px rgba(0, 0, 0, 0.12);
            }

            .filter {
                @include respond-to(desktop) {
                    margin-right: 10px;
                    flex: 1;
                }

                @include respond-to(mobile) {
                    width: 100%;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            @include respond-to(mobile) {
                flex-wrap: wrap;
                min-height: 154px;
            }

            .filter-label {
                font-size: 14px;
                font-weight: 300;
                line-height: $label-height;
            }

            .option-party-buttons {
                @include show-for(desktop, flex);

                width: 27.5%;
                padding-top: $label-height;

                .party-button:not(:last-child) {
                    margin-right: 3px;
                }
            }
        }

    }



    .speaks {
        flex: 1;
        position: relative;
        padding-bottom: 20px;

        &__wrapper {
            height: 420px;
            overflow-y: auto;
            overflow-x: hidden;

            .date {
                background-color: $grey;
                font-weight: bold;
                padding: 10px;
            }
        }

        &__list {
            padding: 0 0 10px;
            margin: 0;

            &--speak {
                border-bottom: 1px solid $grey;
                padding: 15px 0;
                list-style: none;
                display: flex;
                align-items: center;

                &:last-child {
                    border-bottom: 0;
                }

                .portrait {
                    margin-left: 7px;
                    float: left;
                    flex: none;

                    img {
                        height: 40px;
                        width: 40px;
                        border-radius: 50%;
                    }
                }

                .name {
                    text-align: left;
                    font-size: 18px;
                    font-weight: 300;
                    margin: 0 5px 0 15px;
                    flex: 1;

                    a {
                        text-decoration: none;
                    }
                }

                .motion {
                    flex: 4;

                    a {
                        color: $black;
                        margin: 0;
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 300;
                        margin-right: 20px;
                        padding-right: 5px;
                    }
                }
            }
        }

        .nalagalnik__wrapper {
            background: rgba(255,255,255,.75);
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;

            .nalagalnik {
                position: absolute;
                top: calc(50% - 50px);
            }
        }
    }

</style>