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
    import common from 'mixins/common';

    export default {
        components: { SearchField },
        mixins: [common],
        name: 'GovoriPoslanca',
        data() {
            let textFilter = '';

            return {
                cardMethod: this.cardData.cardData.method,
                cardGroup: this.cardData.cardData.group,
                textFilter,
                
                headerConfig: {
                    circleIcon: 'og-list',
                    heading: '&nbsp;',
                    subheading: '7. sklic parlamenta',
                    alternative: this.cardData.altHeader === 'true',
                    title: this.cardData.cardData.name,
                },
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
                    months: ['2017-11', '2017-10']
                };
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
