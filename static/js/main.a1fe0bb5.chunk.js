(this["webpackJsonpshelly.lightshow"]=this["webpackJsonpshelly.lightshow"]||[]).push([[0],{66:function(e,t,n){},67:function(e,t,n){},77:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(21),c=n.n(i),l=(n(66),n(92)),o=n(90),s=(n(67),n(19)),u=n.n(s),g=n(30),h=n(9),d=n(59),f=n(87),j=n(94),b=n(88),m=n(91),v=n(36),w=n(31),O=n(93),p=n(3),x={volumeChangedLight:{timeout:0,waitTime:300,threshold:0},avarageLight:{timeout:100,waitTime:300,threshold:1.2},maxLight:{timeout:1e3,waitTime:300,threshold:1.4},avarageLong:{timeout:5e3,waitTime:300,threshold:1.2},lights:[{name:"light1",type:"volumeChangedLight"},{name:"light2",type:"avarageLight"},{name:"light3",type:"maxLight"},{name:"light4",type:"avarageLong"}]},y=function(e){var t=e.analyser,n=e.running,r=Object(a.useRef)(),i=Object(a.useState)(null),c=Object(h.a)(i,2),l=c[0],o=c[1],s=Object(a.useState)(0),u=Object(h.a)(s,2),g=u[0],f=u[1],b=Object(a.useRef)(),m=Object(a.useState)(null),y=Object(h.a)(m,2),S=y[0],L=y[1],k=Object(a.useState)(0),C=Object(h.a)(k,2),T=C[0],D=C[1],R=Object(a.useState)({}),A=Object(h.a)(R,2),F=A[0],U=A[1],z=Object(a.useState)({volumeChangedLight:!1,avarageLight:!1,maxLight:!1,avarageLong:!1}),E=Object(h.a)(z,2),B=E[0],M=E[1],W={volumeChangedLight:Date.now(),avarageLight:Date.now(),maxLight:Date.now(),avarageLong:Date.now()},q={volumeChangedLight:null,avarageLight:null,maxLight:null,avarageLong:null},P=[],G=[];Object(a.useEffect)((function(){o(r.current.getContext("2d")),L(b.current.getContext("2d"));var e={};console.log("useEffect");var t,n=Object(w.a)(x.lights);try{for(n.s();!(t=n.n()).done;){e[t.value.name]=!1}}catch(a){n.e(a)}finally{n.f()}U(e)}),[]);var I=function(e,t){var n=Date.now();if(n-W[e]>=x[e].waitTime&&B[e]!==t){clearTimeout(q[e]),W[e]=n;var a=Object(v.a)({},B);a[e]=t,M(a);var r,i=Object(v.a)({},F),c=Object(w.a)(x.lights);try{for(c.s();!(r=c.n()).done;){var l=r.value;l.type===e&&(i[l.name]=t)}}catch(o){c.e(o)}finally{c.f()}!1===t&&console.log(e),U(i)}};return Object(a.useEffect)((function(){if(n&&t){var e=t.frequencyBinCount,a=new Uint8Array(e);!function(e,a){var i=r.current.width,c=r.current.height;n&&t&&(console.log(e),l.clearRect(0,0,i,c),function r(){if(n&&t){var o=requestAnimationFrame(r);f(o),t.getByteFrequencyData(a),l.fillStyle="rgb(0, 0, 0)",l.fillRect(0,0,i,c);for(var s,u=i/(e+.7),g=0,h=0;h<e;h++)s=a[h],l.fillStyle="rgb("+(s+100)+",50,50)",l.fillRect(g,c-s/2,u,s/2),g+=u+1}}())}(e,a),function(e,a){var r=b.current.width,i=b.current.height;if(n&&t){S.clearRect(0,0,r,i),console.log();var c=!0;!function l(){if(n&&t){var o=requestAnimationFrame(l);D(o),S.fillStyle="rgb(0, 0, 0)",S.fillRect(0,0,r,i);var s=r/10;S.fillStyle="rgb(0, 0, 0)",S.fillRect(0,0,r,i),Date.now();var u=P.reduce((function(e,t){return e+t}),0)/P.length,g=P.slice(P.length<-64?-1:-6),h=g.reduce((function(e,t){return e+t}),0)/g.length;S.fillStyle="rgb("+(u+100)+",200,200)",S.fillRect(1*((r+6)/5-s/2),i-u/2,s,u/2),u<h&&I("volumeChangedLight",!0),u>h&&I("volumeChangedLight",!1);var d=P.slice(P.length<-30?-1:-30),f=d.reduce((function(e,t){return e+t}),0)/d.length,j=a.reduce((function(e,t){return e+t}),0)/e*3;S.fillStyle="rgb("+(j+100)+",200,200)",S.fillRect(2*((r+6)/5-s/2),i-j/2,s,j/2),j>f*x.avarageLight.threshold&&I("avarageLight",!0),P.push(j);var b=a.reduce((function(e,t){return e<t?t:e}),0);S.fillStyle="rgb("+(b+100)+",200,200)",S.fillRect(3*((r+6)/5-s/2),i-b/2,s,b/2),b>f*x.maxLight.threshold&&I("maxLight",!0);var m=G.slice(G.length<-100?-1:-100),v=m.reduce((function(e,t){return e+t}),0)/m.length,w=a.filter((function(e){return 0!==e})).length,O=a.reduce((function(e,t){return e+t}),0)/w;S.fillStyle="rgb("+(O+100)+",200,200)",S.fillRect(4*((r+6)/5-s/2),i-O/2,s,O/2),O>v*x.avarageLong.threshold&&I("avarageLong",!0),G.push(O),c&&console.log(a),c=!1}}()}}(e,a)}else!function(){if(l){window.cancelAnimationFrame(g);var e=r.current.width,t=r.current.height;l.fillStyle="#7D4CDB",l.fillRect(0,0,e,t)}if(S){window.cancelAnimationFrame(T);var n=b.current.width,a=b.current.height;S.fillStyle="#7D4CDB",S.fillRect(0,0,n,a)}}()}),[n]),Object(p.jsxs)(d.a,{alignSelf:"center",pad:"small",justify:"center",gap:"medium",children:[Object(p.jsxs)(d.a,{direction:"row",gap:"xsmall",justify:"center",children:[Object(p.jsxs)(d.a,{pad:"xsmall",alignSelf:"center",border:{color:"brand",size:"small"},children:[Object(p.jsx)(d.a,{alignSelf:"center",children:"Bar"}),Object(p.jsx)("canvas",{width:"300",height:"100",ref:r}),Object(p.jsx)(d.a,{direction:"row",justify:"around",margin:"small",children:Object(p.jsx)(d.a,{children:Object(p.jsx)(O.a,{color:"brand",size:"small",opacity:"0"})})})]}),Object(p.jsxs)(d.a,{pad:"xsmall",alignSelf:"center",border:{color:"brand",size:"small"},children:[Object(p.jsx)(d.a,{alignSelf:"center",children:"Total"}),Object(p.jsx)("canvas",{width:"50",height:"100",ref:b}),Object(p.jsx)(d.a,{direction:"row",justify:"around",margin:"small",children:Object.entries(B).map((function(e){var t=Object(h.a)(e,2),n=t[0],a=t[1];return Object(p.jsx)(d.a,{children:Object(p.jsx)(O.a,{color:a?"status-warning":"status-disabled",size:"small"})},"lightTypeStatus_"+n)}))})]})]}),Object(p.jsx)(d.a,{pad:"xsmall",alignSelf:"center",children:Object(p.jsx)(d.a,{direction:"row",justify:"around",margin:"small",children:Object.entries(x.lights).map((function(e){var t=Object(h.a)(e,2),n=t[0],a=t[1];return Object(p.jsxs)(d.a,{pad:"small",margin:"small",align:"center",gap:"small",children:[Object(p.jsx)(j.a,{level:"5",margin:"none",children:a.name}),Object(p.jsx)(O.a,{color:F[a.name]?"status-warning":"status-disabled",size:"large"})]},"lights-".concat(n))}))})})]})},S=function(){var e=Object(a.useState)(null),t=Object(h.a)(e,2),n=t[0],r=t[1],i=Object(a.useState)(null),c=Object(h.a)(i,2),l=c[0],o=c[1],s=Object(a.useState)(null),v=Object(h.a)(s,2),w=v[0],O=v[1],x=Object(a.useState)(!1),S=Object(h.a)(x,2),L=S[0],k=S[1],C=Object(a.useState)(null),T=Object(h.a)(C,2),D=T[0],R=T[1];Object(a.useEffect)((function(){void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){var t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;return t?new Promise((function(n,a){t.call(navigator,e,n,a)})):Promise.reject(new Error("getUserMedia is not implemented in this browser"))});var e=new window.AudioContext||window.webkitAudioContext;r(e)}),[]);var A=function(){var e=Object(g.a)(u.a.mark((function e(){var t,a,r,i,c,l,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!==n){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,(t=n.createAnalyser()).minDecibels=-90,t.maxDecibels=-10,t.smoothingTimeConstant=.85,t.fftSize=64,O(t),a=n.createWaveShaper(),r=n.createGain(),i=n.createBiquadFilter(),c=n.createConvolver(),e.next=15,navigator.mediaDevices.getUserMedia({audio:!0,video:!1});case 15:window.stream=l=e.sent,s=n.createMediaStreamSource(l),R(l),s.connect(a),a.connect(i),i.connect(r),c.connect(r),r.connect(t),o(s),i.gain.setTargetAtTime(0,n.currentTime,0),i.disconnect(0),i.connect(r),i.type="lowshelf",i.frequency.setTargetAtTime(1e3,n.currentTime,0),k(!0),e.next=35;break;case 32:e.prev=32,e.t0=e.catch(2),console.log("Error: Issue getting mic",e.t0);case 35:case"end":return e.stop()}}),e,null,[[2,32]])})));return function(){return e.apply(this,arguments)}}(),F=function(){var e=Object(g.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A();case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(p.jsxs)(d.a,{justify:"center",alignSelf:"center",margin:"small",border:{color:"brand",size:"small"},round:"large",background:"dark-1",children:[Object(p.jsx)(f.a,{justify:"center",height:"xxsmall",background:"light-6",round:{corner:"top",size:"large"},children:Object(p.jsx)(j.a,{level:"2",margin:"none",children:"Lightshow with Shellys"})}),Object(p.jsx)(d.a,{border:[{color:"brand",size:"small",side:"bottom"}]}),Object(p.jsxs)(b.a,{alignSelf:"center",pad:"small",justify:"center",children:[Object(p.jsx)(d.a,{direction:"row",justify:"center",gap:"medium",margin:"small",children:L?Object(p.jsx)(m.a,{onClick:function(){k(!1),w&&(w.disconnect(0),O(null)),l&&(l.disconnect(0),o(null)),D&&(D.getAudioTracks().forEach((function(e){e.stop()})),R(null))},label:"Stop"}):Object(p.jsx)(m.a,{onClick:F,label:"Start"})}),Object(p.jsx)(y,{running:L,analyser:w})]})]})},L=function(){return Object(p.jsx)(p.Fragment,{children:Object(p.jsx)(l.a,{theme:o.a,children:Object(p.jsx)(S,{})})})},k=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function C(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var T=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,96)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,i=t.getLCP,c=t.getTTFB;n(e),a(e),r(e),i(e),c(e)}))};c.a.render(Object(p.jsx)(r.a.StrictMode,{children:Object(p.jsx)(L,{})}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/Shelly.Lightshow",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/Shelly.Lightshow","/service-worker.js");k?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):C(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):C(t,e)}))}}(),T()}},[[77,1,2]]]);
//# sourceMappingURL=main.a1fe0bb5.chunk.js.map