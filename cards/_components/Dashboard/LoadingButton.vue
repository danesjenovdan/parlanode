<template>
  <dashboard-button :class="{ 'dash-button--running': running }" @click="onClick">
    <div v-if="running" class="dash-button__loader-wrapper">
      <div class="dash-button__loader"></div>
    </div>
    <div class="dash-button__text-wrapper">
      <slot />
    </div>
  </dashboard-button>
</template>

<script>
import DashboardButton from 'components/Dashboard/Button.vue';

export default {
  name: 'DashboardLoadingButton',
  components: {
    DashboardButton,
  },
  props: {
    load: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      running: false,
    };
  },
  methods: {
    onClick() {
      this.running = true;
      this.load()
        .then(() => {
          this.running = false;
        })
        .catch((error) => {
          // this.running = false;
          this.error = error;
        });
    },
  },
};
</script>

<style lang="scss">
.dash-button--running {
  position: relative;
  text-indent: -99999;

  .dash-button__loader-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .dash-button__loader,
  .dash-button__loader:after {
    border-radius: 50%;
    width: 1em;
    height: 1em;
  }

  .dash-button__loader {
    font-size: 10px;
    position: relative;
    border: 1em solid rgba(255, 255, 255, 0.2);
    border-left-color: #fff;
    transform: translateZ(0);
    animation: button__loader 1.1s infinite linear;
  }
}

@keyframes button__loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
