<template>
    <card-wrapper
        :id="cardData.cardData._id"
        :data-id="`${cardGroup}/${cardMethod}`"
        content-class="full"
        v-bind="{ cardUrl, headerConfig }">

        <div slot="info">
            <p class="info-text lead"></p>
            <p class="info-text heading">METODOLOGIJA</p>
            <p class="info-text"></p>
        </div>

        <div class="filters">
            <div class="filter text-filter">
                <div class="filter-label">Išči po vsebini govorov</div>
                <search-field v-model="textFilter" />
            </div>
            <div class="filter month-dropdown">
                <div class="filter-label">Časovno obdobje</div>
                <search-dropdown :items="dropdownItems.months" :placeholder="monthPlaceholder" :alphabetise="false"></search-dropdown>
            </div>

            <div class="filter month-dropdown">
                <div class="filter-label">Vrsta seje</div>
                <search-dropdown :items="dropdownItems.sessions" :placeholder="sessionPlaceholder" :alphabetise="true"></search-dropdown>
            </div>
        </div>

        <div class="speaks">
            <div class="speaks__wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <div v-for="(speakingDay, key, index) in filteredSpeakingDays">
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
                                <p v-html="speak.content_t"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="isLoading" class="nalagalnik__wrapper">
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
            let currentPage = 1;
            let isLoading = false;

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


            var state = { }
            if (this.cardData.state) {
                state = this.cardData.state;
                // if (state.text) textFilter = state.text;
                // if (state.months) allMonths = selectFromState(allMonths, state.months);
                // if (state.sessions) allSessions = selectFromState(allSessions, state.sessions);
            }

            return {
                cardMethod: this.cardData.cardData.method,
                cardGroup: this.cardData.cardData.group,
                speakingDays: this.cardData.data.highlighting,
                textFilter,
                allMonths,
                allSessions,
                currentPage,
                isLoading,
                state
            };
        },
        computed: {
            cardUrl() {
                const state = {};

                if (this.selectedSessions.length > 0) state.sessions = this.selectedSessions.map(session => session.id);
                if (this.selectedMonths.length > 0) state.months = this.selectedMonths.map(month => month.id);
                if (this.textFilter.length > 0) state.text = this.textFilter;

                return `https://glej.parlameter.si/${this.cardGroup}/${this.cardMethod}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
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
            filteredSpeakingDays() {
                return this.getFilteredSpeakingDays();
            },
            headerConfig() {

                return Object.assign({}, {
                    alternative: JSON.parse(this.cardData.cardData.altHeader || 'false'),
                    title: this.cardData.cardData.name,
                });
            }
        },
        methods: {
            loadMore () {
                this.isLoading = true;

                axios.get('https://isci.parlameter.si/filter/'+ encodeURIComponent('zakon') +'/'+ this.currentPage, {
                    params: this.state
                }).then(response => {
                    this.speakingDays = this.speakingDays.concat(response.data.highlighting)
                    this.currentPage++

                    this.isLoading = false;
                    if (response.data.response.start >= response.data.response.numFound) {
                        // end infinite scroll
                    }
                });
            },

            getFilteredSpeakingDays(onlyFilterByText = false) {
                const filterSpeakings = (speaking) => {
                    const textMatch = this.textFilter === '' || speaking.content_t.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;

                    var dateMatch = true;
                    if (! onlyFilterByText && this.selectedMonths.length > 0) {
                        const [year , month, ] = speaking.date.split('-').map(string => parseInt(string, 10));
                        dateMatch = this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
                    }

                    var sessionMatch = true;
                    if (! onlyFilterByText && this.selectedSessions.length > 0) {
                        let orgIds = speaking.session.orgs.map(x => x.id)
                        let selectedOrgIds = this.selectedSessions.map(x => x.id)

                        sessionMatch = false;
                        for (let index in orgIds) {
                            if (selectedOrgIds.includes(orgIds[index])) {
                                sessionMatch = true;
                            }
                        }
                    }

                    return textMatch && dateMatch && sessionMatch;
                };

                console.log(this.speakingDays.filter(filterSpeakings).reduce(function (r, a) {
                    r[a.session_id] = r[a.session_id] || [];
                    r[a.session_id].push(a);
                    return r;
                }, Object.create(null)))

                return this.speakingDays
                    .filter(filterSpeakings)
                    .reduce(function (r, a) {
                        r[a.session_id] = r[a.session_id] || [];
                        r[a.session_id].push(a);
                        return r;
                    }, Object.create(null));


                return this.votingDays
                    .map(votingDay => ({
                        date: votingDay.date,
                        ballots: votingDay.ballots
                            .filter(filterBallots)
                            .map((ballot) => {
                                const ballotClone = JSON.parse(JSON.stringify(ballot));
                                if (ballot.option === 'ni') {
                                    ballotClone.label = this.type === 'person'
                                        ? `Ni ${this.vocabulary.glasovati[this.person.gender]} o`
                                        : 'Niso glasovali o';
                                } else {
                                    ballotClone.label = this.type === 'person'
                                        ? `${capitalize(this.vocabulary.glasovati[this.person.gender])} ${ballot.option.toUpperCase()}`
                                        : `Glasovali ${ballot.option.toUpperCase()}`;
                                }

                                if (ballot.result !== 'none') {
                                    ballotClone.outcome = ballot.result === true ? 'Predlog sprejet' : 'Predlog zavrnjen';
                                }

                                return ballotClone;
                            }),
                    }))
                    .filter(votingDay => votingDay.ballots.length > 0)
                    .filter(filterDates);
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
    .card-container .card-content.full .card-content-front {
        /* overflow: hidden; */
        overflow-y: scroll !important;
    }

    .search-field {
        height: 53px !important;
    }


    .filters {
        display: flex;
        justify-content: space-between;
        $label-height: 26px;

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


    .speaks {
        flex: 1;
        margin-top: 18px;
        position: relative;
        padding-bottom: 20px;

        &__wrapper {
            height: 450px;
            overflow-y: auto;

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

                    p {
                        margin: 0;
                        font-size: 14px;
                        font-weight: 300;
                        margin-right: 20px;
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