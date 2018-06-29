<template>
  <div class="card-content-embed">
    <div class="card-back-content">
      <div class="embed-content">
        <div class="embed-divider"></div>
        <div class="embed-switch-container">
          <div v-t="'embed.always-refresh'" class="embed-label"></div>
          <div class="embed-switch-big-box" @click="toggleEmbedSwitch">
            <div :class="['embed-switch-box', { off: !refresh }]">
              <div class="embed-switch">
                <div class="embed-switches">
                  <div v-t="'yes'" class="leftswitch"></div>
                  <div v-t="'no'" class="rightswitch"></div>
                </div>
              </div>
            </div>
            <div class="embed-switch-ball"></div>
          </div>
        </div>
        <div class="embed-divider"></div>
        <div class="embed-script">
          <textarea
            ref="embedInput"
            :data-url="url"
            class="form-control"
            data-id=""
            v-html="embedCode"
          ></textarea>
          <button
            class="btn-parlameter btn-full-width btn-blue btn-copy-embed"
            @click="copyEmbedCode"
          >
            <span v-t="'copied'" v-if="copied"></span>
            <span v-t="'copy'" v-else></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'CardEmbed',

  props: {
    url: String,
  },

  data() {
    return {
      refresh: true,
      copied: false,
    };
  },

  computed: {
    embedCode() {
      let newUrl = this.url;
      if (!this.refresh) {
        newUrl = `${this.url.split('?')[0]}${format(new Date(), 'D.M.YYYY')}?${this.url.split('?')[1]}`;
      }

      return `&#x3C;script&#x3E;(function(d,script){script=d.createElement(&#x27;script&#x27;);script.type=&#x27;text/javascript&#x27;;script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=&#x27;https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js&#x27;;d.getElementsByTagName(&#x27;head&#x27;)[0].appendChild(script);}(document));&#x3C;/script&#x3E;&#x3C;iframe frameborder=&#x22;0&#x22; width=&#x22;100%&#x22; src=&#x22;${newUrl}&#x26;embed=true&#x22;&#x3E;&#x3C;/iframe&#x3E;`;
    },
  },

  methods: {
    toggleEmbedSwitch() {
      this.refresh = !this.refresh;
    },

    copyEmbedCode() {
      this.$refs.embedInput.select();
      let succeeded = false;
      try {
        succeeded = document.execCommand('copy');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('copy to clipboard failed', e);
        return;
      }
      this.$refs.embedInput.blur();
      this.copied = succeeded;
    },
  },
};
</script>
