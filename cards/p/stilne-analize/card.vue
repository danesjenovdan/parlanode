<template>
  <style-scores
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          v-t="'info.links[0].text'"
          :href="$t('info.links[0].link')"
          place="link1"
          class="funblue-light-hover"
          target="_blank"
        />
        <a
          v-t="'info.links[1].text'"
          :href="$t('info.links[1].link')"
          place="link2"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
      <p v-t="'info.text[1]'" class="info-text"></p>
      <i18n path="info.text[2]" tag="p" class="info-text">
        <a
          v-t="'info.links[2].text'"
          :href="$t('info.links[2].link')"
          place="link3"
          class="funblue-light-hover"
          target="_blank"
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
      <p v-t="'info.text[3]'" class="info-text"></p>
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
