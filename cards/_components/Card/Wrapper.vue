<template>
  <div :class="['card-container', transitionClass]">
    <card-header :config="headerConfig" :current-back="currentBack" />

    <div :class="['card-content', contentClass]">

      <card-info v-if="currentBack === 'info'">
        <slot name="info" />
      </card-info>

      <card-embed v-else-if="currentBack === 'embed'" :url="cardUrl" />

      <card-share v-else-if="currentBack === 'share'" :url="cardUrl" />

      <div v-else class="card-content-front" :class="contentFrontClass" v-cloak>
        <div v-if="false" class="card-content__empty"> <!-- this needs fixing, it's currently hardcoded -->
          <div class="card-content__empty-inner">
            <img src="//cdn.parlameter.si/v1/parlassets/img/icons/no-data.svg" />
            <p>Podatki trenutno niso na voljo.</p>
          </div>
        </div>

        <slot v-else />
      </div>
    </div>
    <card-footer @toggleBack="toggleBack" />
  </div>
</template>

<script>
import { RIPPLE_DURATION } from 'components/constants';
import CardInfo from 'components/Card/Info.vue';
import CardEmbed from 'components/Card/Embed.vue';
import CardShare from 'components/Card/Share.vue';
import CardHeader from 'components/Card/Header.vue';
import CardFooter from 'components/Card/Footer.vue';

export default {
  name: 'CardWrapper',
  components: {
    CardInfo,
    CardEmbed,
    CardShare,
    CardHeader,
    CardFooter,
  },
  data() {
    return {
      currentBack: null,
      transitionClass: null
    };
  },
  props: {
    contentClass: [String, Object],
    contentFrontClass: [String, Object],
    cardUrl: String,
    headerConfig: Object,
  },
  methods: {
    toggleBack(newBack) {
      const contentElement = this.$el.querySelector('.card-content');

      if (this.currentBack !== newBack) {
        this.transitionClass = ['covered', `clicked-${newBack}`];

        window.setTimeout(() => {
          contentElement.style.height = `${contentElement.offsetHeight}px`;
          this.currentBack = newBack;
        }, RIPPLE_DURATION / 2);
        window.setTimeout(() => { this.transitionClass = null; }, RIPPLE_DURATION);
      } else {
        this.transitionClass = ['revealed', `clicked-${newBack}`];

        window.setTimeout(() => {
          this.currentBack = null;
          contentElement.style.height = null;
        }, RIPPLE_DURATION / 2);
        window.setTimeout(() => { this.transitionClass = null; }, RIPPLE_DURATION);
      }
    },
  },
  watch: {
    currentBack(newBack) {
      this.$emit('backChange', newBack);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.card-content{
  &__empty {
    height: 40vh;
  }

  &.is-loading {
    overflow-y: hidden;
    position: relative;
    &::before {
      background: rgba($white, 0.6) url(https://cdn.parlameter.si/v1/parlassets/img/loader.gif) no-repeat center center;
      content: '';
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
  }
}

// why is this not working in child card?
.card-scroll { padding: 0; }
</style>
