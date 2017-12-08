<template>
    <div class="personpin-container">
        <div
            :class="['personpin-tooltip', { visible: tooltipVisible}]"
            :ref="person.gov_id"
        >{{ person.name }}</div>
        <a
            :href="personLink"
            class="avgminimg img-circle"
            :style="{ 'background-image': `url('${personPortraitUrl}')` }"
            @mouseover="tooltipVisible = true"
            @mouseout="tooltipVisible = false"
        ></a>
    </div>
</template>

<script>
import { getPersonLink, getPersonPortrait } from 'components/links';

export default {
    name: 'PersonPin',

    props: {
        person: {
            type: Object,
            required: true,
            validator: value => value.type === 'mp',
        }
    },

    data() {
        return {
            tooltipVisible: false,
        };
    },

    computed: {
        personLink() {
            return getPersonLink(this.person);
        },
        personPortraitUrl() {
            return getPersonPortrait(this.person);
        },
    }
}
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.personpin-container {
    float: right;
    position: relative;

    width: 30px;
    height: 30px;

    &[data-name="PS Levica"], &.levica-background { // TODO fix levica
        font-size: 8px;
    }

    .personpin-tooltip {
        position: absolute;
        top: -30px;
        left: -25px;

        text-align: center;
        border: 0px;
        pointer-events: none;
        background-color: #525252;
        border-radius: 3px;
        padding: 2px 10px;
        opacity: 0;

        color: #ffffff;

        transition: opacity 0.25s ease-out;

        z-index: 10;

        min-width: 100px;

        &.visible {
            opacity: 1;
        }
    }
}
</style>
