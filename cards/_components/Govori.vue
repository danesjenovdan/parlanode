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
        </div>


        <div class="speaks date-list" v-for="speakingDay in filteredSpeakingDays">
            <div class="date">7.7.2017, 9. redna seja, Komisija poslovnik</div>

            <ul class="speaks-list">
                <li class="speak">
                    <a :href="getPersonLink(person)" class="portrait">
                        <img :src="getPersonPortrait(speakingDay.person)" />
                    </a>

                    <div class="column name">
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



    export default {
        components: { SearchField, SearchDropdown },
        mixins: [common],
        name: 'GovoriPoslanca',
        data() {
            let textFilter = '';
            let allMonths = generateMonths();

            return {
                cardMethod: this.cardData.cardData.method,
                cardGroup: this.cardData.cardData.group,
                speakingDays: this.cardData.data.highlighting,
                textFilter,
                allMonths
            };
        },
        computed: {
            cardUrl() {
                const state = {};
                // change me
                return `https://glej.parlameter.si/${this.cardGroup}/${this.cardMethod}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
            },
            selectedMonths() {
                return '2017-10';
            },
            monthPlaceholder() {
                return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
            },
            dropdownItems() {
                return {
                    months: this.allMonths
                };
            },
            filteredSpeakingDays() {
                return this.getFilteredSpeakingDays();
            },
            headerConfig() {
                let specifics;
                if (this.type === 'person') {
                    specifics = {
                        heading: this.person.name,
                        subheading: `${this.person.party.acronym} | ${this.person.party.is_coalition ? 'koalicija' : 'opozicija'}`,
                        circleImage: this.person.gov_id,
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


                return this.speakingDays;

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
    .card-container, .card-content {
        /* overflow: hidden; */
        overflow-y: scroll !important;
    }

    .filters {
        .filter {
            flex: 1;

            @include respond-to(desktop) {
                margin-right: 10px;
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
        $label-height: 26px;

        display: flex;
        justify-content: space-between;

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
                border-bottom: 1px solid #f0f0f0;
                padding: 15px 0;
                list-style: none;
                display: flex;
                align-items: center;

                .portrait {
                    margin-left: 7px;

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
                    margin: 0 20px 0 15px;
                    width: 16%;

                    a {
                        text-decoration: none;
                    }
                }

                .motion {
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