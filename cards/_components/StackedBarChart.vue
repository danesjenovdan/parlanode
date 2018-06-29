<template>
  <div class="session_voting">
    <div v-for="row in rows" :key="row.name" class="row">
      <div class="col-xs-12" style="background-color: #f0f0f0; margin-bottom: 10px; padding: 10px;">
        {{ row.name }}
        <span
          v-for="(chunk, k) in row.reverseStack"
          :class="['pull-right', 'legenda', getReverseColor(row, k)]"
          :key="chunk.label"
        >
          <span style="text-transform: capitalize; margin-left: 5px;">{{ chunk.label }}: </span>
          {{ chunk.value }}
        </span>
        <div class="session_votes">
          <div :style="{width: String(row.percentage) + '%'}" class="progress smallbar">
            <div
              v-for="(chunk, i) in row.stack"
              :class="['progress-bar', colorClasses[i]]"
              :style="{ width: String(chunk.percentage) + '%'}"
              :key="chunk.label"
            >
              <span class="sr-only">{{ chunk.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StackedBarChart',
  props: {
    data: Array,
  },
  data() {
    return {
      colorClasses: ['funblue', 'fontblue', 'noblue', 'ignoreblue'],
      reverseColorClasses: ['ignoreblue', 'noblue', 'fontblue', 'funblue'],
    };
  },
  computed: {
    rows() {
      const values = this.data.map(row => row.stack.reduce((acc, chunk) => acc + chunk.value, 0));
      const mymax = Math.max(...values);
      return this.data.map(row => ({
        name: row.name,
        stack: row.stack.map(chunk => ({
          label: chunk.label,
          value: chunk.value,
          percentage: 100 * chunk.value / row.stack.reduce((acc, chunk1) => acc + chunk1.value, 0),
        })),
        reverseStack: row.stack.map(chunk => ({
          label: chunk.label,
          value: chunk.value,
          percentage: 100 * chunk.value / row.stack.reduce((acc, chunk1) => acc + chunk1.value, 0),
        })).reverse(),
        percentage: 100 * row.stack.reduce((acc, chunk) => acc + chunk.value, 0) / mymax,
      }));
    },
  },
  watch: {
    data() {
      this.renderChart();
    },
  },
  methods: {
    getReverseColor(row, k) {
      return this.reverseColorClasses[k + this.reverseColorClasses.length - row.stack.length];
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.legenda {
  font-size: 14px;
  margin-right: 10px;

  &:first-of-type {
    margin-right: 0;
  }
}

.legenda.funblue {
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: $funblue;
  }
}
.legenda.fontblue {
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: $fontblue;
  }
}

.party-list .labeled-chart .column.chart-label {
  width: auto;
  width: 200px;
}

#votingCard {
  height: 500px;
  overflow-y: auto;
}

#votingCard div.member span {
  color: #525252;
  font-weight: 500;
}

#votingCard .member:last-child {
  border: none;
}

#votingCard .member.lastel {
  border: none;
  padding-bottom: 10px;
}

.session_voting {
  font-weight: 400;
  padding: 12px 15px 15px 12px;

  &:empty::after {
    color: #c8c8c8;
    content: "Ni rezultatov.";
    left: calc(50% - 41px);
    position: absolute;
    top: calc(50% - 10px);
  }

  .session_votes .progress.smallbar {
    height: 25px;
  }

  .session_votes {
    font-size: 30px;
    line-height: 40px;
    margin: 0;

    .type {
      font-size: 14px;
      line-height: 20px;
      text-transform: uppercase;
    }
  }

}

.accepted.nay {
  color: #ff5e41;
}

.session_voting .accepted {
  line-height: normal;
  height: 95px;
}

.session_voting .accepted p {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);

  margin: 0;
  line-height: 30px;
  margin-top: 6px;
}

.session_voting .session_title {
  height: 95px;
  margin: 0;
  @include respond-to(mobile) {
    margin-top: 15px;
    margin-bottom: 10px;
  }
}

.session_voting .session_title p {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-family: Roboto Slab;
  margin-top: 6px;
}


@media (max-width: 991px) {
  .session_voting .session_title {
    height: 93px;
  }
  .session_voting .accepted {
    height: 60px;
  }

  .border-left {
    border-left: none;
    border-top: 2px solid #dbdbdb;
  }
  .single_voting:hover {
    .border-left {
      border-top-color: #cadde6;
    }
  }

  .single_voting {
    padding-bottom: 15px;
  }
}

.single_voting {
  position: relative;
}

.session_voting .session_title p {
  font-size: 14px;
}


.session_voting .single_voting {
  margin-bottom: 15px;
}

.single_voting:hover {
  background-color: #e1f6ff;

  .border-left {
    border-left-color: #cadde6;
  }
}

.seja_anchor:hover {
  color: #525252;
}

.card-content-front {
  overflow-y: auto;
}
</style>
