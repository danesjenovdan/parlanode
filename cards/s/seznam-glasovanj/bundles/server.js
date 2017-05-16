module.exports=function(t){function e(a){if(s[a])return s[a].exports;var i=s[a]={i:a,l:!1,exports:{}};return t[a].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var s={};return e.m=t,e.c=s,e.i=function(t){return t},e.d=function(t,s,a){e.o(t,s)||Object.defineProperty(t,s,{configurable:!1,enumerable:!0,get:a})},e.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(s,"a",s),s},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=8)}([function(t,e){t.exports=function(t,e,s,a){var i,r=t=t||{},n=typeof t.default;"object"!==n&&"function"!==n||(i=t,r=t.default);var o="function"==typeof r?r.options:r;if(e&&(o.render=e.render,o.staticRenderFns=e.staticRenderFns),s&&(o._scopeId=s),a){var l=Object.create(o.computed||null);Object.keys(a).forEach(function(t){var e=a[t];l[t]=function(){return e}}),o.computed=l}return{esModule:i,exports:r,options:o}}},function(t,e,s){s(19),s(18);var a=s(0)(s(14),s(31),"data-v-3a0e5bc4",null);t.exports=a.exports},function(t,e,s){var a=s(0)(s(15),s(30),null,null);t.exports=a.exports},function(t,e,s){var a=s(0)(s(16),s(25),null,null);t.exports=a.exports},function(t,e,s){var a=s(0)(s(17),s(32),null,null);t.exports=a.exports},function(t,e){t.exports=require("request")},function(t,e){t.exports=require("vue")},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={mounted:function(){makeEmbedSwitch(),activateCopyButton(),addCardRippling()}}},function(t,e,s){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=s(6),r=a(i),n=s(5),o=a(n),l=s(2),c=a(l),d=s(4),u=a(d),f=s(3),v=a(f),p=s(1),h=a(p);global.$={getJSON:function(t,e){(0,o.default)(t,function(t,s,a){if(t)throw t;e(JSON.parse(a))})}},r.default.component("SearchDropdown",c.default),r.default.component("Tabs",u.default),r.default.component("Tab",v.default),e.default=function(t){var e=new r.default(Object.assign({},h.default,{cardData:t}));return new Promise(function(t){return t(e)})}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardEmbed",computed:{embedCode:function(){return"&#x3C;script&#x3E;(function(d,script){script=d.createElement(&#x27;script&#x27;);script.type=&#x27;text/javascript&#x27;;script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=&#x27;https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js&#x27;;d.getElementsByTagName(&#x27;head&#x27;)[0].appendChild(script);}(document));&#x3C;/script&#x3E;&#x3C;iframe frameborder=&#x22;0&#x22; width=&#x22;100%&#x22; src=&#x22;"+this.url+"&#x26;embed=true&#x22;&#x3E;&#x3C;/iframe&#x3E;"}},props:{url:String}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardFooter",props:{link:String}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardHeader",props:{config:Object}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardInfo"}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardShare",props:{url:String}}},function(t,e,s){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=s(23),r=a(i),n=s(20),o=a(n),l=s(24),c=a(l),d=s(22),u=a(d),f=s(21),v=a(f),p=s(7),h=a(p);e.default={components:{CardInfo:r.default,CardEmbed:o.default,CardShare:c.default,CardHeader:u.default,CardFooter:v.default},mixins:[h.default],name:"Glasovanja - seja",data:function(){var t=this.$options.cardData.data.results.map(function(t){var e=t.results.votes_for+t.results.against+t.results.abstain+t.results.not_present;return t.url="https://parlameter.si/seja/glasovanje/"+t.session.id+"/"+t.results.motion_id,t.accepted="accepted "+(t.results.result===!0?"aye":"nay"),t.accepted_glyph="glyphicon "+(t.results.result===!0?"glyphicon-ok":"glyphicon-remove"),t.percent_votes_for=Math.floor(t.results.votes_for/e*100),t.percent_against=Math.floor(t.results.against/e*100),t.percent_abstain=Math.floor(t.results.abstain/e*100),t.percent_not_present=Math.floor(t.results.not_present/e*100),t}),e=[{id:!0,class:"sprejet",label:"SPREJET",selected:!1},{id:!1,class:"zavrnjen",label:"ZAVRNJEN",selected:!1}],s=this.$options.cardData.data.tags.map(function(t){return{id:t,label:t,selected:!1}}),a="";if(this.$options.cardData.state){var i=this.$options.cardData.state;console.log("state"),console.log(i),i.text&&(a=i.text),i.tags&&s.map(function(t){i.tags.indexOf(t.id)!==-1&&(t.selected=!0)}),i.results&&e.map(function(t){i.results.indexOf(t.id)!==-1&&(t.selected=!0)})}return{data:this.$options.cardData.data,slugs:this.$options.cardData.urlsData,shortenedCardUrl:"",headerConfig:{circleIcon:"og-list",heading:"&nbsp;",subheading:"7. sklic parlamenta",alternative:"true"===this.$options.cardData.cardData.altHeader,title:this.$options.cardData.cardData.name},cardMethod:this.$options.cardData.cardData.method,cardGroup:this.$options.cardData.cardData.group,textFilter:a,votes:t,allTags:s,allResults:e}},computed:{generatedCardUrl:function(){var t={};return this.selectedTags.length>0&&(t.tags=this.selectedTags),this.textFilter.length>0&&(t.text=this.textFilter),this.selectedResults.length>0&&(t.results=this.selectedResults),"https://glej.parlameter.si/"+this.cardGroup+"/"+this.cardMethod+"/"+this.data.session.id+"?state="+encodeURIComponent(JSON.stringify(t))+"&altHeader=true"},filteredVotes:function(){return this.getFilteredVotes()},tagPlaceholder:function(){return this.selectedTags.length>0?"Izbranih: "+this.selectedTags.length:"Izberi"},dropdownItems:function(){var t=[];return this.votes.forEach(function(e){e.results.tags.forEach(function(e){t.indexOf(e)===-1&&t.push(e)})}),{tags:this.allTags.filter(function(e){return t.indexOf(e.id)>-1})}},selectedTags:function(){return this.allTags.filter(function(t){return t.selected}).map(function(t){return t.id})},selectedResults:function(){return this.allResults.filter(function(t){return t.selected}).map(function(t){return t.id})}},methods:{toggleResult:function(t){var e=this.allResults.filter(function(e){return e.id===t})[0];e.selected=!e.selected},getFilteredVotes:function(){var t=this,e=function(e){var s=""===t.textFilter||e.results.text.toLowerCase().indexOf(t.textFilter.toLowerCase())>-1,a=0===t.selectedTags.length||e.results.tags.filter(function(e){return t.selectedTags.indexOf(e)>-1}).length>0,i=0===t.selectedResults.length||t.selectedResults.indexOf(e.results.result)>-1;return s&&a&&i};return this.votes.filter(e)},shortenUrl:function(t){var e=this;return new Promise(function(s){$.get("https://parla.me/shortner/generate?url="+window.encodeURIComponent(t+"&frame=true"),function(t){e.$el.querySelector(".card-content-share button").textContent="KOPIRAJ",e.shortenedCardUrl=t,s(t)})})},measurePiwik:function(t,e,s){"function"==typeof measure&&(""!==e?measure("s","session-sort",e+" "+s,""):""!==t&&measure("s","session-filter",t,""))}},watch:{generatedCardUrl:function(t){var e=this;this.shortenUrl(t).then(function(t){return e.shortenedCardUrl=t})}},beforeMount:function(){console.log(this.generatedCardUrl),this.shortenUrl(this.generatedCardUrl)}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default={name:"SearchDropdown",data:function(){return{filter:"",active:!1,focused:-1}},watch:{filter:function(){this.focus(this.focused)}},computed:{filteredItems:function(){var t=this,e=function(e){return e.filter(function(e){return e.selected||e.label.toLowerCase().indexOf(t.filter.toLowerCase())>-1}).map(function(t,e){return t.sortIndex=e,t}).sort(function(e,s){if(!t.single){if(t.alphabetise&&Boolean(e.selected)===Boolean(s.selected))return e.label.localeCompare(s.label,"sl");if(e.selected&&!s.selected)return-1;if(!e.selected&&s.selected)return 1}return e.sortIndex<s.sortIndex?-1:e.sortIndex>s.sortIndex?1:0}).map(function(t){return delete t.sortIndex,t})};return this.groups?this.groups.map(function(s){var a=e(t.items.filter(function(t){return s.items.indexOf(t.id)>-1}));return a.forEach(function(t,e){t.groupLabel=0===e?s.label:null}),a}).reduce(function(t,e){return t.concat(e)},[]):e(this.items)},selectedIds:function(){return this.filteredItems.filter(function(t){return t.selected}).map(function(t){return t.id})},adjustedPlaceholder:function(){if(!this.single)return this.placeholder;var t=this.filteredItems.filter(function(t){return t.selected})[0];return t?t.label:this.placeholder}},directives:{clickOutside:{bind:function(t,e){var s=function(s){t.contains(s.target)||t===s.target||e.value(s)};t.vueClickOutside=s,document.addEventListener("click",s)},unbind:function(t){document.removeEventListener("click",t.vueClickOutside),t.vueClickOutside=null}}},props:{alphabetise:{type:Boolean,default:!0},groups:Array,items:{type:Array,required:!0},placeholder:{type:String,required:!0},selectCallback:Function,single:{type:Boolean,default:!1},small:{type:Boolean,default:!1}},methods:{selectItem:function(t){this.single?(this.clearSelection(),this.toggleItem(t),this.toggleDropdown(!1)):this.toggleItem(t),this.selectCallback&&this.selectCallback(t)},toggleItem:function(t){var e=this.items.filter(function(e){return e.id===t})[0];this.$set(e,"selected",!e.selected)},toggleDropdown:function(t){t===!1&&(this.filter=""),this.active=t},clearSelection:function(){this.selectedIds.forEach(this.toggleItem)},focus:function(t,e){if(this.focused=Math.max(Math.min(this.filteredItems.length-1,t),-1),e){var s=this.filteredItems.slice(0,this.focused+1).map(function(t){return t.groupLabel?1:0}).reduce(function(t,e){return t+e},0),a=this.$el.lastChild,i=23*(this.focused+s);i<a.scrollTop?a.scrollTop=i:i>a.scrollTop+207&&(a.scrollTop=i-207)}}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"Tab",props:{header:{type:String,required:!0}},created:function(){this.$parent.tabs.push(this),this.$parent.headers.push(this.header)},computed:{show:function(){return this.$parent.show===this}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"Tabs",data:function(){return{tabs:[],headers:[],active:null,show:null}},watch:{active:function(t){this.show=this.tabs[t]}},mounted:function(){this.active=0},methods:{select:function(t){this.active!==t&&(this.active=t,this.switchCallback&&this.switchCallback(t))}},props:{dark:{type:Boolean,default:!1},switchCallback:Function}}},function(t,e){},function(t,e){},function(t,e,s){var a=s(0)(s(9),s(28),null,null);t.exports=a.exports},function(t,e,s){var a=s(0)(s(10),s(29),null,null);t.exports=a.exports},function(t,e,s){var a=s(0)(s(11),s(26),null,null);t.exports=a.exports},function(t,e,s){var a=s(0)(s(12),s(33),null,null);t.exports=a.exports},function(t,e,s){var a=s(0)(s(13),s(27),null,null);t.exports=a.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"tab-content"},[t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card-header"},[t.config.alternative?[s("div",{staticClass:"alt-header-container"},[s("div",{staticClass:"alt-header"},[t.config.circleText?s("div",{staticClass:"media-object img-circle session-logo",class:t.config.circleClass},[s("b",[t._v(t._s(t.config.circleText))])]):t.config.circleImage?s("img",{staticClass:"portrait column",attrs:{src:"https://cdn.parlameter.si/v1/parlassets/img/people/square/"+t.config.circleImage+".png"}}):t.config.circleIcon?s("div",{staticClass:"icon-circle"},[s("img",{attrs:{src:"https://cdn.parlameter.si/v1/parlassets/icons/"+t.config.circleIcon+".svg"}})]):t._e(),t._v(" "),s("div",{staticClass:"header-info-container"},[s("h1",{domProps:{innerHTML:t._s(t.config.heading)}}),t._v(" "),s("h2",{staticClass:"partyinfo"},[t._v(t._s(t.config.subheading))]),t._v(" "),s("h2",{staticClass:"cardname"},[t._v(t._s(t.config.title))])])]),t._v(" "),s("div",{staticClass:"alt-header-border"})])]:[s("div",{staticClass:"card-header-border"}),t._v(" "),s("h1",[t._v(t._s(t.config.title))])]],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card-content-share hidden"},[s("div",{staticClass:"card-back-content"},[s("div",{staticClass:"share-content"},[s("label",{attrs:{for:"share-url"}},[t._v("Neposredna povezava do kartice")]),t._v(" "),s("input",{staticClass:"form-control share-url",attrs:{type:"url",id:"share-url"},domProps:{value:t.url}}),t._v(" "),s("button",{staticClass:"btn-parlameter btn-full-width btn-blue"},[t._v("KOPIRAJ")])])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card-content-embed hidden"},[s("div",{staticClass:"card-back-content"},[s("div",{staticClass:"embed-content"},[s("div",{staticClass:"embed-divider"}),t._v(" "),t._m(0),t._v(" "),s("div",{staticClass:"embed-divider"}),t._v(" "),s("div",{staticClass:"embed-script"},[s("textarea",{staticClass:"form-control",attrs:{"data-id":"","data-url":t.url},domProps:{innerHTML:t._s(t.embedCode)}}),t._v(" "),s("button",{staticClass:"btn-parlameter btn-full-width btn-blue btn-copy-embed"},[t._v("KOPIRAJ")])])])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"embed-switch-container"},[s("div",{staticClass:"embed-label"},[t._v("Podatki naj se vedno osvežujejo")]),t._v(" "),s("div",{staticClass:"embed-switch-big-box"},[s("div",{staticClass:"embed-switch-box"},[s("div",{staticClass:"embed-switch"},[s("div",{staticClass:"embed-switches"},[s("div",{staticClass:"leftswitch"},[t._v("DA")]),t._v(" "),s("div",{staticClass:"rightswitch"},[t._v("NE")])])])]),t._v(" "),s("div",{staticClass:"embed-switch-ball"})])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card-footer"},[s("div",{staticClass:"card-logo hidden"},[s("a",{attrs:{href:t.link}},[s("img",{attrs:{src:"https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg",alt:"parlameter logo"}})])]),t._v(" "),s("div",{staticClass:"card-circle-button card-share",attrs:{"data-back":"share"}}),t._v(" "),s("div",{staticClass:"card-circle-button card-embed",attrs:{"data-back":"embed"}}),t._v(" "),s("div",{staticClass:"card-circle-button card-info",attrs:{"data-back":"info"}},[t._v("i")])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:function(){t.toggleDropdown(!1)},expression:"function() { toggleDropdown(false) }"}],class:["search-dropdown",{small:t.small}]},[t.selectedIds.length>0?s("div",{staticClass:"search-dropdown-clear",on:{click:t.clearSelection}},[t._v("×")]):t._e(),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.filter,expression:"filter"}],staticClass:"search-dropdown-input",attrs:{type:"text",placeholder:t.adjustedPlaceholder},domProps:{value:t.filter},on:{focus:function(e){t.toggleDropdown(!0)},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),t.selectItem(t.filteredItems[t.focused].id)},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;e.preventDefault(),t.focus(t.focused-1,!0)},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;e.preventDefault(),t.focus(t.focused+1,!0)}],input:function(e){e.target.composing||(t.filter=e.target.value)}}}),t._v(" "),s("ul",{class:["search-dropdown-options",{visible:this.active}],on:{mouseleave:function(e){t.focus(-1)}}},[t._l(t.filteredItems,function(e,a){return[e.groupLabel?s("li",{staticClass:"search-dropdown-group-label"},[t._v("\n        "+t._s(e.groupLabel)+"\n      ")]):t._e(),t._v(" "),s("li",{class:{selected:e.selected,focused:t.focused===a},on:{click:function(s){t.selectItem(e.id)},mouseenter:function(e){t.focus(a)}}},[s("div",{staticClass:"search-dropdown-label"},[t._v(t._s(e.label))]),t._v(" "),e.count?s("div",[t._v(t._s(e.count))]):t._e()])]})],2)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card-container card-halfling card-glasovanja-seja",attrs:{id:t.$options.cardData.cardData._id}},[s("card-header",{attrs:{config:t.headerConfig}}),t._v(" "),s("div",{staticClass:"card-content"},[s("div",{staticClass:"card-content-front"},[s("div",{staticClass:"filters"},[s("div",{staticClass:"filter option-party-buttons"},t._l(t.allResults,function(e){return s("div",{class:["party-button",e.class,{selected:t.selectedResults.indexOf(e.id)>-1}],on:{click:function(s){t.toggleResult(e.id)}}},[t._v(t._s(e.label))])})),t._v(" "),s("div",{staticClass:"filter text-filter"},[s("div",{staticClass:"filter-label"},[t._v("Išči po naslovu glasovanja")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.textFilter,expression:"textFilter"}],staticClass:"text-filter-input",attrs:{type:"text"},domProps:{value:t.textFilter},on:{input:function(e){e.target.composing||(t.textFilter=e.target.value)}}})]),t._v(" "),s("div",{staticClass:"filter tag-dropdown"},[s("div",{staticClass:"filter-label"},[t._v("Matično delovno telo")]),t._v(" "),s("search-dropdown",{attrs:{items:t.dropdownItems.tags,placeholder:t.tagPlaceholder}})],1)]),t._v(" "),s("div",{staticClass:"date-list",attrs:{id:"votingCard"}},[s("div",{staticClass:"session_voting"},t._l(t.filteredVotes,function(e){return s("div",{staticClass:"clearfix single_voting"},[e.results.is_outlier?s("div",{staticClass:"fire-badge"}):t._e(),t._v(" "),e.results.has_outliers&&e.results.is_outlier?s("div",{staticClass:"lightning-badge"}):t._e(),t._v(" "),e.results.has_outliers&&!e.results.is_outlier?s("div",{staticClass:"lightning-badge",staticStyle:{left:"-7px"}}):t._e(),t._v(" "),s("a",{attrs:{href:e.url}},[s("div",{staticClass:" col-md-1 "},[s("div",{class:e.accepted},[s("p",[s("i",{class:e.accepted_glyph})])])]),t._v(" "),s("div",{staticClass:"col-md-11 border-left "},[s("div",{staticClass:"col-md-6 "},[s("div",{staticClass:"session_title "},[s("p",[t._v("\n                      "+t._s(e.results.text)+"\n                    ")])])]),t._v(" "),s("div",{staticClass:"col-md-6 "},[s("div",{staticClass:"session_votes "},[s("div",{staticClass:"progress smallbar "},[s("div",{staticClass:"progress-bar fontblue ",style:{width:e.percent_votes_for+"%"}},[s("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_votes_for)+"% votes for")])]),t._v(" "),s("div",{staticClass:"progress-bar funblue ",style:{width:e.percent_against+"%"}},[s("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_against)+"% votes for")])]),t._v(" "),s("div",{staticClass:"progress-bar ignoreblue ",style:{width:e.percent_abstain+"%"}},[s("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_abstain)+"% votes for")])]),t._v(" "),s("div",{staticClass:"progress-bar noblue ",style:{width:e.percent_not_present+"%"}},[s("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_not_present)+"% votes for")])])]),t._v(" "),s("div",{staticClass:"row "},[s("div",{staticClass:"col-xs-3 "},[t._v("\n                        "+t._s(e.results.votes_for)+"\n                        "),s("div",{staticClass:"type "},[t._v("Za")]),t._v(" "),s("div",{staticClass:"indicator aye "},[t._v(" ")])]),t._v(" "),s("div",{staticClass:"col-xs-3 "},[t._v("\n                        "+t._s(e.results.against)+"\n                        "),s("div",{staticClass:"type "},[t._v("Proti")]),t._v(" "),s("div",{staticClass:"indicator ney "},[t._v(" ")])]),t._v(" "),s("div",{staticClass:"col-xs-3 "},[t._v("\n                        "+t._s(e.results.abstain)+"\n                        "),s("div",{staticClass:"type "},[t._v("Vzdržan")]),t._v(" "),s("div",{staticClass:"indicator abstention "},[t._v(" ")])]),t._v(" "),s("div",{staticClass:"col-xs-3 "},[t._v("\n                        "+t._s(e.results.not_present)+"\n                        "),s("div",{staticClass:"type "},[t._v("Niso")]),t._v(" "),s("div",{staticClass:"indicator not "},[t._v(" ")])])])])])])])])}))])]),t._v(" "),s("card-info",[s("p",{staticClass:"info-text lead"},[t._v("Pregled vseh glasovanj, ki so se zgodila na seji")]),t._v(" "),s("p",{staticClass:"info-text heading"},[t._v("METODOLOGIJA")]),t._v(" "),s("p",{staticClass:"info-text"},[t._v("Za vsa glasovanja na posamezni seji preštejemo vse glasove (ZA, PROTI, VZDRŽAN/-A) in število poslancev, ki niso glasovali, ter izpišemo rezultate.")]),t._v(" "),s("p",{staticClass:"info-text"},[t._v("Nabor glasovanj pridobimo s spletnega mesta "),s("a",{attrs:{href:"http://www.dz-rs.si"}},[t._v("DZ RS")]),t._v(".")]),t._v(" "),s("p",{staticClass:"info-text"},[t._v("Za označevanje nepričakovanih rezultatov glasovanj uporabljamo probabilistično metodo analize glavnih komponent, "),s("a",{attrs:{href:"http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html"}},[t._v("kot je implementirana v knjižicah scikit-learn")]),t._v(" in opisana v "),s("a",{attrs:{href:"http://www.miketipping.com/papers/met-mppca.pdf"}},[t._v("M. Tipping and C. Bishop, Probabilistic Principal Component Analysis, Journal of the Royal Statistical Society, Series B, 61, Part 3, pp. 611-622")]),t._v(".")]),t._v(" "),s("p",{staticClass:"info-text"},[t._v("Vsa glasovanja pretvorimo v štiridimenzionalne vektorje, kjer vsaka od komponent pomeni število oddanih glasovnic s specifičnim glasom (ZA, PROTI, NI, VZDRŽAN). PCA model prilagodimo matriki in s funkcijo "),s("a",{attrs:{href:"https://github.com/scikit-learn/scikit-learn/blob/14031f6/sklearn/decomposition/pca.py#L485"}},[t._v("score_samples")]),t._v(' pridobimo "log-likelihood" vsakega glasovanja v našem modelu. Model deluje tako, da skuša pri prilagajanju "log-likelihood" vrednost maksimizirati za čim več glasovanj. Ko smo pridobili vse "log-likelihood" vrednosti jih razvrstimo od najmanjše proti največji in uporabimo četrtino vseh glasovanj, ki se modelu najslabše prilegajo. Ker v primerjavi z našim modelom ta glasovanja najbolj izstopajo, so kot taka najbolj "nepričakovana." V kartici jih označimo z ikono ognja.')])]),t._v(" "),s("card-embed",{attrs:{url:t.generatedCardUrl}}),t._v(" "),s("card-share",{attrs:{url:t.shortenedCardUrl}})],1),t._v(" "),s("card-footer",{attrs:{link:t.slugs.base}})],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{class:["tabs",{dark:t.dark}]},[s("ul",{staticClass:"tabs-headers"},t._l(t.headers,function(e,a){return s("li",{class:["tabs-header",{active:a===t.active}],on:{click:function(e){t.select(a)}}},[s("span",[t._v(t._s(e))])])})),t._v(" "),s("div",{staticClass:"tabs-content"},[t._t("default")],2)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card-content-info hidden"},[s("div",{staticClass:"card-back-content"},[t._t("default")],2)])},staticRenderFns:[]}}]);