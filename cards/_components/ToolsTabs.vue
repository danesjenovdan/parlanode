<template>
  <div class="row">
    <div class="col-md-12">
      <blue-button-list
        :items="tools"
        :value="currentTool"
        @input="changeTool"
      />
    </div>
  </div>
</template>

<script>
import BlueButtonList from 'components/BlueButtonList.vue';

export default {
  name: 'ToolsTabs',
  components: {
    BlueButtonList,
  },
  props: {
    currentTool: {
      type: String,
      required: true,
    },
  },
  data() {
    const { siteMap: sm } = this.$root.$options.cardData;
    return {
      tools: [
        {
          id: 'notifications',
          label: this.$t('tools.notifications'),
        },
        {
          id: 'voteComparator',
          label: this.$t('tools.vote-comparator'),
        },
        {
          id: 'discord',
          label: this.$t('tools.discord'),
        },
        {
          id: 'compass',
          label: this.$t('tools.compass'),
        },
        {
          id: 'wordGroups',
          label: this.$t('tools.word-groups'),
        },
      ],
    };
  },
  methods: {
    changeTool(value) {
      const tool = this.tools.find(t => t.id === value);
      if (tool) {
        const { siteMap: sm } = this.$root.$options.cardData;
        window.location.href = tool.link || `/${sm.landing.tools}/${sm.tools[value]}`;
      }
    },
  },
};
</script>
