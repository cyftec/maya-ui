var JJ=["onmount","onunmount"],QJ=["onerror","onload","onresize","onblur","onchange","oncontextmenu","onfocus","oninput","oninvalid","onreset","onselect","onsubmit","onkeydown","onkeypress","onkeyup","onclick","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","onmousedown","onmousemove","onmouseout","onmouseover","onmouseup","onscroll","onabort","oncanplay","oncanplaythrough","ondurationchange","onemptied","onended","onerror","onloadeddata","onloadedmetadata","onloadstart","onpause","onplay","onplaying","onprogress","onratechange","onseeked","onseeking","onstalled","onsuspend","ontimeupdate","onvolumechange","onwaiting"],GJ=[...QJ,...JJ],FJ=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"],E,TJ=(J)=>{if(!E)E=document.createElement("textarea");return E.innerHTML=J,E.value},LJ=()=>{let J=0;return{getNewId:()=>++J,resetIdCounter:()=>J=0}},XJ=LJ(),P={currentIs:(J)=>window._currentAppPhase===J,start:(J)=>{window._currentAppPhase=J,console.log(`Current phase is ${J}`)}},h=(J)=>{let Q=Object.entries(J).sort((X,Z)=>X[0].localeCompare(Z[0]));return Q.forEach(([X,Z],$)=>{if(Z&&typeof Z==="object"&&!Array.isArray(Z))Q[$]=[X,h(Z)]}),Object.fromEntries(Q)},p=(J)=>{if(typeof J!=="object"||J===null||Array.isArray(J))return!1;return Object.prototype.toString.call(J)==="[object Object]"},I=(J)=>{if(Array.isArray(J)){let Q=[...J],X=[];return Q.forEach((Z)=>{X.push(I(Z))}),X}if(p(J)){let Q={...J},X={};return Object.keys(Q).forEach((Z)=>{X[Z]=I(Q[Z])}),Object.freeze(X)}return J},j=(J)=>{if(Array.isArray(J)){let X=[...J],Z=[];return X.forEach(($)=>{Z.push(j($))}),Z}if(p(J)){let X={...J},Z={};return Object.keys(X).forEach(($)=>{Z[$]=j(X[$])}),Z}return J},d=(J,Q="index")=>J.map((X,Z)=>({[Q]:Z,value:X})),PJ=(J,Q)=>{let X=h(J),Z=h(Q),$=Object.keys(X),q=Object.keys(Z);if($.length!==q.length)return!1;for(let Y of $)if(!q.includes(Y)||!u(X[Y],Z[Y]))return!1;return!0},fJ=(J,Q)=>{if(J.length!==Q.length)return!1;if(J.length===0)return!0;for(let X=0;X<J.length;X++)if(!u(J[X],Q[X]))return!1;return!0},u=(J,Q)=>{if(typeof J!==typeof Q)return!1;if(Array.isArray(J))return fJ(J,Q);if(J===null||Q===null)return J===Q;if(typeof J==="object"&&!(J instanceof Set))return PJ(J,Q);if(typeof J==="bigint"||typeof J==="number"||typeof J==="string"||typeof J==="boolean")return J===Q;return J===Q},HJ=(J,Q,X)=>{let $=d(j(J),"index");return d(j(Q),"index").map((Y)=>{let B="add",U=-1,D=Y.value;return $.some((R,S)=>{if(B=u(R.value,Y.value)?R.index===Y.index?"idle":"shuffle":X&&R.value[X]!==void 0&&R.value[X]===Y.value[X]?"update":"add",B!=="add")return U=R.index,$.splice(S,1),!0;return!1}),{type:B,oldIndex:U,value:D}})},N=null,K=(J)=>{let Q=I(J),X=new Set;return{type:"source-signal",get value(){if(N)X.add(N);return j(Q)},set value(Z){if(Z===Q)return;Q=I(Z),X.forEach(($)=>$&&$())}}},g=(J)=>{N=J,J(),N=null},G=(J)=>{let Q,X=K(Q);return g(()=>{Q=J(Q),X.value=Q}),{type:"derived-signal",get prevValue(){return Q},get value(){return X.value}}},f=(J)=>["source-signal","derived-signal"].includes(J?.type),ZJ=(J,Q)=>J?.type==="non-signal"&&(!Q||!Q.length||Q.some((X)=>typeof J?.value===X)),s=(J)=>f(J)||ZJ(J),$J=(J)=>ZJ(J,["string"]),WJ=(J)=>J?.type==="non-signal"&&Array.isArray(J?.value)&&(J?.value).every((Q)=>typeof Q==="string"),k=(J)=>s(J)?J.value:J,YJ=(J)=>{if(!f(J)||!p(J.value))throw new Error("Thee argument should be signal of a plain object");return Object.keys(J.value).reduce((X,Z)=>{let $=Z;return X[$]=G(()=>J.value[$]),X},{})},z=(J,...Q)=>G(()=>{return J.reduce((X,Z,$)=>{let q,Y=Q[$];if(typeof Y==="function")q=Y()??"";else if(s(Y))q=Y.value??"";else q=Y??"";return`${X}${Z}${q.toString()}`},"")}),b=(J)=>Array.isArray(J),y=(J)=>!isNaN(J?.elementId)&&J?.elementId>0,O=(J)=>typeof J==="string"||typeof J==="function"&&J.isElementGetter,o=(J)=>f(J)&&O(J.value),OJ=(J)=>O(J)||o(J),qJ=(J)=>{return f(J)&&(O(J.value)||b(J.value)&&J.value.every((Q)=>O(Q)))},BJ=(J)=>{return!f(J)&&($J(J)||WJ(J)||O(J)||b(J)&&J.every((Q)=>OJ(Q)))},m=(J)=>{return qJ(J)||BJ(J)},r=!1,MJ={},H={},wJ=globalThis.MutationObserver,AJ=new wJ((J)=>{J.forEach((Q)=>{if(Q.type==="childList")Q.addedNodes.forEach((X)=>{if(y(X)){let Z=X,$=Z.elementId;if(H[$])delete H[$];else MJ[$]=Z.tagName}}),Q.removedNodes.forEach((X)=>{if(y(X)){let Z=X,$=Z.elementId,q=Z.unmountListener;if(q)H[$]={element:Z,unmountListener:q}}})}),Object.entries(H).forEach(([Q,X])=>{let{element:Z,unmountListener:$}=X;UJ(Z,$)})}),UJ=(J,Q)=>{if(!y(J))return;let X=J.children;for(let Z=0;Z<X.length;Z++){let $=X[Z];UJ($,$.unmountListener)}if(Q&&Q(J),H[J.elementId])delete H[J.elementId]},jJ=()=>{if(!r&&!P.currentIs("build"))AJ.observe(document.body,{childList:!0,subtree:!0}),r=!0},zJ=(J,Q)=>GJ.includes(J)&&Q===void 0,DJ=(J,Q)=>QJ.includes(J)&&typeof Q==="function",RJ=(J,Q)=>JJ.includes(J)&&typeof Q==="function",KJ=(J,Q)=>zJ(J,Q)||DJ(J,Q)||RJ(J,Q),kJ=(J,Q)=>{Object.entries(Q).forEach(([X,Z])=>{if(zJ(X,Z));else if(DJ(X,Z)){let $=X.slice(2);J.addEventListener($,(q)=>{if($==="keypress")q.preventDefault();Z(q)})}else if(RJ(X,Z)){if(X==="onmount"&&!P.currentIs("build")){let $=Z;setTimeout(()=>$(J),0)}if(X==="onunmount")jJ(),J.unmountListener=Z}else console.error(`Invalid event key: ${X} for element with tagName: ${J.tagName}`)})},i=(J,Q,X)=>{let Z=(s(X)?X.value:X)??"";if(typeof Z==="boolean")if(Z)J.setAttribute(Q,"");else J.removeAttribute(Q);else if(Q==="value")J.value=Z;else if(Z)J.setAttribute(Q,Z)},xJ=(J,Q)=>{let X={};Object.entries(Q).forEach((Z)=>{let[$,q]=Z;if(f(q))X[$]=q;i(J,$,q)}),g(()=>{Object.entries(X).forEach((Z)=>{let[$,q]=Z,Y=q.value;if(!P.currentIs("run"))return;i(J,$,Y)})})},V=(J)=>{if(o(J)){let Q=J.value;return V(Q)}if(typeof J==="string")return document.createTextNode(TJ(J));if(O(J)){let Q=J();if(!y(Q))throw new Error(`Invalid MHtml element getter child. Type: ${typeof J}`);return Q}throw new Error(`Invalid child. Type of child: ${typeof J}`)},SJ=(J,Q)=>{if(!Q)return;if(qJ(Q))g(()=>{let Z=Q.value,$=b(Z)?Z:[Z];$.forEach((Y,B)=>{let U=J.childNodes[B],D=V(Y);if(U&&D)J.replaceChild(D,U);else if(D)J.appendChild(D);else console.error(`No child found for node with tagName: ${J.tagName}`)});let q=$.length;while(q<J.childNodes.length){let Y=J.childNodes[q];if(Y)J.removeChild(Y)}});if(BJ(Q)){let X=$J(Q)?[Q.value]:WJ(Q)?Q.value:b(Q)?Q:[Q],Z=[];if(X.forEach(($,q)=>{if(o($))Z.push({index:q,childSignal:$});let Y=V($),B=J.childNodes[q];if(B&&Y)J.replaceChild(Y,B);else if(!B&&Y)J.appendChild(Y);else console.error(`No child found for node with tagName: ${J.tagName}`)}),Z.length)Z.forEach(({index:$,childSignal:q})=>{g(()=>{if(!q.value)return;if(!P.currentIs("run"))return;let Y=V(q.value),B=J.childNodes[$];if(B&&Y)J.replaceChild(Y,B);else if(!B&&Y)J.appendChild(Y);else console.error(`No child found for node with tagName: ${J.tagName}`)})})}},EJ=(J,Q)=>{let X=void 0,Z={},$={};return Object.entries(J).forEach(([q,Y])=>{if(q==="children")if(m(Y))X=Y;else throw new Error(`Invalid children prop for node with tagName: ${Q}

 ${JSON.stringify(Y)}`);else if(KJ(q,Y))Z[q]=Y;else $[q]=Y}),{children:X,eventProps:Z,attributeProps:$}},VJ=(J,Q)=>{let X=()=>{let Z=XJ.getNewId(),$=P.currentIs("mount")?document.querySelector(`[data-elem-id="${Z}"]`):document.createElement(J);$.elementId=Z,$.unmountListener=void 0;let q=m(Q)?{children:Q}:Q;if(!P.currentIs("run"))q["data-elem-id"]=$.elementId.toString();let Y=EJ(q,$.tagName);if(kJ($,Y.eventProps),xJ($,Y.attributeProps),SJ($,Y.children),!P.currentIs("build"))$.removeAttribute("data-elem-id");return $};return X.isElementGetter=!0,X},n=(J,Q,X)=>{let Z=K(Q),$=K(J),q=X(G(()=>$.value),G(()=>Z.value)),Y,B,U=!1;if(q?.isElementGetter)Y=()=>{if(U&&B)return B;return B=q(),U=!0,B},Y.isElementGetter=!0;else if(typeof q==="string")Y=q;else throw`One of the child, ${q} passed in ForElement is invalid.`;return{indexSignal:Z,itemSignal:$,mappedChild:Y}},a=(J,Q,X)=>{if(Q!==void 0&&Q>=0&&X){let Z=Q>J.length?J.length:Q;J.splice(Z,0,X)}return J},IJ=({subject:J,itemKey:Q,map:X,n:Z,nthChild:$})=>{if($&&Z===void 0||Z!==void 0&&Z>-1&&!$)throw new Error("Either both 'n' and 'nthChild' be passed or none of them.");let q=G(()=>{let _=k(J);return Array.isArray(_)?_:[]});if(!Q)return G(()=>a(q.value.map(X),Z,$));let Y=$;if($&&typeof $!=="string"){let _=$(),M=()=>_;M.isElementGetter=!0,Y=M}let B=q.value;if(B.length&&typeof B[0]!=="object")throw new Error("for mutable map, item in the list must be an object");let U=null,D=G((_)=>{return U=_||U,q.value}),R=G((_)=>{if(!_||!U)return D.value.map((w,L)=>n(w,L,X));return HJ(U,D.value,Q).map((T,w)=>{let L=(_||[])[T.oldIndex];if(console.assert(T.type==="add"&&T.oldIndex===-1&&!L||T.oldIndex>-1&&!!L,"In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer."),L){if(T.type==="shuffle")L.indexSignal.value=w;if(T.type==="update")L.indexSignal.value=w,L.itemSignal.value={...T.value};return L}return n(T.value,w,X)})});return G(()=>a(R.value.map((_)=>_.mappedChild),Z,Y))},NJ=({subject:J,isTruthy:Q,isFalsy:X})=>{let Z=W.Span({style:"display: none;"}),$=()=>(k(J)?Q:X)||Z;return f(J)?G($):$()},gJ=({subject:J,caseMatcher:Q,defaultCase:X,cases:Z})=>{let $=()=>{let q=k(J),Y=void 0;for(let[B,U]of Object.entries(Z))if(Q&&Q(J,B)||q===B){Y=U;break}return Y||X||W.Span({style:"display: none;"})};return f(J)?G($):$()},bJ=FJ.reduce((J,Q)=>{let X=Q.split("").map(($,q)=>!q?$.toUpperCase():$).join(""),Z=($)=>VJ(Q,$);return J[X]=Z,J},{}),yJ={For:IJ,If:NJ,Switch:gJ},W={...bJ,...yJ},F=(J)=>(Q)=>{let X=Object.entries(Q).reduce((Z,$)=>{let[q,Y]=$,B=typeof Y==="string",U=Array.isArray(Y)&&Y.every((R)=>typeof R==="string"),D=f(Y)||typeof Y==="function"?Y:B||U?{type:"non-signal",get value(){return k(Y)}}:m(Y)?Y:{type:"non-signal",get value(){return k(Y)}};return Z[q]=D,Z},{});return J(X)},CJ=F(({logoSrc:J,logoHref:Q,logoSize:X,labelComponent:Z})=>{let $=z`${()=>X?.value||32}`;return W.A({class:"space-mono link black flex items-center justify-start",href:Q,children:[W.Img({src:J,height:$,width:$}),W.If({subject:Z,isTruthy:Z})]})}),nJ=F(({children:J})=>W.Div({class:"flex items-center",children:J})),t=F(({classNames:J,labelClassNames:Q,href:X,label:Z,onClick:$})=>{return W.Button({class:z`flex justify-stretch pointer hover-bg-gray b--gray ba bw1 br-pill ${J}`,onclick:$,children:W.A({class:z`w-100 no-underline bg-transparent dark-gray hover-white pv2 ph3 ${Q}`,href:X,children:Z})})}),l=F(({className:J})=>W.Div({class:z`bl b--moon-gray min-vh-20 ${J}`})),_J=F(({classNames:J,url:Q,size:X})=>W.A({class:J,target:"_blank",href:Q||"https://github.com",children:[W.Img({class:"ba b--none br-100",src:"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",height:z`${()=>X?.value||32}`,width:z`${()=>X?.value||32}`})]})),cJ=F(({classNames:J,name:Q,size:X,onClick:Z})=>{return W.Span({class:z`material-symbols-rounded ${Z?"pointer":""} ${J}`,style:z`font-size: ${X?.value??24}px; line-height: ${X?.value??24}px;`,onclick:Z,children:Q})}),x=F(({classNames:J,colorCss:Q,target:X,isSelected:Z,href:$,onClick:q,label:Y})=>{return W.A({class:z`link underline ${$||q?"pointer":""} ${()=>Z?.value?`bg-${Q?.value||"red"} white`:`${Q?.value||"red"}`} ${J}`,target:X,href:$,onclick:q,children:Y})}),aJ=F(({classNames:J,children:Q})=>{return W.Div({class:z`dn db-ns fg3 pb3 pr2 max-h-80 overflow-y-scroll ${J}`,style:`
      scrollbar-color: #e8e8e8 #f2f1f0;
      scrollbar-width: thin;
    `,children:Q})}),tJ=F(({classNames:J,linkColorCss:Q,text:X})=>{return console.log(X.value),W.Span({class:z`${J}`,children:W.If({subject:X.value.includes("##"),isFalsy:X.value,isTruthy:W.Span(W.For({subject:X.value.split("##"),map:(Z,$)=>W.If({subject:$%2===0,isTruthy:Z,isFalsy:x({colorCss:Q||"purple",target:"_blank",label:Z.split("|")[0],href:Z.split("|")[1]})})}))})})}),c=F(({classNames:J,titleClassNames:Q,itemClassNames:X,title:Z,justifyRight:$,links:q,onLinkClick:Y,linkColorCss:B,bottomComponent:U})=>W.Div({class:z`${()=>$?.value?"tr":""} ${J}`,children:[W.P({class:z`space-mono mt0 f3 lh-solid ${Q}`,children:Z}),W.Div(W.For({subject:q,itemKey:"title",map:(D,R)=>{let{title:S,href:_,isSelected:M}=YJ(D);return W.Div({class:X,children:[x({colorCss:B,label:S,onClick:()=>Y&&Y(R.value),href:_,isSelected:M})]})}})),W.If({subject:U,isTruthy:U})]})),C=F(({classNames:J,contentClassNames:Q,children:X})=>{return W.Div({class:z`w-100 bg-pale ${J}`,children:[W.Div({class:z`mw8 center ${Q}`,children:X})]})}),hJ=C({classNames:"bg-pale-dark nl3 nr3 nb3 w-auto",contentClassNames:"flex flex-wrap items-start justify-between pv4",children:[W.Div({class:"flex flex-column items-stretch justify-between",children:[W.Div({children:[W.A({class:"flex items-center justify-start no-underline",href:"https://www.cyfer.tech",children:[W.Img({src:"/assets/images/cyfer-logo.png",height:"32",width:"32"})]}),W.P({class:"m0 f7",children:"© 2024 Cyfer Tech."}),W.P({class:"nt2 f7",children:"All rights reserved."})]}),W.Span({class:"mt4 pt3 mb0",children:[W.Span({children:"This site is created using "}),x({classNames:"underline",href:"https://maya.cyfer.tech",label:"Maya"}),W.Span({children:"."})]})]}),W.Div({class:"flex flex-wrap items-start justify-between",children:[c({justifyRight:!0,classNames:"pr3",itemClassNames:"mb3",title:"Company",links:[{title:"About us",href:"#about-us"},{title:"Blogs",href:"#blogs"},{title:"Team",href:"#about-us"},{title:"Career",href:"/careers"}]}),l({className:"mh4 ph2"}),c({justifyRight:!0,classNames:"pr3",itemClassNames:"mb3",title:"Products",links:[{title:"Maya",href:"/products/maya"},{title:"KarmaJs",href:"/karma"},{title:"Yajman",href:"/yajman"},{title:"Batua",href:"/batua"}]}),l({className:"mh4 ph2"}),W.Div({children:[c({justifyRight:!0,itemClassNames:"mb3",title:"Relations",links:[{title:"Sponsor Us",href:"/sponsor-us"},{title:"FAQs",href:"/faqs"},{title:"Feedback",href:"/feedback"}],bottomComponent:W.Span({class:"flex items-center justify-end",children:[_J({url:"https://github.com/cyftec"}),W.A({class:"ml3",target:"_blank",href:"https://twitter.com/cyftec",children:[W.Img({class:"ba b--none br-100",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAA/0lEQVR4AbXPIazCMACE4d+L2qoZFEGSIGcRc/gJJB5XMzGJmK9EN0HMi+qaibkKVF1txdQe4g0YzPK5yyWXHL9TaPNQ89LojH87N1rbJcXkMF4Fk31UMrf34hm14KUeoQxGArALHTMuQD2cAWQfJXOpgTbksGr9ng8qluShJTPhyCdx63POg7rEim95ZyR68I1ggQpnCEGwyPicw6hZtPEGmnhkycqOio1zm6XuFtyw5XDXfGvuau0dXHzJp8pfBPuhIXO9ZK5ILUCdSvLYMpc6ASBtl3EaC97I4KaFaOCaBE9Zn5jUsVqR2vcTJZO1DdbGoZryVp94Ka/mQfE7f2T3df0WBhLDAAAAAElFTkSuQmCC",height:"24",width:"24"})]})]})})]})]})]}),vJ="0.1.14",e="Maya UI Framework",A={DOCS:{HREF:"/docs",LABEL_S:"docs",LABEL_M:"go to docs &rarr;",LABEL_L:"go to documentation &rarr;"},TUTORIAL:{HREF:"/tutorial",LABEL_S:"create your first app",LABEL_NS:"create your first app &rarr;"}},pJ="With your favourite web framework, now",uJ=[["You can write your app completely in one language - TypeScript.","You don't need mutiple (transpilers or pre/post processor) languages like JSX or SCSS to develop a simple app. Besides, unlike JSX, Maya's templating syntax is completely TypeScript and is naturally very similar to HTML."],["You get dynamic behaviour in your app with a static site structure.","Your app is now an MPA (Multi Page Application) and resembles plain old HTML-CSS-JS app which had multiple pages."],["You get Component Driven Architecture on top of full DOM access.","You don't need a hacky syntax to directly access and modify DOM just because your library or framework is designed in a certain way."],["You don't need an odd-looking syntax for conditional components.","For example, using ternary operators for conditionally rendering one of the two components in an if-else case scenario. You get inbuilt components like 'If', 'For' or 'Switch'. However, you're free to use any TS/JS syntax for your purpose."],["You get a fine-grained and dev-freindly reacivity using Signals.","Signals are basic data units that can automatically alert functions or computations when the data it holds changes. It helps in surgically modifying the DOM elements or their attributes. Your state change should not result in entire component to be re-rendered."],["You get a dedicated cli for developing your favourite app.","Using 'brahma' cli, you can spawn, continuously-develop and build your favourite (Maya) app in any mode."],["You can develop a PWA or a chrome extension in a much easier way.","The cli can create the boilerplate app in any given mode such as web, pwa or a chrome extension. Defining your manifest.json for PWAs or chrome extensions has got easier, because you can write them in TypeScript now, with the benefits of intellisense."],["Your project has all the configurations in a single uber-level file.","You project should not necessarily show all scattered config files all the time, which gets modified rarely and looks more like a bloat."],["Your app is built completely before deployment.","So you don't need an app server or a cloud compute machine for hosting your app. You just need a static file server like CDNs. Your fully reactive app can be hosted even on GitHub Pages. You don't need a full blown cloud server to showcase your simple, yet awesome calculator app."]],sJ=K(document.location.hash),v=K(document.location.pathname);window.onhashchange=()=>{console.log(`New hash is: ${document.location.hash}`),sJ.value=document.location.hash};window.onpopstate=()=>{console.log(`New pathname is: ${document.location.pathname}`),v.value=document.location.pathname};var oJ=G(()=>{return[{isSelected:v.value.startsWith("/docs"),colorCss:"purple",href:"/docs/",label:"Docs"},{isSelected:v.value.startsWith("/tutorial"),colorCss:"purple",href:"/tutorial/",label:"Tutorial"},{isSelected:!1,colorCss:"purple",target:"_blank",href:"https://www.cyfer.tech/blogs/?tags=maya",label:"Blogs"}]}),mJ=()=>{return C({children:W.Div({class:"pv3 bg-pale flex items-center justify-between",children:[CJ({logoSize:36,logoSrc:"/assets/images/maya-logo.png",logoHref:"/",labelComponent:W.A({class:"ml3 link black no-underline",href:"/",children:[W.Div({class:"f4",children:"MAYA"}),x({classNames:"f7",colorCss:"black",target:"_blank",href:"https://github.com/cyftec/maya-ui",label:vJ})]})}),W.Div({class:"flex items-center justify-end",children:W.For({subject:oJ,itemKey:"label",n:1/0,nthChild:W.Div({class:"flex items-center",children:[W.Span({class:"db dn-ns",children:cJ({size:32,name:"menu",onClick:()=>{}})}),_J({size:42,classNames:"ml3",url:"https://github.com/cyftec/maya-ui"})]}),map:(J)=>{let Q=YJ(J);return x({classNames:"db-ns dn ml3 pv1 ph2",isSelected:Q.isSelected,colorCss:Q.colorCss,target:Q.target,href:Q.href,label:Q.label})}})})]})})},dJ=F(({title:J,app:Q,headElements:X})=>{return W.Html({lang:"en",children:[W.Head([W.Meta({name:"viewport",content:"width=device-width, initial-scale=1"}),W.Title(J),W.Link({rel:"stylesheet",href:"/assets/styles.css"}),W.Link({rel:"icon",type:"image/x-icon",href:"/assets/favicon.ico"}),...X||[]]),W.Body({class:"ph3",children:[W.Script({src:"main.js",defer:!0}),mJ(),C({children:Q}),hJ]})]})}),rJ=dJ({title:e,app:C({contentClassNames:"pb5",children:[W.Div({class:"flex flex-wrap justify-center sticky top-0 nl3 nr3 mh0-l bg-pale",children:[W.Div({class:"w-100 flex items-center justify-between pa4 bg-maya",children:[W.Div({class:"space-mono f1-l f2-m f3 b white",children:e}),t({classNames:"bg-white",labelClassNames:"ph4-ns pv3-ns ph3 pv2",label:W.Span([W.Span({class:"db dn-ns",children:A.DOCS.LABEL_S}),W.Span({class:"db-m dn",children:A.DOCS.LABEL_M}),W.Span({class:"db-l dn",children:A.DOCS.LABEL_L})]),href:"/docs"})]}),W.Div({class:"db mv4-ns mv3 pt2 ph0-l ph4 tc b f3",children:pJ})]}),W.Div({class:"flex flex-wrap justify-center ph0-l ph4",children:W.For({subject:uJ,n:1/0,nthChild:t({classNames:"w-60-ns bg-white",labelClassNames:"w-100 ph4 pv3",label:W.Span([W.Span({class:"di-ns dn",children:A.TUTORIAL.LABEL_NS}),W.Span({class:"di dn-ns",children:A.TUTORIAL.LABEL_S})]),href:"/tutorial"}),map:([J,Q])=>W.Div({class:"w-60-ns mt2 mb4 ph5-l pv4-l ph4 pv3 bg-near-white br3 lh-copy",children:[W.H3({children:J}),W.Div({class:"gray mb3",children:Q||""})]})})})]})}),iJ=()=>{P.start("mount"),XJ.resetIdCounter(),rJ(),P.start("run")};iJ();
