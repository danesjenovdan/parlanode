<template>
  <div class="card-content-embed">
    <div class="card-back-content">
      <div class="embed-content">
        <div class="embed-divider"></div>
        <div class="embed-switch-container">
          <div class="embed-label">Podatki naj se vedno osvežujejo</div>
          <div class="embed-switch-big-box" @click="toggleEmbedSwitch">
            <div :class="['embed-switch-box', { off: !this.refresh }]">
              <div class="embed-switch">
                <div class="embed-switches">
                  <div class="leftswitch">DA</div>
                  <div class="rightswitch">NE</div>
                </div>
              </div>
            </div>
            <div class="embed-switch-ball"></div>
          </div>
        </div>
        <div class="embed-divider"></div>
        <div class="embed-script">
          <textarea class="form-control" data-id="" :data-url="url" v-html="embedCode" ref="embedInput"></textarea>
          <button class="btn-parlameter btn-full-width btn-blue btn-copy-embed" @click="copyEmbedCode" ref="copyButton">KOPIRAJ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardEmbed',

  computed: {
    embedCode() {
      let newUrl = this.url;
      if (!this.refresh) {
        const todaysdate = new Date;
        const today = '' + todaysdate.getDay() + '.' + todaysdate.getMonth() + '.' + todaysdate.getFullYear();
        newUrl = `${this.url.split('?')[0]}${today}?${this.url.split('?')[1]}`;
      }

      return `&#x3C;script&#x3E;(function(d,script){script=d.createElement(&#x27;script&#x27;);script.type=&#x27;text/javascript&#x27;;script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=&#x27;https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js&#x27;;d.getElementsByTagName(&#x27;head&#x27;)[0].appendChild(script);}(document));&#x3C;/script&#x3E;&#x3C;iframe frameborder=&#x22;0&#x22; width=&#x22;100%&#x22; src=&#x22;${newUrl}&#x26;embed=true&#x22;&#x3E;&#x3C;/iframe&#x3E;`;
    },
  },

  props: {
    url: String,
  },

  data() {
    return {
      refresh: true,
    };
  },

  methods: {
    toggleEmbedSwitch() {
      this.refresh = !this.refresh;
    },

    copyEmbedCode() {
      this.$refs.embedInput.select();
      let succeed = false;
      try {
          succeed = document.execCommand("copy");
      } catch (e) {
          return e;
      }
      this.$refs.embedInput.blur();
      this.$refs.copyButton.textContent = 'SKOPIRANO!'
    },
  },
};
</script>
