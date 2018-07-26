<template>
  <og-container>
    <vertical-half>
      TEST
    </vertical-half>
    <vertical-half variant="white">
      <h2 class="cardname">
        Amandmaji
      </h2>
      <parlameter-logo />
    </vertical-half>
    <!-- <div class="left-half">
      <div class="personimg">

      </div>
      <h1 class="personinfo"></h1>
      <h2 class="partyinfo"></h2>
    </div>
    <div class="right-half">

    </div> -->
  </og-container>
</template>

<script>
import OgContainer from '../_components/OgContainer.vue';
import VerticalHalf from '../_components/VerticalHalf.vue';
import ParlameterLogo from '../_components/ParlameterLogo.vue';

export default {
  name: '',
  components: {
    OgContainer,
    VerticalHalf,
    ParlameterLogo,
  },
};
</script>

<style lang="scss" scoped>



        // .personimg {
        //     width: 300px;
        //     height: 300px;
        //     margin: 10px auto 75px;
        //     background-color: #fff;
        //     border-radius: 50%;
        // }

        // .personimg svg {
        //     fill: #009cdd;
        //     width: 80%;
        // }

        // h1,
        // h2 {
        //     color: #fff;
        //     padding: 0;
        //     margin: 0;
        //     line-height: 1;
        // }

        // h1 {
        //     font-size: 44px;
        //     margin-bottom: 20px;
        // }

        // h2 {
        //     font-size: 32px;
        // }

        // .partyinfo {
        //     font-family: "Roboto Slab", sans-serif;
        //     font-weight: 300;
        // }

        .cardname {
            font-size: 44px;
            color: #009cdd;
            margin-top: 200px;
        }


    </style>
