<template>
  <og-container>
    <vertical-half>
      <div class="circle-container">
        <div v-if="params.image" class="img">
          <img :src="getPortraitUrl(params.image)" alt="image">
        </div>
        <div v-else-if="params.icon" class="img img--icon">
          <img :src="getIconUrl(params.icon)" alt="image">
        </div>
        <div v-else-if="params.acronym" class="img img--acronym">
          <span>{{ params.acronym }}</span>
        </div>
      </div>
      <div class="caption">
        <h1 class="caption__heading">
          {{ params.h1 }}
        </h1>
        <h2 class="caption__subheading">
          {{ params.h2 }}
        </h2>
      </div>
    </vertical-half>
    <title-logo-half :title="params.title" />
  </og-container>
</template>

<script>
import OgContainer from '../_components/OgContainer.vue';
import VerticalHalf from '../_components/VerticalHalf.vue';
import TitleLogoHalf from '../_components/TitleLogoHalf.vue';

export default {
  name: 'Circle',
  components: {
    OgContainer,
    VerticalHalf,
    TitleLogoHalf,
  },
  data() {
    return {
      params: this.$options.context.params,
    };
  },
  methods: {
    getPortraitUrl(image) {
      return `${this.$root.$options.context.urls.urls.cdn}/img/people/square/${image}.png`;
    },
    getIconUrl(icon) {
      return `${this.$root.$options.context.urls.urls.cdn}/icons/${icon}.svg`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "parlassets/scss/colors";

.circle-container {
  margin-top: 20px;

  .img {
    display: block;
    margin: 0 auto;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: $tab-passive;
    border: 5px solid #fff;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;
    }

    &.img--icon {
      border: none;
      border-radius: 0;
      padding: 35px;

      img {
        object-fit: contain;
        filter: brightness(0%) invert(100%);
      }
    }

    &.img--acronym {
      border: none;
      border-radius: 0;
      display: flex;
      width: 100%;

      span {
        color: #fff;
        text-align: center;
        font-size: 85px;
        line-height: 1;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.caption {
  margin-top: auto;
  text-align: center;

  .caption__heading,
  .caption__subheading {
    color: #fff;
    line-height: 1.2;
    font-weight: 500;
  }

  .caption__heading {
    font-size: 44px;
    margin-bottom: 10px;
  }

  .caption__subheading {
    font-family: "Roboto Slab", sans-serif;
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 0;
  }
}
</style>
