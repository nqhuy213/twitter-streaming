(this["webpackJsonpreact-client"]=this["webpackJsonpreact-client"]||[]).push([[0],{358:function(t,e,a){},359:function(t,e,a){},372:function(t,e,a){},598:function(t,e,a){"use strict";a.r(e);var n=a(0),c=a.n(n),r=a(24),s=a.n(r),i=(a(358),a(8)),o=(a(359),a(19)),d=a(602),l=a(608),u=a(603),b=a(281),j=a(604),O=a(300),m=a(302),h=(a(372),a(280)),x=a.n(h),f=a(25),p=a.n(f),g=a(89),v=a(90),y=a(2),w=Object(n.createContext)(),S=function(t){var e=Object(n.useState)(""),a=Object(i.a)(e,2),c=a[0],r=a[1],s=Object(n.useState)({status:!1,message:""}),o=Object(i.a)(s,2),d=o[0],l=o[1],u=function(){var t=Object(g.a)(p.a.mark((function t(){return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,v.get("/getUuid").then((function(t){return r(t.data)})).catch((function(t){return l({status:!0,message:t.data})}));case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(n.useEffect)((function(){u()}),[d]),Object(y.jsx)(w.Provider,{value:{uuid:c,error:d},children:t.children})},k=a(609),C=a(39);function N(){var t=Object(n.useState)([]),e=Object(i.a)(t,2),a=e[0],c=e[1],r=Object(n.useState)([]),s=Object(i.a)(r,2),h=s[0],f=s[1],p=Object(n.useState)(!1),g=Object(i.a)(p,2),v=g[0],S=g[1],N=Object(n.useState)([]),M=Object(i.a)(N,2),T=M[0],I=M[1],A=Object(n.useState)(5),D=Object(i.a)(A,2),B=D[0],E=D[1],F=Object(n.useState)({status:!1,message:""}),H=Object(i.a)(F,2),L=(H[0],H[1]),R=Object(n.useRef)(),G=Object(n.useContext)(w).uuid,K=function(){try{var t=x()("");S(!0),L(!1),t.emit("streaming",{clientId:G,keywords:a}),t.on("data",(function(t){var e=t.sentiment;f((function(t){return[].concat(Object(o.a)(t),[e])})),!1===T.includes(e.createdTime)&&I((function(t){return Array.from(new Set([].concat(Object(o.a)(t),[e.createdTime])))}))})),setTimeout((function(){t.disconnect(),t.close(),S(!1)}),1e3*B)}catch(e){L(e)}},P=10,J=30,W=30,z=60,Q=600-z-J,U=400-P-W,V=C.d("body").append("div").style("position","absolute").style("z-index","10").style("visibility","hidden").style("background-color","black").style("border-radius","5px").style("padding","10px").style("color","white"),X=C.f("%H:%M:%S");return Object(n.useEffect)((function(){C.e(".svg-container").remove();var t=C.d(R.current).append("svg").attr("class","svg-container").attr("width",Q+z+J).attr("height",U+P+W).append("g").attr("transform","translate(".concat(z,",").concat(P,")")),e=C.c().domain([Math.min.apply(Math,Object(o.a)(T))-500,Math.max.apply(Math,Object(o.a)(T))]).range([0,Q]),a=C.c().domain([-1,1]).range([U,0]);t.append("g").selectAll("circle").data(h).join((function(t){return t.append("circle").attr("fill",(function(t){return t.sentimentData<0?"red":"green"})).attr("stroke-width","1px").attr("stroke","black").attr("cx",(function(t){return e(t.createdTime)})).attr("cy",(function(t){return a(t.sentimentData)})).attr("r",5).transition().duration(500)})).on("mouseover",(function(t,e){V.html((function(){return"tweet id: "+e.tweetId+"<br>created at: "+X(e.createdTime)+"<br>sentiment: "+e.sentimentData})).style("visibility","visible")})).on("mouseout",(function(t,e){V.style("visibility","hidden")})).on("mousemove",(function(t){return V.style("left",t.pageX-100+"px").style("top",t.pageY-100+"px")}));t.append("g").attr("class","yAxis").call(C.b(a)),t.node(),e.domain([Math.min.apply(Math,Object(o.a)(T))-500,Math.max.apply(Math,Object(o.a)(T))]).range([0,Q]),t.append("g").attr("class","xAxis").attr("transform","translate(0, ".concat(U,")")).transition().duration(500).call(C.a().scale(e).ticks(T.length).tickFormat(C.f("%H:%M:%S")))}),[h,f]),Object(y.jsxs)(d.a,{children:[Object(y.jsx)(l.a.Group,{className:"mb-3",children:Object(y.jsxs)(u.a,{children:[Object(y.jsx)(l.a.Label,{children:"Adding Rules"}),Object(y.jsx)(b.a,{className:"col-search-rule",md:9,children:Object(y.jsx)(O.a,{isMulti:!0,onChange:function(t,e){c(t.map((function(t){return t.value})))}})}),Object(y.jsx)(b.a,{md:1,className:"col-btn-add",children:Object(y.jsx)("div",{style:{width:100},children:Object(y.jsx)(k.a,{defaultValue:5,min:0,max:60,onChange:function(t){E(t)}})})}),Object(y.jsx)(b.a,{md:1,className:"col-btn-add",children:Object(y.jsx)(j.a,{className:"btn-add btn-sm",variant:"primary",type:"submit",onClick:K,children:"Start"})}),Object(y.jsx)(b.a,{md:1,className:"col-btn-add",children:Object(y.jsx)(j.a,{className:"btn-add btn-sm",variant:"primary",type:"submit",onClick:function(){f([]),I([])},children:"Clear Tweets"})})]})}),Object(y.jsxs)(u.a,{children:[Object(y.jsxs)(b.a,{md:6,children:[h.map((function(t){return Object(y.jsx)(u.a,{className:"justify-content-md-center",children:Object(y.jsxs)(b.a,{md:{offset:3},children:[Object(y.jsxs)("h3",{children:["Tweet ID: ",t.tweetId]}),Object(y.jsx)(m.a,{className:"tweet",tweetId:"".concat(t.tweetId)})]})})})),v?Object(y.jsxs)("div",{className:"lds-roller",children:[Object(y.jsx)("div",{}),Object(y.jsx)("div",{}),Object(y.jsx)("div",{}),Object(y.jsx)("div",{}),Object(y.jsx)("div",{}),Object(y.jsx)("div",{}),Object(y.jsx)("div",{}),Object(y.jsx)("div",{})]}):Object(y.jsx)(j.a,{className:"btn-add",variant:"primary",type:"submit",onClick:K,children:"Load More"})]}),Object(y.jsx)(b.a,{md:6,children:Object(y.jsx)("svg",{className:"sentiment-chart",ref:R,width:"100%",height:"400px"})})]})]})}var M=a(606),T=a(610),I=a(607),A=a(301),D={labels:["Good","Bad"],datasets:[{label:"Sentiment Bar Chart",data:[0,0],backgroundColor:["rgba(75, 192, 192, 0.2)","rgba(255, 99, 132, 0.2)"],borderColor:["rgba(75, 192, 192)","rgba(255, 99, 132)"],borderWidth:1}]};function B(){var t=Object(n.useState)([]),e=Object(i.a)(t,2),a=e[0],c=e[1],r=Object(n.useState)(D),s=Object(i.a)(r,2),o=s[0],l=s[1],j=Object(n.useContext)(w).uuid,O=Object(n.useState)([]),m=Object(i.a)(O,2),h=m[0],x=m[1],f=function(){var t=Object(g.a)(p.a.mark((function t(e,n){var r,s,i;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(c(e),!a){t.next=7;break}return r="/getTweets?uuid=".concat(j,"&rules=").concat(e),s=0,i=0,t.next=7,v.get(r).then((function(t){t.data.data[0].data.forEach((function(t){t.sentimentData>=0?s+=1:i+=1})),l({labels:["Good","Bad"],datasets:[{label:"Sentiment Bar Chart",data:[s,i],backgroundColor:["rgba(75, 192, 192, 0.2)","rgba(255, 99, 132, 0.2)"],borderColor:["rgba(75, 192, 192)","rgba(255, 99, 132)"],borderWidth:1}]})}));case 7:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}(),S=function(){var t=Object(g.a)(p.a.mark((function t(){var e;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e="/getAllRules?uuid=".concat(j),v.get(e).then((function(t){x(t.data)}));case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(y.jsxs)(d.a,{children:[Object(y.jsx)(u.a,{children:Object(y.jsx)(b.a,{md:12,children:Object(y.jsx)(I.a,{data:h.rules,block:!0,onChange:f,onClick:S})})}),Object(y.jsx)(A.a,{data:o})]})}var E=function(){var t=Object(n.useState)("streaming"),e=Object(i.a)(t,2),a=e[0],c=e[1],r=Object(n.useContext)(w),s=r.uuid;return r.uuidError,Object(y.jsx)("div",{className:"App",children:Object(y.jsxs)(d.a,{className:"header",children:[Object(y.jsx)("img",{src:"./twitter-logo.png",alt:"twitter-logo"}),Object(y.jsx)("h1",{children:"Real Time Tweet Streamer"}),Object(y.jsx)("h4",{children:"by Trong Dat Nguyen & Quoc Huy Nguyen"}),Object(y.jsxs)(M.a,{id:"controlled-tab-example",activeKey:a,onSelect:function(t){return c(t)},className:"mb-3",children:[Object(y.jsx)(T.a,{eventKey:"streaming",title:"Streaming",children:Object(y.jsx)(N,{})}),Object(y.jsx)(T.a,{eventKey:"history",title:"History",children:s?Object(y.jsx)(B,{}):null})]})]})})},F=function(t){t&&t instanceof Function&&a.e(3).then(a.bind(null,611)).then((function(e){var a=e.getCLS,n=e.getFID,c=e.getFCP,r=e.getLCP,s=e.getTTFB;a(t),n(t),c(t),r(t),s(t)}))};a(596),a(597);s.a.render(Object(y.jsx)(c.a.StrictMode,{children:Object(y.jsx)(S,{children:Object(y.jsx)(E,{})})}),document.getElementById("root")),F()}},[[598,1,2]]]);
//# sourceMappingURL=main.3e4a2adf.chunk.js.map