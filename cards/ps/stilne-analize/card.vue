<template>
  <style-scores
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.party"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          place="link1"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[0].link')"
          v-t="'info.links[0].text'"
        />
        <a
          place="link2"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[1].link')"
          v-t="'info.links[1].text'"
        />
      </i18n>
      <p class="info-text" v-t="'info.text[1]'"></p>
      <i18n path="info.text[2]" tag="p" class="info-text">
        <a
          place="link3"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[2].link')"
          v-t="'info.links[2].text'"
        />
      </i18n>
      <div class="info-text">
        <span v-t="'style-scores.elevated-vocabulary'"></span>:
        <ul>
          <li v-t="'info.elevated-qualifiers[0]'"></li>
        </ul>
        <span v-t="'style-scores.simple-vocabulary'"></span>:
        <ul>
          <li v-t="'info.simple-qualifiers[0]'"></li>
          <li v-t="'info.simple-qualifiers[1]'"></li>
        </ul>
        <span v-t="'style-scores.excessive-vocabulary'"></span>:
        <ul>
          <li v-t="'info.excessive-qualifiers[0]'"></li>
          <li v-t="'info.excessive-qualifiers[1]'"></li>
        </ul>
      </div>
      <p class="info-text" v-t="'info.text[3]'"></p>
    </div>
  </style-scores>
</template>

<script>
import common from 'mixins/common';
import StyleScores from 'components/StyleScores.vue';

export default {
  name: 'StilneAnalize',
  components: {
    StyleScores,
  },
  mixins: [common],
};
</script>
