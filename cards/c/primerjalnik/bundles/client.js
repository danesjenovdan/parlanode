!function(t){function e(s){if(a[s])return a[s].exports;var r=a[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var a={};e.m=t,e.c=a,e.i=function(t){return t},e.d=function(t,a,s){e.o(t,a)||Object.defineProperty(t,a,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=10)}([function(t,e){t.exports=function(t,e,a,s,r){var n,i=t=t||{},o=typeof t.default;"object"!==o&&"function"!==o||(n=t,i=t.default);var l="function"==typeof i?i.options:i;e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns),s&&(l._scopeId=s);var c;if(r?(c=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),a&&a.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(r)},l._ssrRegister=c):a&&(c=a),c){var d=l.functional,u=d?l.render:l.beforeCreate;d?l.render=function(t,e){return c.call(e),u(t,e)}:l.beforeCreate=u?[].concat(u,c):[c]}return{esModule:n,exports:i,options:l}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={mounted:function(){makeEmbedSwitch(),activateCopyButton(),addCardRippling()}}},function(t,e,a){var s=a(0)(a(12),a(27),null,null,null);t.exports=s.exports},function(t,e,a){var s=a(0)(a(13),a(28),null,null,null);t.exports=s.exports},function(t,e,a){var s=a(0)(a(14),a(25),null,null,null);t.exports=s.exports},function(t,e,a){var s=a(0)(a(15),a(32),null,null,null);t.exports=s.exports},function(t,e,a){var s=a(0)(a(16),a(26),null,null,null);t.exports=s.exports},function(t,e){t.exports={_id:"random_id",name:"Primerjalnik glasovanj",dataUrl:"https://analize.parlameter.si/v1/p/getListOfMembersTickers/",type:"primerjalnik",lastUpdate:"2017-06-02T15:18:08.135Z",method:"primerjalnik",group:"c"}},function(t,e,a){function s(t){a(22),a(21)}var r=a(0)(a(18),a(31),s,"data-v-ba7957b8",null);t.exports=r.exports},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=a(5),n=s(r),i=a(2),o=s(i),l=a(6),c=s(l),d=a(4),u=s(d),f=a(3),p=s(f),v=a(1),m=s(v);e.default={components:{CardInfo:n.default,CardEmbed:o.default,CardShare:c.default,CardHeader:u.default,CardFooter:p.default},mixins:[m.default]}},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}var r=a(8),n=s(r),i=a(7),o=s(i);new Vue(Object.assign({},n.default,{cardData:window.__INITIAL_STATE__})).$mount("#"+o.default._id)},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"DateRow",props:{data:Array},computed:{rows:function(){var t=this,e=this.data.reduce(function(t,e){return-1===t.indexOf(e.results.tags[0])&&t.push(e.results.tags[0]),t},[]).map(function(e){var a=t.data.filter(function(t){return t.results.tags[0]===e}).length;return{name:e,occurences:a,widthPercentage:0,percentage:0}});console.log(e);var a=e.map(function(t){return t.occurences}).reduce(function(t,e){return Math.max(t,e)},0);return console.log(a),e.map(function(e){return console.log(e),e.widthPercentage=e.occurences/a*80,e.percentage=(e.occurences/t.data.length*100).toFixed(2),e}).sort(function(t,e){return e.occurences-t.occurences})}},watch:{data:function(){this.renderChart()}}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardEmbed",computed:{embedCode:function(){return"&#x3C;script&#x3E;(function(d,script){script=d.createElement(&#x27;script&#x27;);script.type=&#x27;text/javascript&#x27;;script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=&#x27;https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js&#x27;;d.getElementsByTagName(&#x27;head&#x27;)[0].appendChild(script);}(document));&#x3C;/script&#x3E;&#x3C;iframe frameborder=&#x22;0&#x22; width=&#x22;100%&#x22; src=&#x22;"+this.url+"&#x26;embed=true&#x22;&#x3E;&#x3C;/iframe&#x3E;"}},props:{url:String}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardFooter",props:{link:String}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardHeader",props:{config:Object}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardInfo"}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"CardShare",props:{url:String}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"DateRow",props:{data:Array},mounted:function(){this.renderChart()},methods:{renderChart:function(){function t(){var t=d.invert(d3.mouse(this)[0]-a.left),e=i(l,t,1),s=l[e-1],r=l[e];if(e<l.length){var o=t-s.date>r.date-t?r:s,c=t-s.date>r.date-t?d3.selectAll(".dot circle")[0][e]:d3.selectAll(".dot circle")[0][e-1];d3.select(c).classed("hovered")||(d3.select(".dot circle.hovered").classed("hovered",!1).transition().duration(200).attr("r",4),d3.select(c).classed("hovered",!0).transition().duration(200).ease("linear").attr("r",7)),e>2&&e<l.length-3.5?v.attr("transform","translate("+d(o.date)+","+u(o.occurences)+")"):e<3?v.attr("transform","translate("+d(l[2].date)+","+u(o.occurences)+")"):v.attr("transform","translate("+d(l[l.length-4].date)+","+u(o.occurences)+")"),v.select("text").text(n.timeFormat("%B %Y")(o.date)+" | "+o.occurences)}}var e=this;$(".timechart svg").remove();var a={top:50,right:30,bottom:30,left:30},s=960-a.left-a.right,r=400-a.top-a.bottom,n=d3.locale({decimal:",",thousands:" ",grouping:[3],currency:["EUR",""],dateTime:"%d. %m. %Y %H:%M",date:"%d. %m. %Y",time:"%H:%M:%S",periods:["AM","PM"],days:["nedelja","ponedeljek","torek","sreda","četrtek","petek","sobota"],shortDays:["ned","pon","tor","sre","čet","pet","sob"],months:["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december"],shortMonths:["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec"]}),i=d3.bisector(function(t){return t.date}).left,o=d3.time.format("%d. %m. %Y").parse,l=this.data.reduce(function(t,e){return-1===t.indexOf(e.session.date)&&t.push(e.session.date),t},[]).map(function(t){return{date:o(t),occurences:e.data.filter(function(e){return e.session.date===t}).length}}).sort(function(t,e){return console.log(t.date<e.date),t.date-e.date}),c=d3.select(".timechart").append("svg").attr("class","smalldata").attr("viewBox","0 0 960 400").attr("preserveAspectRatio","xMidYMid meet").append("g").attr("transform","translate("+a.left+","+a.top+")");d3.select(c.node().parentNode).append("rect").attr("class","overlay").attr("width","100%").attr("height","100%").style("fill","transparent").on("mouseover",function(){v.style("display",null)}).on("mouseout",function(){v.style("display","none")}).on("mousemove",t);var d=d3.time.scale().range([0,s]),u=d3.scale.linear().range([r,0]);d.domain(d3.extent(l,function(t){return t.date})),u.domain([0,d3.max(l,function(t){return t.occurences})]);var f=d3.svg.axis().scale(d).orient("bottom").tickFormat(n.timeFormat("%b %y"));d3.svg.axis().scale(u).orient("left");c.append("g").attr("class","x axis bigdata").attr("transform","translate(0,"+r+")").call(f);var p=d3.svg.line().x(function(t){return d(t.date)}).y(function(t){return u(t.occurences)});console.log(p),c.append("path").datum(l).attr("class","line").attr("d",p),c.selectAll("g.dot").data(l).enter().append("g").attr("class","dot").append("circle").attr("r",4).attr("cx",function(t,e){return console.log(t.date),d(t.date)}).attr("cy",function(t,e){return u(t.occurences)}).on("mouseover",function(t){tooltipdiv.transition().duration(200).style("opacity",.9),tooltipdiv.html(t.occurences).style("left",d3.event.pageX-tooltipdiv.node().getBoundingClientRect().width/2-$(".timechart").offset().left+10+"px").style("top",d3.event.pageY-$(".timechart").offset().top-30+"px")}).on("mouseout",function(t){tooltipdiv.transition().duration(200).style("opacity",0)});var v=c.append("g").attr("class","focus").style("display","none");v.append("rect").attr("width",150).attr("height",25).attr("y",-35).attr("x",-75).style("rx",3).style("yx",3),v.append("text").style("fill","#ffffff").attr("text-anchor","middle").attr("y",-18)}},watch:{data:function(){this.renderChart()}}}},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=a(5),n=s(r),i=a(2),o=s(i),l=a(6),c=s(l),d=a(4),u=s(d),f=a(3),p=s(f),v=a(1),m=s(v),h=a(9),_=(s(h),a(24)),g=s(_),C=a(23),b=s(C);e.default={components:{CardInfo:n.default,CardEmbed:o.default,CardShare:c.default,CardHeader:u.default,CardFooter:p.default,TimeChart:g.default,BarChart:b.default},mixins:[m.default],name:"ImeKartice",data:function(){return{parties:[],samePeople:[],differentPeople:[],special:!1,data:[],total:0,slugs:this.$options.cardData.urlsData,shortenedCardUrl:"",headerConfig:{circleIcon:"og-list",heading:"&nbsp;",subheading:"7. sklic parlamenta",alternative:"true"===this.$options.cardData.cardData.altHeader,title:this.$options.cardData.cardData.name}}},computed:{samePeoplePlaceholder:function(){return this.selectedSamePeople.length>0?"Izbranih: "+this.selectedSamePeople.length:"Izberi poslance"},differentPeoplePlaceholder:function(){return this.selectedDifferentPeople.length>0?"Izbranih: "+this.selectedDifferentPeople.length:"Izberi poslance"},generatedCardUrl:function(){return"https://glej.parlameter.si/group/method/"},filteredVotes:function(){return this.getFilteredVotes()},queryUrl:function(){var t="https://analize.parlameter.si/v1/s/getComparedVotes/";return this.special?t+"?people_same="+this.selectedSamePeople.map(function(t){return t.id}).toString()+"&parties_same="+this.sameParties.map(function(t){return t.id}).toString()+"&people_different="+this.selectedDifferentPeople.map(function(t){return t.id}).toString()+"&parties_different="+this.differentParties.map(function(t){return t.id}).toString()+"&special=true":t+"?people_same="+this.selectedSamePeople.map(function(t){return t.id}).toString()+"&parties_same="+this.sameParties.map(function(t){return t.id}).toString()+"&people_different="+this.selectedDifferentPeople.map(function(t){return t.id}).toString()+"&parties_different="+this.differentParties.map(function(t){return t.id}).toString()},votes:function(){return this.data.map(function(t){var e=t.results.votes_for+t.results.against+t.results.abstain+t.results.not_present;return t.url="https://parlameter.si/seja/glasovanje/"+t.session.id+"/"+t.results.motion_id,t.accepted="accepted "+(!0===t.results.result?"aye":"nay"),t.accepted_glyph="glyphicon "+(!0===t.results.result?"glyphicon-ok":"glyphicon-remove"),t.percent_votes_for=Math.floor(t.results.votes_for/e*100),t.percent_against=Math.floor(t.results.against/e*100),t.percent_abstain=Math.floor(t.results.abstain/e*100),t.percent_not_present=Math.floor(t.results.not_present/e*100),t})},sameParties:function(){return this.parties.filter(function(t){return t.isSame})},differentParties:function(){return this.parties.filter(function(t){return t.isDifferent})},selectedSamePeople:function(){return this.samePeople.filter(function(t){return t.selected})},selectedDifferentPeople:function(){return this.differentPeople.filter(function(t){return t.selected})}},mounted:function(){var t=this;$.ajax({url:"https://data.parlameter.si/v1/getAllPGs/",method:"GET",success:function(e){var a=[];for(var s in e)a.push({id:e[s].id,acronym:e[s].acronym,is_coalition:e[s].is_coalition,name:e[s].name,isSame:!1,isDifferent:!1});t.parties=a},error:function(t){alert(JSON.stringify(t))}}),$.ajax({url:"https://data.parlameter.si/v1/getMPs/",method:"GET",success:function(e){var a=JSON.parse(JSON.stringify(e));t.samePeople=a.map(function(t){return t.selected=!1,t.label=t.name,t});var s=JSON.parse(JSON.stringify(e));t.differentPeople=s.map(function(t){return t.selected=!1,t.label=t.name,t})},error:function(t){alert(JSON.stringify(t))}})},methods:{handleCheckbox:function(t){this.special=!this.special},focusTab:function(t){},round:function(t,e){return Number(Math.round(t+"e"+e)+"e-"+e)},togglePartySame:function(t){t.isDifferent=!1,t.isSame=!t.isSame},togglePartyDifferent:function(t){t.isDifferent=!t.isDifferent,t.isSame=!1},openModalSame:function(){$("#modal-primerjalnik-same").modal("show")},openModalDifferent:function(){$("#modal-primerjalnik-different").modal("show")},loadResults:function(){if(this.selectedSamePeople.length+this.sameParties.length>1){console.log("loading results"),console.log(this.queryUrl);var t=this;$.ajax({url:t.queryUrl,method:"GET",success:function(e){console.log("results loaded"),console.log(e),t.data=e.results,t.total=e.total,$(".modal").modal("hide")},error:function(t){alert(JSON.stringify(t))}})}else if(this.selectedSamePeople.length+this.sameParties.length===1&&this.selectedDifferentPeople.length+this.differentParties.length>0){console.log("loading results"),console.log(this.queryUrl);var e=this;$.ajax({url:e.queryUrl,method:"GET",success:function(t){console.log("results loaded"),console.log(t),e.data=t.results,e.total=t.total,$(".modal").modal("hide")},error:function(t){alert(JSON.stringify(t))}})}else alert("nimaš izbranih dovolj pogojev za primerjavo")},getFilteredVotes:function(){return this.votes},shortenUrl:function(t){var e=this;return new Promise(function(a){$.get("https://parla.me/shortner/generate?url="+window.encodeURIComponent(t+"&frame=true"),function(t){e.$el.querySelector(".card-content-share button").textContent="KOPIRAJ",a(t)})})},measurePiwik:function(t,e,a){"function"==typeof measure&&(""!==e?measure("s","session-sort",e+" "+a,""):""!==t&&measure("s","session-filter",t,""))}},watch:{generatedCardUrl:function(t){var e=this;this.shortenUrl(t).then(function(t){return e.shortenedCardUrl=t})},selectedSamePeople:function(t){var e=this;t.forEach(function(t){e.selectedDifferentPeople.filter(function(e){return e.id===t.id}).map(function(t){t.selected=!1})})},selectedDifferentPeople:function(t){var e=this;t.forEach(function(t){e.selectedSamePeople.filter(function(e){return e.id===t.id}).map(function(t){t.selected=!1})})}},beforeMount:function(){this.shortenUrl(this.generatedCardUrl)}}},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e,a){function s(t){a(20)}var r=a(0)(a(11),a(30),s,null,null);t.exports=r.exports},function(t,e,a){function s(t){a(19)}var r=a(0)(a(17),a(29),s,null,null);t.exports=r.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-header"},[t.config.alternative?[a("div",{staticClass:"alt-header-container"},[a("div",{staticClass:"alt-header"},[t.config.circleText?a("div",{staticClass:"media-object img-circle session-logo",class:t.config.circleClass},[a("b",[t._v(t._s(t.config.circleText))])]):t.config.circleImage?a("img",{staticClass:"portrait column",attrs:{src:"https://cdn.parlameter.si/v1/parlassets/img/people/square/"+t.config.circleImage+".png"}}):t.config.circleIcon?a("div",{staticClass:"icon-circle"},[a("img",{attrs:{src:"https://cdn.parlameter.si/v1/parlassets/icons/"+t.config.circleIcon+".svg"}})]):t._e(),t._v(" "),a("div",{staticClass:"header-info-container"},[a("h1",{domProps:{innerHTML:t._s(t.config.heading)}}),t._v(" "),a("h2",{staticClass:"partyinfo"},[t._v(t._s(t.config.subheading))]),t._v(" "),a("h2",{staticClass:"cardname"},[t._v(t._s(t.config.title))])])]),t._v(" "),a("div",{staticClass:"alt-header-border"})])]:[a("div",{staticClass:"card-header-border"}),t._v(" "),a("h1",[t._v(t._s(t.config.title))])]],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-content-share hidden"},[a("div",{staticClass:"card-back-content"},[a("div",{staticClass:"share-content"},[a("label",{attrs:{for:"share-url"}},[t._v("Neposredna povezava do kartice")]),t._v(" "),a("input",{staticClass:"form-control share-url",attrs:{type:"url",id:"share-url"},domProps:{value:t.url}}),t._v(" "),a("button",{staticClass:"btn-parlameter btn-full-width btn-blue"},[t._v("KOPIRAJ")])])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-content-embed hidden"},[a("div",{staticClass:"card-back-content"},[a("div",{staticClass:"embed-content"},[a("div",{staticClass:"embed-divider"}),t._v(" "),t._m(0),t._v(" "),a("div",{staticClass:"embed-divider"}),t._v(" "),a("div",{staticClass:"embed-script"},[a("textarea",{staticClass:"form-control",attrs:{"data-id":"","data-url":t.url},domProps:{innerHTML:t._s(t.embedCode)}}),t._v(" "),a("button",{staticClass:"btn-parlameter btn-full-width btn-blue btn-copy-embed"},[t._v("KOPIRAJ")])])])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"embed-switch-container"},[a("div",{staticClass:"embed-label"},[t._v("Podatki naj se vedno osvežujejo")]),t._v(" "),a("div",{staticClass:"embed-switch-big-box"},[a("div",{staticClass:"embed-switch-box"},[a("div",{staticClass:"embed-switch"},[a("div",{staticClass:"embed-switches"},[a("div",{staticClass:"leftswitch"},[t._v("DA")]),t._v(" "),a("div",{staticClass:"rightswitch"},[t._v("NE")])])])]),t._v(" "),a("div",{staticClass:"embed-switch-ball"})])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-footer"},[a("div",{staticClass:"card-logo hidden"},[a("a",{attrs:{href:t.link}},[a("img",{attrs:{src:"https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg",alt:"parlameter logo"}})])]),t._v(" "),a("div",{staticClass:"card-circle-button card-share",attrs:{"data-back":"share"}}),t._v(" "),a("div",{staticClass:"card-circle-button card-embed",attrs:{"data-back":"embed"}}),t._v(" "),a("div",{staticClass:"card-circle-button card-info",attrs:{"data-back":"info"}},[t._v("i")])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"timechart",on:{click:t.renderChart}})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ul",{staticClass:"party-list"},t._l(t.rows,function(e){return a("li",{staticClass:"labeled-chart"},[a("div",{staticClass:"column chart-label"},[t._v("\n        "+t._s(e.name)+"\n      ")]),t._v(" "),a("div",{staticClass:"column chart"},[a("div",{staticClass:"progress hugebar"},[a("div",{staticClass:"progress-bar funblue",style:{width:e.widthPercentage+"%"},attrs:{role:"progressbar"}}),t._v(" "),a("div",{staticClass:"progress_number"},[t._v(t._s(e.occurences+" | "+e.percentage)+" %")])])])])}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-container card-halfling card-IME_KARTICE",attrs:{id:t.$options.cardData.cardData._id}},[a("card-header",{attrs:{config:t.headerConfig}}),t._v(" "),a("div",{staticClass:"card-content"},[a("div",{staticClass:"card-content-front"},[a("div",{staticClass:"primerjalnik"},[t._v("\n        Zanima me, na katerih glasovanjih so "),a("span",{staticClass:"primerjalnik-for"},[t._l(t.sameParties,function(e){return a("span",[t._v(t._s(e.acronym)+" ")])}),t._v(" "),t._l(t.selectedSamePeople,function(e){return a("span",[t._v(t._s(e.name)+" ")])}),a("span",{staticClass:"plus",on:{click:t.openModalSame}})],2),t._v(" glasovali enako, "),a("span",{staticClass:"primerjalnik-against"},[t._l(t.differentParties,function(e){return a("span",[t._v(t._s(e.acronym)+" ")])}),t._v(" "),t._l(t.selectedDifferentPeople,function(e){return a("span",[t._v(t._s(e.name)+" ")])}),a("span",{staticClass:"plus",on:{click:t.openModalDifferent}})],2),t._v(" pa drugače od njih.\n      ")]),t._v(" "),a("div",{staticClass:"special-container"},[a("div",{staticClass:"searchfilter-checkbox"},[a("input",{staticClass:"checkbox",attrs:{id:"rev",type:"checkbox"},domProps:{checked:t.special},on:{click:t.handleCheckbox}}),t._v(" "),a("label",{attrs:{for:"rev"}},[t._v('Ignoriraj "odsotne" glasovnice')])])]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12"},[a("button",{staticClass:"loadme",on:{click:t.loadResults}},[t._v("Naloadaj")])])]),t._v(" "),a("div",[t._v(t._s(t.votes.length)+" filtriranih glasovanj predstavlja "+t._s(0===t.total?0:t.round(t.votes.length/t.total*100,2))+"%\n        vseh glasovanj.")]),t._v(" "),a("div",[t._v(t._s(t.queryUrl))]),t._v(" "),a("tabs",{attrs:{dark:"","switch-callback":t.focusTab}},[a("tab",{attrs:{header:"Seznam glasovanj"}},[a("div",{staticClass:"seznam-glasovanj-container"},[a("div",{staticClass:"date-list",attrs:{id:"votingCard"}},[a("div",{staticClass:"session_voting"},t._l(t.filteredVotes,function(e){return a("div",{staticClass:"clearfix single_voting"},[e.results.is_outlier?a("div",{staticClass:"fire-badge"}):t._e(),t._v(" "),e.results.has_outliers&&e.results.is_outlier?a("div",{staticClass:"lightning-badge"}):t._e(),t._v(" "),e.results.has_outliers&&!e.results.is_outlier?a("div",{staticClass:"lightning-badge",staticStyle:{left:"-7px"}}):t._e(),t._v(" "),a("a",{attrs:{href:e.url}},[a("div",{staticClass:" col-md-1 "},[a("div",{class:e.accepted},[a("p",[a("i",{class:e.accepted_glyph})])])]),t._v(" "),a("div",{staticClass:"col-md-11 border-left "},[a("div",{staticClass:"col-md-6 "},[a("div",{staticClass:"session_title "},[a("p",[t._v("\n                            "+t._s(e.results.text)+"\n                          ")])])]),t._v(" "),a("div",{staticClass:"col-md-6 "},[a("div",{staticClass:"session_votes "},[a("div",{staticClass:"progress smallbar "},[a("div",{staticClass:"progress-bar fontblue ",style:{width:e.percent_votes_for+"%"}},[a("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_votes_for)+"% votes for")])]),t._v(" "),a("div",{staticClass:"progress-bar funblue ",style:{width:e.percent_against+"%"}},[a("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_against)+"% votes for")])]),t._v(" "),a("div",{staticClass:"progress-bar ignoreblue ",style:{width:e.percent_abstain+"%"}},[a("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_abstain)+"% votes for")])]),t._v(" "),a("div",{staticClass:"progress-bar noblue ",style:{width:e.percent_not_present+"%"}},[a("span",{staticClass:"sr-only "},[t._v(t._s(e.percent_not_present)+"% votes for")])])]),t._v(" "),a("div",{staticClass:"row "},[a("div",{staticClass:"col-xs-3 "},[t._v("\n                              "+t._s(e.results.votes_for)+"\n                              "),a("div",{staticClass:"type "},[t._v("Za")]),t._v(" "),a("div",{staticClass:"indicator aye "},[t._v(" ")])]),t._v(" "),a("div",{staticClass:"col-xs-3 "},[t._v("\n                              "+t._s(e.results.against)+"\n                              "),a("div",{staticClass:"type "},[t._v("Proti")]),t._v(" "),a("div",{staticClass:"indicator ney "},[t._v(" ")])]),t._v(" "),a("div",{staticClass:"col-xs-3 "},[t._v("\n                              "+t._s(e.results.abstain)+"\n                              "),a("div",{staticClass:"type "},[t._v("Vzdržan")]),t._v(" "),a("div",{staticClass:"indicator abstention "},[t._v(" ")])]),t._v(" "),a("div",{staticClass:"col-xs-3 "},[t._v("\n                              "+t._s(e.results.not_present)+"\n                              "),a("div",{staticClass:"type "},[t._v("Niso")]),t._v(" "),a("div",{staticClass:"indicator not "},[t._v(" ")])])])])])])])])}))])])]),t._v(" "),a("tab",{attrs:{header:"Dinamika skozi čas"}},[a("time-chart",{attrs:{data:t.data}})],1),t._v(" "),a("tab",{attrs:{header:"Dinamika glede na MDT"}},[a("bar-chart",{attrs:{data:t.data}})],1)],1)],1),t._v(" "),a("card-info",[a("p",{staticClass:"info-text lead"}),t._v(" "),a("p",{staticClass:"info-text heading"},[t._v("METODOLOGIJA")]),t._v(" "),a("p",{staticClass:"info-text"})]),t._v(" "),a("card-embed",{attrs:{url:t.generatedCardUrl}}),t._v(" "),a("card-share",{attrs:{url:t.shortenedCardUrl}})],1),t._v(" "),a("card-footer",{attrs:{link:t.slugs.base}}),t._v(" "),a("div",{staticClass:"modal fade",attrs:{tabindex:"1",role:"dialog",id:"modal-primerjalnik-same"}},[a("div",{staticClass:"modal-dialog modal-wide modal-center",attrs:{role:"document"}},[a("div",{staticClass:"modal-center-wrapper"},[a("div",{staticClass:"modal-content"},[t._m(0),t._v(" "),a("div",{staticClass:"modal-body"},[a("div",{staticClass:"container-fluid"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12"},t._l(t.parties,function(e){return a("span",{class:["primerjalnik-ps-switch",{on:e.isSame}],attrs:{"data-id":e.id,"data-acronym":e.acronym},on:{click:function(a){t.togglePartySame(e)}}},[t._v(t._s(e.acronym))])}))]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12"},[a("search-dropdown",{attrs:{items:t.samePeople,placeholder:t.samePeoplePlaceholder}})],1)])])])])])])]),t._v(" "),a("div",{staticClass:"modal fade",attrs:{tabindex:"1",role:"dialog",id:"modal-primerjalnik-different"}},[a("div",{staticClass:"modal-dialog modal-wide modal-center",attrs:{role:"document"}},[a("div",{staticClass:"modal-center-wrapper"},[a("div",{staticClass:"modal-content"},[t._m(1),t._v(" "),a("div",{staticClass:"modal-body"},[a("div",{staticClass:"container-fluid"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12"},t._l(t.parties,function(e){return a("span",{class:["primerjalnik-ps-switch",{on:e.isDifferent}],attrs:{"data-id":e.id,"data-acronym":e.acronym},on:{click:function(a){t.togglePartyDifferent(e)}}},[t._v(t._s(e.acronym))])}))]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12"},[a("search-dropdown",{attrs:{items:t.differentPeople,placeholder:t.differentPeoplePlaceholder}})],1)])])])])])])])],1)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"modal-header"},[a("button",{staticClass:"close modal-close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"}},[a("span",{attrs:{"aria-hidden":"true"}},[t._v("×")])]),t._v(" "),a("h4",{staticClass:"modal-title"},[t._v("Vklopi cele poslanske skupine ali poišči posamezne poslance.")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"modal-header"},[a("button",{staticClass:"close modal-close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"}},[a("span",{attrs:{"aria-hidden":"true"}},[t._v("×")])]),t._v(" "),a("h4",{staticClass:"modal-title"},[t._v("Vklopi cele poslanske skupine ali poišči posamezne poslance.")])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card-content-info hidden"},[a("div",{staticClass:"card-back-content"},[t._t("default")],2)])},staticRenderFns:[]}}]);