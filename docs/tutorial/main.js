var a=["onmount","onunmount"],l=["onerror","onload","onresize","onblur","onchange","oncontextmenu","onfocus","oninput","oninvalid","onreset","onselect","onsubmit","onkeydown","onkeypress","onkeyup","onclick","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","onmousedown","onmousemove","onmouseout","onmouseover","onmouseup","onscroll","onabort","oncanplay","oncanplaythrough","ondurationchange","onemptied","onended","onerror","onloadeddata","onloadedmetadata","onloadstart","onpause","onplay","onplaying","onprogress","onratechange","onseeked","onseeking","onstalled","onsuspend","ontimeupdate","onvolumechange","onwaiting"],UJ=[...l,...a],_J=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"],K,RJ=(J)=>{if(!K)K=document.createElement("textarea");return K.innerHTML=J,K.value},DJ=()=>{let J=0;return{getNewId:()=>++J,resetIdCounter:()=>J=0}},e=DJ(),P={currentIs:(J)=>window._currentAppPhase===J,start:(J)=>{window._currentAppPhase=J,console.log(`Current phase is ${J}`)}},y=(J)=>{let Q=Object.entries(J).sort((X,Z)=>X[0].localeCompare(Z[0]));return Q.forEach(([X,Z],$)=>{if(Z&&typeof Z==="object"&&!Array.isArray(Z))Q[$]=[X,y(Z)]}),Object.fromEntries(Q)},c=(J)=>{if(typeof J!=="object"||J===null||Array.isArray(J))return!1;return Object.prototype.toString.call(J)==="[object Object]"},E=(J)=>{if(Array.isArray(J)){let Q=[...J],X=[];return Q.forEach((Z)=>{X.push(E(Z))}),X}if(c(J)){let Q={...J},X={};return Object.keys(Q).forEach((Z)=>{X[Z]=E(Q[Z])}),Object.freeze(X)}return J},A=(J)=>{if(Array.isArray(J)){let X=[...J],Z=[];return X.forEach(($)=>{Z.push(A($))}),Z}if(c(J)){let X={...J},Z={};return Object.keys(X).forEach(($)=>{Z[$]=A(X[$])}),Z}return J},m=(J,Q="index")=>J.map((X,Z)=>({[Q]:Z,value:X})),GJ=(J,Q)=>{let X=y(J),Z=y(Q),$=Object.keys(X),W=Object.keys(Z);if($.length!==W.length)return!1;for(let Y of $)if(!W.includes(Y)||!h(X[Y],Z[Y]))return!1;return!0},TJ=(J,Q)=>{if(J.length!==Q.length)return!1;if(J.length===0)return!0;for(let X=0;X<J.length;X++)if(!h(J[X],Q[X]))return!1;return!0},h=(J,Q)=>{if(typeof J!==typeof Q)return!1;if(Array.isArray(J))return TJ(J,Q);if(J===null||Q===null)return J===Q;if(typeof J==="object"&&!(J instanceof Set))return GJ(J,Q);if(typeof J==="bigint"||typeof J==="number"||typeof J==="string"||typeof J==="boolean")return J===Q;return J===Q},LJ=(J,Q,X)=>{let $=m(A(J),"index");return m(A(Q),"index").map((Y)=>{let q="add",z=-1,_=Y.value;return $.some((R,o)=>{if(q=h(R.value,Y.value)?R.index===Y.index?"idle":"shuffle":X&&R.value[X]!==void 0&&R.value[X]===Y.value[X]?"update":"add",q!=="add")return z=R.index,$.splice(o,1),!0;return!1}),{type:q,oldIndex:z,value:_}})},V=null,w=(J)=>{let Q=E(J),X=new Set;return{type:"source-signal",get value(){if(V)X.add(V);return A(Q)},set value(Z){if(Z===Q)return;Q=E(Z),X.forEach(($)=>$&&$())}}},I=(J)=>{V=J,J(),V=null},U=(J)=>{let Q,X=w(Q);return I(()=>{Q=J(Q),X.value=Q}),{type:"derived-signal",get prevValue(){return Q},get value(){return X.value}}},f=(J)=>["source-signal","derived-signal"].includes(J?.type),JJ=(J,Q)=>J?.type==="non-signal"&&(!Q||!Q.length||Q.some((X)=>typeof J?.value===X)),v=(J)=>f(J)||JJ(J),QJ=(J)=>JJ(J,["string"]),XJ=(J)=>J?.type==="non-signal"&&Array.isArray(J?.value)&&(J?.value).every((Q)=>typeof Q==="string"),k=(J)=>v(J)?J.value:J,FJ=(J)=>{if(!f(J)||!c(J.value))throw new Error("Thee argument should be signal of a plain object");return Object.keys(J.value).reduce((X,Z)=>{let $=Z;return X[$]=U(()=>J.value[$]),X},{})},G=(J,...Q)=>U(()=>{return J.reduce((X,Z,$)=>{let W,Y=Q[$];if(typeof Y==="function")W=Y()??"";else if(v(Y))W=Y.value??"";else W=Y??"";return`${X}${Z}${W.toString()}`},"")}),N=(J)=>Array.isArray(J),g=(J)=>!isNaN(J?.elementId)&&J?.elementId>0,H=(J)=>typeof J==="string"||typeof J==="function"&&J.isElementGetter,p=(J)=>f(J)&&H(J.value),PJ=(J)=>H(J)||p(J),ZJ=(J)=>{return f(J)&&(H(J.value)||N(J.value)&&J.value.every((Q)=>H(Q)))},$J=(J)=>{return!f(J)&&(QJ(J)||XJ(J)||H(J)||N(J)&&J.every((Q)=>PJ(Q)))},u=(J)=>{return ZJ(J)||$J(J)},d=!1,fJ={},M={},MJ=globalThis.MutationObserver,HJ=new MJ((J)=>{J.forEach((Q)=>{if(Q.type==="childList")Q.addedNodes.forEach((X)=>{if(g(X)){let Z=X,$=Z.elementId;if(M[$])delete M[$];else fJ[$]=Z.tagName}}),Q.removedNodes.forEach((X)=>{if(g(X)){let Z=X,$=Z.elementId,W=Z.unmountListener;if(W)M[$]={element:Z,unmountListener:W}}})}),Object.entries(M).forEach(([Q,X])=>{let{element:Z,unmountListener:$}=X;YJ(Z,$)})}),YJ=(J,Q)=>{if(!g(J))return;let X=J.children;for(let Z=0;Z<X.length;Z++){let $=X[Z];YJ($,$.unmountListener)}if(Q&&Q(J),M[J.elementId])delete M[J.elementId]},OJ=()=>{if(!d&&!P.currentIs("build"))HJ.observe(document.body,{childList:!0,subtree:!0}),d=!0},WJ=(J,Q)=>UJ.includes(J)&&Q===void 0,BJ=(J,Q)=>l.includes(J)&&typeof Q==="function",qJ=(J,Q)=>a.includes(J)&&typeof Q==="function",AJ=(J,Q)=>WJ(J,Q)||BJ(J,Q)||qJ(J,Q),wJ=(J,Q)=>{Object.entries(Q).forEach(([X,Z])=>{if(WJ(X,Z));else if(BJ(X,Z)){let $=X.slice(2);J.addEventListener($,(W)=>{if($==="keypress")W.preventDefault();Z(W)})}else if(qJ(X,Z)){if(X==="onmount"&&!P.currentIs("build")){let $=Z;setTimeout(()=>$(J),0)}if(X==="onunmount")OJ(),J.unmountListener=Z}else console.error(`Invalid event key: ${X} for element with tagName: ${J.tagName}`)})},r=(J,Q,X)=>{let Z=(v(X)?X.value:X)??"";if(typeof Z==="boolean")if(Z)J.setAttribute(Q,"");else J.removeAttribute(Q);else if(Q==="value")J.value=Z;else if(Z)J.setAttribute(Q,Z)},kJ=(J,Q)=>{let X={};Object.entries(Q).forEach((Z)=>{let[$,W]=Z;if(f(W))X[$]=W;r(J,$,W)}),I(()=>{Object.entries(X).forEach((Z)=>{let[$,W]=Z,Y=W.value;if(!P.currentIs("run"))return;r(J,$,Y)})})},j=(J)=>{if(p(J)){let Q=J.value;return j(Q)}if(typeof J==="string")return document.createTextNode(RJ(J));if(H(J)){let Q=J();if(!g(Q))throw new Error(`Invalid MHtml element getter child. Type: ${typeof J}`);return Q}throw new Error(`Invalid child. Type of child: ${typeof J}`)},KJ=(J,Q)=>{if(!Q)return;if(ZJ(Q))I(()=>{let Z=Q.value,$=N(Z)?Z:[Z];$.forEach((Y,q)=>{let z=J.childNodes[q],_=j(Y);if(z&&_)J.replaceChild(_,z);else if(_)J.appendChild(_);else console.error(`No child found for node with tagName: ${J.tagName}`)});let W=$.length;while(W<J.childNodes.length){let Y=J.childNodes[W];if(Y)J.removeChild(Y)}});if($J(Q)){let X=QJ(Q)?[Q.value]:XJ(Q)?Q.value:N(Q)?Q:[Q],Z=[];if(X.forEach(($,W)=>{if(p($))Z.push({index:W,childSignal:$});let Y=j($),q=J.childNodes[W];if(q&&Y)J.replaceChild(Y,q);else if(!q&&Y)J.appendChild(Y);else console.error(`No child found for node with tagName: ${J.tagName}`)}),Z.length)Z.forEach(({index:$,childSignal:W})=>{I(()=>{if(!W.value)return;if(!P.currentIs("run"))return;let Y=j(W.value),q=J.childNodes[$];if(q&&Y)J.replaceChild(Y,q);else if(!q&&Y)J.appendChild(Y);else console.error(`No child found for node with tagName: ${J.tagName}`)})})}},jJ=(J,Q)=>{let X=void 0,Z={},$={};return Object.entries(J).forEach(([W,Y])=>{if(W==="children")if(u(Y))X=Y;else throw new Error(`Invalid children prop for node with tagName: ${Q}

 ${JSON.stringify(Y)}`);else if(AJ(W,Y))Z[W]=Y;else $[W]=Y}),{children:X,eventProps:Z,attributeProps:$}},xJ=(J,Q)=>{let X=()=>{let Z=e.getNewId(),$=P.currentIs("mount")?document.querySelector(`[data-elem-id="${Z}"]`):document.createElement(J);$.elementId=Z,$.unmountListener=void 0;let W=u(Q)?{children:Q}:Q;if(!P.currentIs("run"))W["data-elem-id"]=$.elementId.toString();let Y=jJ(W,$.tagName);if(wJ($,Y.eventProps),kJ($,Y.attributeProps),KJ($,Y.children),!P.currentIs("build"))$.removeAttribute("data-elem-id");return $};return X.isElementGetter=!0,X},i=(J,Q,X)=>{let Z=w(Q),$=w(J),W=X(U(()=>$.value),U(()=>Z.value)),Y,q,z=!1;if(W?.isElementGetter)Y=()=>{if(z&&q)return q;return q=W(),z=!0,q},Y.isElementGetter=!0;else if(typeof W==="string")Y=W;else throw`One of the child, ${W} passed in ForElement is invalid.`;return{indexSignal:Z,itemSignal:$,mappedChild:Y}},n=(J,Q,X)=>{if(Q!==void 0&&Q>=0&&X){let Z=Q>J.length?J.length:Q;J.splice(Z,0,X)}return J},SJ=({subject:J,itemKey:Q,map:X,n:Z,nthChild:$})=>{if($&&Z===void 0||Z!==void 0&&Z>-1&&!$)throw new Error("Either both 'n' and 'nthChild' be passed or none of them.");let W=U(()=>{let D=k(J);return Array.isArray(D)?D:[]});if(!Q)return U(()=>n(W.value.map(X),Z,$));let Y=$;if($&&typeof $!=="string"){let D=$(),C=()=>D;C.isElementGetter=!0,Y=C}let q=W.value;if(q.length&&typeof q[0]!=="object")throw new Error("for mutable map, item in the list must be an object");let z=null,_=U((D)=>{return z=D||z,W.value}),R=U((D)=>{if(!D||!z)return _.value.map((O,F)=>i(O,F,X));return LJ(z,_.value,Q).map((L,O)=>{let F=(D||[])[L.oldIndex];if(console.assert(L.type==="add"&&L.oldIndex===-1&&!F||L.oldIndex>-1&&!!F,"In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer."),F){if(L.type==="shuffle")F.indexSignal.value=O;if(L.type==="update")F.indexSignal.value=O,F.itemSignal.value={...L.value};return F}return i(L.value,O,X)})});return U(()=>n(R.value.map((D)=>D.mappedChild),Z,Y))},EJ=({subject:J,isTruthy:Q,isFalsy:X})=>{let Z=B.Span({style:"display: none;"}),$=()=>(k(J)?Q:X)||Z;return f(J)?U($):$()},VJ=({subject:J,caseMatcher:Q,defaultCase:X,cases:Z})=>{let $=()=>{let W=k(J),Y=void 0;for(let[q,z]of Object.entries(Z))if(Q&&Q(J,q)||W===q){Y=z;break}return Y||X||B.Span({style:"display: none;"})};return f(J)?U($):$()},IJ=_J.reduce((J,Q)=>{let X=Q.split("").map(($,W)=>!W?$.toUpperCase():$).join(""),Z=($)=>xJ(Q,$);return J[X]=Z,J},{}),NJ={For:SJ,If:EJ,Switch:VJ},B={...IJ,...NJ},T=(J)=>(Q)=>{let X=Object.entries(Q).reduce((Z,$)=>{let[W,Y]=$,q=typeof Y==="string",z=Array.isArray(Y)&&Y.every((R)=>typeof R==="string"),_=f(Y)||typeof Y==="function"?Y:q||z?{type:"non-signal",get value(){return k(Y)}}:u(Y)?Y:{type:"non-signal",get value(){return k(Y)}};return Z[W]=_,Z},{});return J(X)},gJ=T(({logoSrc:J,logoHref:Q,logoSize:X,labelComponent:Z})=>{let $=G`${()=>X?.value||32}`;return B.A({class:"space-mono link black flex items-center justify-start",href:Q,children:[B.Img({src:J,height:$,width:$}),B.If({subject:Z,isTruthy:Z})]})}),mJ=T(({children:J})=>B.Div({class:"flex items-center",children:J})),dJ=T(({classNames:J,href:Q,label:X,onClick:Z})=>{return B.Button({class:G`pv2 ph3 pointer bg-transparent hover-bg-gray b--gray ba bw1 br-pill ${J}`,onclick:Z,children:B.A({class:"no-underline dark-gray hover-white",href:Q,children:X})})}),t=T(({className:J})=>B.Div({class:G`bl b--moon-gray min-vh-20 ${J}`})),zJ=T(({classNames:J,url:Q,size:X})=>B.A({class:J,target:"_blank",href:Q||"https://github.com",children:[B.Img({class:"ba b--none br-100",src:"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",height:G`${()=>X?.value||32}`,width:G`${()=>X?.value||32}`})]})),b=T(({classNames:J,colorCss:Q,target:X,isSelected:Z,href:$,label:W})=>{return console.log(JSON.stringify(Z)),B.A({class:G`link underline ${()=>Q?.value||"red"} ${()=>Z?.value?`bg-${Q?.value||"red"}`:""} ${J}`,target:X,href:$,children:W})}),bJ=T(({children:J})=>{return B.Div({class:"dn db-ns w5 pv3 pr3 max-h-80 overflow-y-scroll",style:`
      scrollbar-color: #e8e8e8 #f2f1f0;
      scrollbar-width: thin;
    `,children:J})}),x=T(({classNames:J,titleClassNames:Q,itemClassNames:X,header:Z,justifyRight:$,links:W,linkColorCss:Y,bottomComponent:q})=>B.Div({class:G`${()=>$?.value?"tr":""} ${J}`,children:[B.P({class:G`space-mono mt0 f3 lh-solid ${Q}`,children:Z}),B.Div(B.For({subject:W,map:(z)=>B.Div({class:X,children:[b({colorCss:Y,href:z.href,label:z.label})]})})),B.If({subject:q,isTruthy:q})]})),s=T(({classNames:J,contentClassNames:Q,children:X})=>{return B.Div({class:G`w-100 bg-pale ${J}`,children:[B.Div({class:G`mw8 center ${Q}`,children:X})]})}),CJ=s({classNames:"bg-pale-dark",contentClassNames:"flex items-start justify-between pv4",children:[B.Div({class:"flex flex-column items-stretch justify-between",children:[B.Div({children:[B.A({class:"flex items-center justify-start no-underline",href:"https://www.cyfer.tech",children:[B.Img({src:"/assets/images/cyfer-logo.png",height:"32",width:"32"})]}),B.P({class:"m0 f7",children:"© 2024 Cyfer Tech."}),B.P({class:"nt2 f7",children:"All rights reserved."})]}),B.Span({class:"mt4 pt3 mb0",children:[B.Span({children:"This site is created using "}),b({classNames:"underline",href:"https://maya.cyfer.tech",label:"Maya"}),B.Span({children:"."})]})]}),B.Div({class:"flex items-start justify-between",children:[x({justifyRight:!0,classNames:"pr3",itemClassNames:"mb3",header:"Company",links:[{label:"About us",href:"#about-us"},{label:"Blogs",href:"#blogs"},{label:"Team",href:"#about-us"},{label:"Career",href:"/careers"}]}),t({className:"mh4 ph2"}),x({justifyRight:!0,classNames:"pr3",itemClassNames:"mb3",header:"Products",links:[{label:"Maya",href:"/products/maya"},{label:"KarmaJs",href:"/karma"},{label:"Yajman",href:"/yajman"},{label:"Batua",href:"/batua"}]}),t({className:"mh4 ph2"}),B.Div({children:[x({justifyRight:!0,itemClassNames:"mb3",header:"Relations",links:[{label:"Sponsor Us",href:"/sponsor-us"},{label:"FAQs",href:"/faqs"},{label:"Feedback",href:"/feedback"}],bottomComponent:B.Span({class:"flex items-center justify-end",children:[zJ({url:"https://github.com/cyftec"}),B.A({class:"ml3",target:"_blank",href:"https://twitter.com/cyftec",children:[B.Img({class:"ba b--none br-100",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAA/0lEQVR4AbXPIazCMACE4d+L2qoZFEGSIGcRc/gJJB5XMzGJmK9EN0HMi+qaibkKVF1txdQe4g0YzPK5yyWXHL9TaPNQ89LojH87N1rbJcXkMF4Fk31UMrf34hm14KUeoQxGArALHTMuQD2cAWQfJXOpgTbksGr9ng8qluShJTPhyCdx63POg7rEim95ZyR68I1ggQpnCEGwyPicw6hZtPEGmnhkycqOio1zm6XuFtyw5XDXfGvuau0dXHzJp8pfBPuhIXO9ZK5ILUCdSvLYMpc6ASBtl3EaC97I4KaFaOCaBE9Zn5jUsVqR2vcTJZO1DdbGoZryVp94Ka/mQfE7f2T3df0WBhLDAAAAAElFTkSuQmCC",height:"24",width:"24"})]})]})})]})]})]}),yJ="0.1.14",cJ=w(document.location.hash),S=w(document.location.pathname);window.onhashchange=()=>{console.log(`New hash is: ${document.location.hash}`),cJ.value=document.location.hash};window.onpopstate=()=>{console.log(`New pathname is: ${document.location.pathname}`),S.value=document.location.pathname};var hJ=U(()=>{return console.log(`current path is ${S.value}`),[{isSelected:S.value.startsWith("/docs"),colorCss:"purple",href:"/docs/",label:"Docs"},{isSelected:S.value.startsWith("/tutorial"),colorCss:"purple",href:"/tutorial/",label:"Tutorial"},{isSelected:!1,colorCss:"purple",target:"_blank",href:"https://www.cyfer.tech/blogs/?tags=maya",label:"Blogs"}]}),vJ=()=>{return s({children:B.Div({class:"pv3 bg-pale flex items-center justify-between",children:[gJ({logoSize:36,logoSrc:"/assets/images/maya-logo.png",logoHref:"/",labelComponent:B.A({class:"ml3 link black no-underline",href:"/",children:[B.Div({class:"f4",children:"MAYA"}),b({classNames:"f7",colorCss:"black",target:"_blank",href:"https://github.com/cyftec/maya-ui",label:yJ})]})}),B.Div({class:"flex items-center justify-end",children:B.For({subject:hJ,itemKey:"label",n:1/0,nthChild:zJ({classNames:"ml3",url:"https://github.com/cyftec/maya-ui"}),map:(J)=>{let Q=FJ(J);return b({classNames:"ml3 pv1 ph2",isSelected:Q.isSelected,colorCss:Q.colorCss,target:Q.target,href:Q.href,label:Q.label})}})})]})})},pJ=T(({title:J,app:Q})=>{return B.Html({lang:"en",children:[B.Head([B.Title(J),B.Link({rel:"stylesheet",href:"/assets/styles.css"}),B.Link({rel:"icon",type:"image/x-icon",href:"/assets/favicon.ico"})]),B.Body({children:[B.Script({src:"main.js",defer:!0}),vJ(),s({children:Q}),CJ]})]})}),uJ=[{label:"1. Before Start",nodes:[{label:"Resources",href:"/"},{label:"Disclaimer",href:"/"}]},{label:"2. Quickstart",nodes:[{label:"Your first app",href:"/"},{label:"Understanding app structure",href:"/"},{label:"Brahma, Karma & Maya",href:"/"}]},{label:"3. Tic Tac Toe",nodes:[{label:"Syntax",href:"/"},{label:"Overview",href:"/"},{label:"Element",href:"/"},{label:"component",href:"/"},{label:"Props",href:"/"},{label:"Page",href:"/"},{label:"App structure",href:"/"}]},{label:"4. Todos List",nodes:[{label:"What is signal?",href:"/"},{label:"Custom implementation",href:"/"},{label:"Effect",href:"/"},{label:"Derived signals",href:"/"},{label:"Signal for mutating list",href:"/"}]},{label:"5. Living Room",nodes:[{label:"Default HTML page",href:"/"},{label:"Router",href:"/"},{label:"UI toolkit",href:"/"}]}],sJ=pJ({title:"Tutorial - Maya",app:B.Div({class:"flex mt3",children:[bJ({children:B.For({subject:uJ,n:1/0,nthChild:B.P({class:"gray f6",children:"** end of list **"}),map:(J)=>x({classNames:"mb4 pb3",titleClassNames:"f4",itemClassNames:"mb2 pb1 f6",linkColorCss:"purple",header:J.label,links:J.nodes.map(({href:Q,label:X})=>({href:Q,label:X}))})})}),B.P({class:"ph5 mt3 f5 gray flex-grow-1 space-mono",children:"Docs  >  Overview  >  Getting familiar"})]})}),oJ=()=>{P.start("mount"),e.resetIdCounter(),sJ(),P.start("run")};oJ();
