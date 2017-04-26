import CardInfo from 'components/Card/Info.vue';
import CardEmbed from 'components/Card/Embed.vue';
import CardShare from 'components/Card/Share.vue';
import CardHeader from 'components/Card/Header.vue';
import CardFooter from 'components/Card/Footer.vue';
import initializeBack from 'mixins/initializeBack';

export default {
  components: {
    CardInfo,
    CardEmbed,
    CardShare,
    CardHeader,
    CardFooter
  },
  mixins: [
    initializeBack,
  ],
};
