<template>
  <div :id="agenda.id" class="agenda-item">
    <div class="agenda-item__header">
      <div class="agenda-item__title" v-text="agenda.text"></div>
      <!-- <div class="links">
        <a :href="getSessionAgendaLink(agenda, session.id)" class="link"></a>
        <a
          v-if="!hideShareIcon"
          :href="getAgendaCardLink(agenda)"
          class="share"
        ></a>
      </div> -->
    </div>
    <div class="agenda-item__debates">
      <a
        v-for="debate in agenda.debates"
        :key="debate.id"
        :href="
          getSessionSpeechLink({
            session_id: session.id,
            speech_id: debate.start_speech.speech_id,
            the_order: debate.start_speech.the_order,
          })
        "
        target="_blank"
        class="agenda-item__debate transcript-link-icon"
      >
        {{ formatDate(debate.date) }}
      </a>
    </div>
    <div class="agenda-item__votings">
      <seznam-glasovanj
        v-if="
          agenda.votings && agenda.votings.votes && agenda.votings.votes.length
        "
        :data="agenda.votings"
        :show-filters="false"
      />
    </div>
  </div>
</template>

<script>
import links from '@/_mixins/links';
import SeznamGlasovanj from '@/_components/SeznamGlasovanj.vue';
import { format } from 'date-fns';

export default {
  name: 'AgendaItem',
  components: {
    SeznamGlasovanj,
  },
  mixins: [links],
  props: {
    agenda: {
      type: Object,
      required: true,
    },
    session: {
      type: Object,
      required: true,
    },
    hideShareIcon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), 'd. M. y');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.agenda-item {
  padding: 20px;
  margin-left: -20px;
  margin-right: -20px;
  border-top: 1px solid $background;

  .agenda-item__header {
    display: flex;

    .agenda-item__title {
      flex: 1;
      font-family: 'Roboto Slab';
      font-size: 16px;
      font-weight: 400;
    }
  }

  .agenda-item__debates {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;

    .agenda-item__debate {
      background-color: $background;
      padding: 12px 30px 12px 60px;
      font-size: 16px;
      font-weight: 400;
      background-size: 31px;
      background-position: 16px center;
      color: $font-default;

      &:not(:last-child) {
        margin-right: 10px;
      }

      &:hover {
        background-color: $link-hover-background;
        text-decoration: none;
        color: $link;
      }
    }
  }

  ::v-deep #seznam-glasovanj {
    margin-left: -12px;

    #votingCard {
      height: auto;
    }
  }
}

// MOVE THIS ICONS AND .links to parlassets from here and from Speech.vue
@function icon-link($color) {
  @return 'data:image/svg+xml;utf8,<svg fill="%23#{str_slice(' #{$color}', 2)}" xmlns="http://www.w3.org/2000/svg" height="50.456" width="50.45" viewBox="0 0 50.449501 50.456001"><path d="M16.712 45.482a5.394 5.394 0 0 1-7.62 0l-4.12-4.122a5.393 5.393 0 0 1 0-7.618l6.775-6.775-2.404-2.404-6.775 6.776c-3.424 3.426-3.424 9 0 12.425l4.12 4.123a8.766 8.766 0 0 0 6.216 2.568c2.25 0 4.5-.857 6.213-2.57l13.55-13.55a8.72 8.72 0 0 0 2.575-6.214 8.73 8.73 0 0 0-2.574-6.213l-4.123-4.12-2.404 2.403 4.124 4.12a5.352 5.352 0 0 1 1.578 3.81c0 1.438-.56 2.79-1.578 3.808L16.712 45.483z"/><path d="M43.76 2.575A8.728 8.728 0 0 0 37.545 0h-.002a8.73 8.73 0 0 0-6.213 2.574l-13.548 13.55a8.725 8.725 0 0 0-2.576 6.214 8.73 8.73 0 0 0 2.574 6.215l4.12 4.12 2.405-2.403-4.12-4.12a5.357 5.357 0 0 1-1.58-3.812c0-1.438.562-2.79 1.58-3.81l13.55-13.55a5.348 5.348 0 0 1 3.81-1.578c1.44 0 2.792.56 3.81 1.578l4.12 4.12c2.1 2.1 2.1 5.52 0 7.618l-6.774 6.777 2.405 2.404 6.775-6.777c3.426-3.427 3.426-9 0-12.426l-4.12-4.12z"/></svg>';
}

@function icon-share($color) {
  @return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.17 43.78"><path fill="none" stroke="%23#{str_slice('
    #{$color}', 2)}" stroke-width="3" d="M1 1h55.17v41.78H1zm0 31.89h55.17M7.33 7.94zm0 6zm0 6zm0 6z"/><circle fill="%23#{str_slice('
    #{$color}', 2)}" cx="51.08" cy="38.02" r="1.74"/><circle fill="%23#{str_slice('
    #{$color}', 2)}" cx="46.08" cy="38.02" r="1.74"/><circle fill="%23#{str_slice('
    #{$color}', 2)}" cx="41.08" cy="38.02" r="1.74"/></svg>';
}

.links {
  display: flex;
  padding: 6px 0 16px 0;

  @include respond-to(desktop) {
    justify-content: flex-end;
    padding: 0;
    width: 110px;
  }

  .link,
  .share {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 17px 17px;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    display: block;
    color: $link;

    &:not(:first-child) {
      margin-left: 9px;
    }

    &:hover {
      background-color: $link-hover-background;
      cursor: pointer;
    }
  }

  .link {
    background-image: url('#{icon-link($link)}');

    &:hover {
      background-image: url('#{icon-link($link)}');
    }
  }

  .share {
    background-image: url('#{icon-share($link)}');

    &:hover {
      background-image: url('#{icon-share($link)}');
    }
  }
}
// END MOVE HERE
</style>
