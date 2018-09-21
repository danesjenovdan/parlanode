<template>
  <div :class="['card-container', transitionClass]">
    <card-header :config="headerConfig" :current-back="currentBack" />

    <div :class="['card-content', contentClass]">

      <card-info v-if="currentBack === 'info'">
        <slot name="info" />
      </card-info>

      <card-embed v-else-if="currentBack === 'embed'" :url="cardUrl" />

      <card-share v-else-if="currentBack === 'share'" :url="cardUrl" />

      <card-previous v-else-if="currentBack === 'previous'" />

      <div
        v-else
        v-cloak
        :class="contentFrontClass"
        class="card-content-front"
      >
        <!-- this needs fixing, it's currently hardcoded -->
        <div v-if="false" class="card-content__empty">
          <div class="card-content__empty-inner">
            <img :src="`${slugs.urls.cdn}/img/icons/no-data.svg`">
            <p v-t="'data-currently-unavailable'"></p>
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
import CardPrevious from 'components/Card/Previous.vue';
import CardHeader from 'components/Card/Header.vue';
import CardFooter from 'components/Card/Footer.vue';

export default {
  name: 'CardWrapper',
  components: {
    CardInfo,
    CardEmbed,
    CardShare,
    CardPrevious,
    CardHeader,
    CardFooter,
  },
  props: {
    contentClass: {
      type: [String, Object, Array],
      default: '',
    },
    contentFrontClass: {
      type: [String, Object, Array],
      default: '',
    },
    cardUrl: {
      type: String,
      default: '',
    },
    headerConfig: {
      type: Object,
      default: () => ({}),
    },
    ogConfig: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      currentBack: null,
      transitionClass: null,
      previousHeight: null,
      slugs: this.$root.$options.cardData.urls,
    };
  },
  watch: {
    currentBack(newBack) {
      this.$emit('backChange', newBack);
    },
  },
  created() {
    const ogConfig = this.ogConfig;
    if (ogConfig) {
      const { name, ...params } = ogConfig;
      const slugs = this.$root.$options.cardData.urls;
      const ogImagePath = `${slugs.urls.glej}/og-image/${name}/`;
      const ogImageParams = `?${Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k])}`).join('&')}`;
      this.$root.$options.cardData.template.ogImageUrl = `${ogImagePath}${ogImageParams}`;
    } else {
      // eslint-disable-next-line no-console
      console.warn('Missing ogConfig!');
    }
  },
  methods: {
    toggleBack(newBack) {
      const contentElement = this.$el.querySelector('.card-content');

      if (this.currentBack !== newBack) {
        this.transitionClass = ['covered', `clicked-${newBack}`];

        window.setTimeout(() => {
          this.previousHeight = contentElement.offsetHeight;
          contentElement.style.height = `${contentElement.offsetHeight}px`;
          this.currentBack = newBack;
        }, RIPPLE_DURATION / 2);
        window.setTimeout(() => {
          this.transitionClass = null;
        }, RIPPLE_DURATION);
      } else {
        this.transitionClass = ['revealed', `clicked-${newBack}`];

        window.setTimeout(() => {
          this.currentBack = null;
          contentElement.style.height = this.previousHeight;
        }, RIPPLE_DURATION / 2);
        window.setTimeout(() => {
          this.transitionClass = null;
        }, RIPPLE_DURATION);
      }
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
      background-color: $white-hover;
      background-image: url("#{getConfig('urls.cdn')}/img/loader.gif");
      background-repeat: no-repeat;
      background-position: center center;
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
    }
  }
}
</style>
