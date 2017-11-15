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


        <!-- Card content goes here -->
    </card-wrapper>
</template>

<script>
    import SearchField from 'components/SearchField.vue';
    import SearchDropdown from 'components/SearchDropdown.vue';

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
</style>
