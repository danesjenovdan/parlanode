<template>
  <div class="card-content-embed">
    <div class="card-back-content">
      <div class="embed-content">
        <div class="embed-divider"></div>
        <div class="embed-switch-container">
          <div v-t="'embed.always-refresh'" class="embed-label"></div>
          <div class="embed-switch-big-box" @click="refresh = !refresh">
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
          <!-- eslint-disable vue/no-v-html -->
          <textarea
            ref="embedInput"
            :data-url="url"
            class="form-control"
            data-id=""
            v-html="embedCode"
          ></textarea>
          <!-- eslint-enable vue/no-v-html -->
          <button
            class="btn-parlameter btn-full-width btn-blue btn-copy-embed"
            @click="copyEmbedCode"
          >
            <span v-if="copied" v-t="'copied'"></span>
            <span v-else v-t="'copy'"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import copyInput from '@/_helpers/copyInput.js';

export default {
  name: 'CardEmbed',
  data() {
    // Get card url from a parent with common mixin which defines a computed url property
    let url;
    let parent = this.$parent;
    while (parent) {
      if (parent.url) {
        url = parent.url;
        break;
      }
      parent = parent.$parent;
    }
    url = `${url}&locale=sl-obcine&template=embed`; // TODO: correct locale
    return {
      url,
      copied: false,
      refresh: true,
    };
  },
  computed: {
    embedCode() {
      return `TODO: embed code for: ${this.url}`;
      // let newUrl = this.url;
      // if (!this.refresh) {
      //   newUrl = `${this.url.split('?')[0]}${format(new Date(), 'd.M.y')}?${
      //     this.url.split('?')[1]
      //   }`;
      // }
      // // eslint-disable-next-line no-restricted-properties
      // const { urls } = this.$root.$options.contextData;
      // return `&#x3C;script&#x3E;(function(d,script){script=d.createElement(&#x27;script&#x27;);script.type=&#x27;text/javascript&#x27;;script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=&#x27;${urls.cdn}/js/iframeResizer.min.js&#x27;;d.getElementsByTagName(&#x27;head&#x27;)[0].appendChild(script);}(document));&#x3C;/script&#x3E;&#x3C;iframe frameborder=&#x22;0&#x22; width=&#x22;100%&#x22; src=&#x22;${newUrl}&#x26;embed=true&#x22;&#x3E;&#x3C;/iframe&#x3E;`;
    },
  },
  methods: {
    copyEmbedCode() {
      this.copied = copyInput(this.$refs.embedInput);
    },
  },
};
</script>

<style lang="scss" scoped>
textarea.form-control {
  resize: vertical;
}
</style>
