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
                <div class="filter-label">Išči po naslovu glasovanja</div>
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


        <div class="speaks date-list" v-for="speakingDay in filteredSpeakingDays">
            <div class="date">{{ speakingDay.session.date }}, {{ speakingDay.session.name }}, <span v-for="(org, indexOrg) in speakingDay.session.orgs">{{ org.name }} <span v-if="indexOrg < (speakingDay.session.orgs.length - 1)">,</span></span></div>

            <ul class="speaks-list">
                <li class="speak">
                    <a :href="getPersonLink(speakingDay.person)" class="portrait">
                        <img :src="getPersonPortrait(speakingDay.person)" />
                    </a>

                    <div class="name">
                        <a :href="getPersonLink(speakingDay.person)" class="funblue-light-hover">{{ speakingDay.person.name }}</a><br>
                    </div>

                    <div class="motion">
                        <p v-html="speakingDay.content_t"></p>
                    </div>
                </li>
            </ul>
        </div>

    </card-wrapper>
</template>

<script>
    import SearchField from 'components/SearchField.vue';
    import SearchDropdown from 'components/SearchDropdown.vue';
    import { getPersonPortrait, getPersonLink } from 'components/links';

    import generateMonths from 'helpers/generateMonths';

    import common from 'mixins/common';
    // import axios from 'axios';

    // console.log(axios)

    export default {
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

            if (this.cardData.state) {
                const state = this.cardData.state;
                if (state.text) textFilter = state.text;
                if (state.months) allMonths = selectFromState(allMonths, state.months);
                if (state.sessions) allSessions = selectFromState(allSessions, state.sessions);
            }

            return {
                cardMethod: this.cardData.cardData.method,
                cardGroup: this.cardData.cardData.group,
                speakingDays: this.cardData.data.highlighting,
                textFilter,
                allMonths,
                allSessions
            };
        },
        mounted () {
            // axios.get('https://isci.parlameter.si/filter/zakon/2?people=82').then(response => {
            //     console.log(response)
            // });
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
                let specifics;
                if (this.type === 'person') {
                    specifics = {
                        heading: 'header',//this.person.name,
                        // subheading: `${this.person.party.acronym} | ${this.person.party.is_coalition ? 'koalicija' : 'opozicija'}`,
                        // circleImage: this.person.gov_id,
                    };
                } else {
                    specifics = {
                        heading: this.party.name,
                        subheading: `${this.party.acronym} | ${this.party.is_coalition ? 'koalicija' : 'opozicija'}`,
                        circleText: this.party.acronym,
                        circleClass: `${this.party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
                    };
                }

                return Object.assign({}, specifics, {
                    alternative: JSON.parse(this.cardData.cardData.altHeader || 'false'),
                    title: this.cardData.cardData.name,
                });
            }
        },
        methods: {
            getFilteredSpeakingDays(onlyFilterByText = false) {
                const filterSpeakings = (speaking) => {
                    const textMatch = this.textFilter === '' || speaking.content_t.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;

                    var dateMatch = true;
                    if (! onlyFilterByText && this.selectedMonths.length > 0) {
                        const [year , month, ] = speaking.date.split('-').map(string => parseInt(string, 10));
                        dateMatch = this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
                    }

                    return textMatch && dateMatch;
                };

                let speakings = this.speakingDays.filter(filterSpeakings);

                const groupedSpeakings = speakings.reduce(function (r, a) {
                    r[a.date] = r[a.date] || [];
                    r[a.date].push(a);
                    return r;
                }, Object.create(null));



                return this.speakingDays.filter(filterSpeakings);

                const filterBallots = (ballot) => {
                    const tagMatch = onlyFilterByText || this.selectedTags.length === 0 ||
                        ballot.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
                    const textMatch = this.textFilter === '' ||
                        ballot.motion.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
                    const optionMatch = onlyFilterByText || this.selectedOptions.length === 0 ||
                        this.selectedOptions.indexOf(ballot.option) > -1;

                    return tagMatch && textMatch && optionMatch;
                };

                const filterDates = (votingDay) => {
                    if (onlyFilterByText || this.selectedMonths.length === 0) return true;

                    const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));

                    return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
                };

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
        overflow-y: auto;
        margin-top: 18px;
        position: relative;

        .speaks-list {
            padding: 0;

            .speak {
                border-bottom: 1px solid $grey;
                padding: 15px 0;
                list-style: none;
                display: flex;
                align-items: center;

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
    }
</style>