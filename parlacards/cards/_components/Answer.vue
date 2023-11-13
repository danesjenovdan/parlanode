<template>
  <div class="show-hide-answer" @click="showAnswer = !showAnswer">
    <div class="parlaicon parlaicon-odgovor"></div>
    <span v-if="!showAnswer" v-t="'event.show-answer'"></span>
    <span v-if="showAnswer" v-t="'event.hide-answer'"></span>
    <div class="parlaicon toggle-arrow" :class="{ 'toggled': showAnswer}"></div>
  </div>
  <div class="answer" v-if="showAnswer">
    <p>{{ authors }} {{ event.answer.text }}</p>
  </div>
</template>

<script>

export default {
  name: 'Answer',
  props: {
    event: {
      type: Object,
      required: true,
    },
    
  },
  data() {
    return {
      showAnswer: false,
    };
  },
  computed: {
    authors() {
      if (this.event.answer.person_authors || this.event.answer.organization_authors) {
        const authors = this.event.answer.person_authors.concat(this.event.answer.organization_authors);
        return authors.map((a) => a.name).join(", ") + ":";
      }
      return "";
    }
  },
};
</script>

<style lang="scss">
@import 'parlassets/scss/breakpoints';

.show-hide-answer {
  margin-left: 40px;
  margin-bottom: 20px;
  margin-right: 10px;
  padding: 4px;
  background-color: #f2fafc;
  display: flex;
  align-items: center;
  font-size: 14px;
  position: relative;
  cursor: pointer;

  &:hover {
    span {
      text-decoration: underline;
    }
  }
}

.answer {
  margin-left: 40px;
  margin-right: 10px;

  p {
    margin: 10px 0;
    font-weight: 300;
    line-height: 18px;
  }
}

.parlaicon-odgovor {
  height: 14px;
}

.toggle-arrow {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="37" height="19.775" viewBox="0 0 9.7895829 5.232016"><path d="M4.895 5.232L9.79.346 9.443 0 4.895 4.537.347 0 0 .346z" /></svg>');
  height: 6px;
  position: absolute;
  right: 0;
  text-align: center;
  transform-origin: center;

  &.toggled {
    transform: rotate(180deg);
  }
}

</style>
