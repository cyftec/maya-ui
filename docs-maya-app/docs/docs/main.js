var QJ=["onmount","onunmount"],XJ=["onerror","onload","onresize","onblur","onchange","oncontextmenu","onfocus","oninput","oninvalid","onreset","onselect","onsubmit","onkeydown","onkeypress","onkeyup","onclick","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","onmousedown","onmousemove","onmouseout","onmouseover","onmouseup","onscroll","onabort","oncanplay","oncanplaythrough","ondurationchange","onemptied","onended","onerror","onloadeddata","onloadedmetadata","onloadstart","onpause","onplay","onplaying","onprogress","onratechange","onseeked","onseeking","onstalled","onsuspend","ontimeupdate","onvolumechange","onwaiting"],GJ=[...XJ,...QJ],FJ=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"],x,LJ=(J)=>{if(!x)x=document.createElement("textarea");return x.innerHTML=J,x.value},MJ=()=>{let J=0;return{getNewId:()=>++J,resetIdCounter:()=>J=0}},ZJ=MJ(),A={currentIs:(J)=>window._currentAppPhase===J,start:(J)=>{window._currentAppPhase=J,console.log(`Current phase is ${J}`)}},c=(J)=>{let Q=Object.entries(J).sort((Z,X)=>Z[0].localeCompare(X[0]));return Q.forEach(([Z,X],$)=>{if(X&&typeof X==="object"&&!Array.isArray(X))Q[$]=[Z,c(X)]}),Object.fromEntries(Q)},p=(J)=>{if(typeof J!=="object"||J===null||Array.isArray(J))return!1;return Object.prototype.toString.call(J)==="[object Object]"},I=(J)=>{if(Array.isArray(J)){let Q=[...J],Z=[];return Q.forEach((X)=>{Z.push(I(X))}),Z}if(p(J)){let Q={...J},Z={};return Object.keys(Q).forEach((X)=>{Z[X]=I(Q[X])}),Object.freeze(Z)}return J},E=(J)=>{if(Array.isArray(J)){let Z=[...J],X=[];return Z.forEach(($)=>{X.push(E($))}),X}if(p(J)){let Z={...J},X={};return Object.keys(Z).forEach(($)=>{X[$]=E(Z[$])}),X}return J},a=(J,Q="index")=>J.map((Z,X)=>({[Q]:X,value:Z})),fJ=(J,Q)=>{let Z=c(J),X=c(Q),$=Object.keys(Z),B=Object.keys(X);if($.length!==B.length)return!1;for(let W of $)if(!B.includes(W)||!s(Z[W],X[W]))return!1;return!0},HJ=(J,Q)=>{if(J.length!==Q.length)return!1;if(J.length===0)return!0;for(let Z=0;Z<J.length;Z++)if(!s(J[Z],Q[Z]))return!1;return!0},s=(J,Q)=>{if(typeof J!==typeof Q)return!1;if(Array.isArray(J))return HJ(J,Q);if(J===null||Q===null)return J===Q;if(typeof J==="object"&&!(J instanceof Set))return fJ(J,Q);if(typeof J==="bigint"||typeof J==="number"||typeof J==="string"||typeof J==="boolean")return J===Q;return J===Q},OJ=(J,Q,Z)=>{let $=a(E(J),"index");return a(E(Q),"index").map((W)=>{let U="add",z=-1,D=W.value;return $.some((L,w)=>{if(U=s(L.value,W.value)?L.index===W.index?"idle":"shuffle":Z&&L.value[Z]!==void 0&&L.value[Z]===W.value[Z]?"update":"add",U!=="add")return z=L.index,$.splice(w,1),!0;return!1}),{type:U,oldIndex:z,value:D}})},g=null,j=(J)=>{let Q=I(J),Z=new Set;return{type:"source-signal",get value(){if(g)Z.add(g);return E(Q)},set value(X){if(X===Q)return;Q=I(X),Z.forEach(($)=>$&&$())}}},V=(J)=>{g=J,J(),g=null},F=(J)=>{let Q,Z=j(Q);return V(()=>{Q=J(Q),Z.value=Q}),{type:"derived-signal",get prevValue(){return Q},get value(){return Z.value}}},P=(J)=>["source-signal","derived-signal"].includes(J?.type),$J=(J,Q)=>J?.type==="non-signal"&&(!Q||!Q.length||Q.some((Z)=>typeof J?.value===Z)),m=(J)=>P(J)||$J(J),YJ=(J)=>$J(J,["string"]),WJ=(J)=>J?.type==="non-signal"&&Array.isArray(J?.value)&&(J?.value).every((Q)=>typeof Q==="string"),S=(J)=>m(J)?J.value:J,o=(J)=>{if(!P(J)||!p(J.value))throw new Error("Thee argument should be signal of a plain object");return Object.keys(J.value).reduce((Z,X)=>{let $=X;return Z[$]=F(()=>J.value[$]),Z},{})},H=(J,...Q)=>F(()=>{return J.reduce((Z,X,$)=>{let B,W=Q[$];if(typeof W==="function")B=W()??"";else if(m(W))B=W.value??"";else B=W??"";return`${Z}${X}${B.toString()}`},"")}),C=(J)=>Array.isArray(J),v=(J)=>!isNaN(J?.elementId)&&J?.elementId>0,k=(J)=>typeof J==="string"||typeof J==="function"&&J.isElementGetter,d=(J)=>P(J)&&k(J.value),AJ=(J)=>k(J)||d(J),BJ=(J)=>{return P(J)&&(k(J.value)||C(J.value)&&J.value.every((Q)=>k(Q)))},qJ=(J)=>{return!P(J)&&(YJ(J)||WJ(J)||k(J)||C(J)&&J.every((Q)=>AJ(Q)))},r=(J)=>{return BJ(J)||qJ(J)},n=!1,PJ={},T={},wJ=globalThis.MutationObserver,KJ=new wJ((J)=>{J.forEach((Q)=>{if(Q.type==="childList")Q.addedNodes.forEach((Z)=>{if(v(Z)){let X=Z,$=X.elementId;if(T[$])delete T[$];else PJ[$]=X.tagName}}),Q.removedNodes.forEach((Z)=>{if(v(Z)){let X=Z,$=X.elementId,B=X.unmountListener;if(B)T[$]={element:X,unmountListener:B}}})}),Object.entries(T).forEach(([Q,Z])=>{let{element:X,unmountListener:$}=Z;UJ(X,$)})}),UJ=(J,Q)=>{if(!v(J))return;let Z=J.children;for(let X=0;X<Z.length;X++){let $=Z[X];UJ($,$.unmountListener)}if(Q&&Q(J),T[J.elementId])delete T[J.elementId]},jJ=()=>{if(!n&&!A.currentIs("build"))KJ.observe(document.body,{childList:!0,subtree:!0}),n=!0},_J=(J,Q)=>GJ.includes(J)&&Q===void 0,zJ=(J,Q)=>XJ.includes(J)&&typeof Q==="function",RJ=(J,Q)=>QJ.includes(J)&&typeof Q==="function",TJ=(J,Q)=>_J(J,Q)||zJ(J,Q)||RJ(J,Q),kJ=(J,Q)=>{Object.entries(Q).forEach(([Z,X])=>{if(_J(Z,X));else if(zJ(Z,X)){let $=Z.slice(2);J.addEventListener($,(B)=>{if($==="keypress")B.preventDefault();X(B)})}else if(RJ(Z,X)){if(Z==="onmount"&&!A.currentIs("build")){let $=X;setTimeout(()=>$(J),0)}if(Z==="onunmount")jJ(),J.unmountListener=X}else console.error(`Invalid event key: ${Z} for element with tagName: ${J.tagName}`)})},t=(J,Q,Z)=>{let X=(m(Z)?Z.value:Z)??"";if(typeof X==="boolean")if(X)J.setAttribute(Q,"");else J.removeAttribute(Q);else if(Q==="value")J.value=X;else if(X)J.setAttribute(Q,X)},EJ=(J,Q)=>{let Z={};Object.entries(Q).forEach((X)=>{let[$,B]=X;if(P(B))Z[$]=B;t(J,$,B)}),V(()=>{Object.entries(Z).forEach((X)=>{let[$,B]=X,W=B.value;if(!A.currentIs("run"))return;t(J,$,W)})})},b=(J)=>{if(d(J)){let Q=J.value;return b(Q)}if(typeof J==="string")return document.createTextNode(LJ(J));if(k(J)){let Q=J();if(!v(Q))throw new Error(`Invalid MHtml element getter child. Type: ${typeof J}`);return Q}throw new Error(`Invalid child. Type of child: ${typeof J}`)},VJ=(J,Q)=>{if(!Q)return;if(BJ(Q))V(()=>{let X=Q.value,$=C(X)?X:[X];$.forEach((W,U)=>{let z=J.childNodes[U],D=b(W);if(z&&D)J.replaceChild(D,z);else if(D)J.appendChild(D);else console.error(`No child found for node with tagName: ${J.tagName}`)});let B=$.length;while(B<J.childNodes.length){let W=J.childNodes[B];if(W)J.removeChild(W)}});if(qJ(Q)){let Z=YJ(Q)?[Q.value]:WJ(Q)?Q.value:C(Q)?Q:[Q],X=[];if(Z.forEach(($,B)=>{if(d($))X.push({index:B,childSignal:$});let W=b($),U=J.childNodes[B];if(U&&W)J.replaceChild(W,U);else if(!U&&W)J.appendChild(W);else console.error(`No child found for node with tagName: ${J.tagName}`)}),X.length)X.forEach(({index:$,childSignal:B})=>{V(()=>{if(!B.value)return;if(!A.currentIs("run"))return;let W=b(B.value),U=J.childNodes[$];if(U&&W)J.replaceChild(W,U);else if(!U&&W)J.appendChild(W);else console.error(`No child found for node with tagName: ${J.tagName}`)})})}},SJ=(J,Q)=>{let Z=void 0,X={},$={};return Object.entries(J).forEach(([B,W])=>{if(B==="children")if(r(W))Z=W;else throw new Error(`Invalid children prop for node with tagName: ${Q}

 ${JSON.stringify(W)}`);else if(TJ(B,W))X[B]=W;else $[B]=W}),{children:Z,eventProps:X,attributeProps:$}},NJ=(J,Q)=>{let Z=()=>{let X=ZJ.getNewId(),$=A.currentIs("mount")?document.querySelector(`[data-elem-id="${X}"]`):document.createElement(J);$.elementId=X,$.unmountListener=void 0;let B=r(Q)?{children:Q}:Q;if(!A.currentIs("run"))B["data-elem-id"]=$.elementId.toString();let W=SJ(B,$.tagName);if(kJ($,W.eventProps),EJ($,W.attributeProps),VJ($,W.children),!A.currentIs("build"))$.removeAttribute("data-elem-id");return $};return Z.isElementGetter=!0,Z},l=(J,Q,Z)=>{let X=j(Q),$=j(J),B=Z(F(()=>$.value),F(()=>X.value)),W,U,z=!1;if(B?.isElementGetter)W=()=>{if(z&&U)return U;return U=B(),z=!0,U},W.isElementGetter=!0;else if(typeof B==="string")W=B;else throw`One of the child, ${B} passed in ForElement is invalid.`;return{indexSignal:X,itemSignal:$,mappedChild:W}},e=(J,Q,Z)=>{if(Q!==void 0&&Q>=0&&Z){let X=Q>J.length?J.length:Q;J.splice(X,0,Z)}return J},xJ=({subject:J,itemKey:Q,map:Z,n:X,nthChild:$})=>{if($&&X===void 0||X!==void 0&&X>-1&&!$)throw new Error("Either both 'n' and 'nthChild' be passed or none of them.");let B=F(()=>{let q=S(J);return Array.isArray(q)?q:[]});if(!Q)return F(()=>e(B.value.map(Z),X,$));let W=$;if($&&typeof $!=="string"){let q=$(),G=()=>q;G.isElementGetter=!0,W=G}let U=B.value;if(U.length&&typeof U[0]!=="object")throw new Error("for mutable map, item in the list must be an object");let z=null,D=F((q)=>{return z=q||z,B.value}),L=F((q)=>{if(!q||!z)return D.value.map((M,f)=>l(M,f,Z));return OJ(z,D.value,Q).map((R,M)=>{let f=(q||[])[R.oldIndex];if(console.assert(R.type==="add"&&R.oldIndex===-1&&!f||R.oldIndex>-1&&!!f,"In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer."),f){if(R.type==="shuffle")f.indexSignal.value=M;if(R.type==="update")f.indexSignal.value=M,f.itemSignal.value={...R.value};return f}return l(R.value,M,Z)})});return F(()=>e(L.value.map((q)=>q.mappedChild),X,W))},bJ=({subject:J,isTruthy:Q,isFalsy:Z})=>{let X=Y.Span({style:"display: none;"}),$=()=>(S(J)?Q:Z)||X;return P(J)?F($):$()},yJ=({subject:J,caseMatcher:Q,defaultCase:Z,cases:X})=>{let $=()=>{let B=S(J),W=void 0;for(let[U,z]of Object.entries(X))if(Q&&Q(J,U)||B===U){W=z;break}return W||Z||Y.Span({style:"display: none;"})};return P(J)?F($):$()},IJ=FJ.reduce((J,Q)=>{let Z=Q.split("").map(($,B)=>!B?$.toUpperCase():$).join(""),X=($)=>NJ(Q,$);return J[Z]=X,J},{}),gJ={For:xJ,If:bJ,Switch:yJ},Y={...IJ,...gJ},O=(J)=>(Q)=>{let Z=Object.entries(Q).reduce((X,$)=>{let[B,W]=$,U=typeof W==="string",z=Array.isArray(W)&&W.every((L)=>typeof L==="string"),D=P(W)||typeof W==="function"?W:U||z?{type:"non-signal",get value(){return S(W)}}:r(W)?W:{type:"non-signal",get value(){return S(W)}};return X[B]=D,X},{});return J(Z)},CJ=O(({logoSrc:J,logoHref:Q,logoSize:Z,labelComponent:X})=>{let $=H`${()=>Z?.value||32}`;return Y.A({class:"space-mono link black flex items-center justify-start",href:Q,children:[Y.Img({src:J,height:$,width:$}),Y.If({subject:X,isTruthy:X})]})}),lJ=O(({children:J})=>Y.Div({class:"flex items-center",children:J})),vJ=O(({classNames:J,labelClassNames:Q,href:Z,label:X,onClick:$})=>{return Y.Button({class:H`flex justify-stretch pointer hover-bg-gray b--gray ba bw1 br-pill ${J}`,onclick:$,children:Y.A({class:H`w-100 no-underline bg-transparent dark-gray hover-white pv2 ph3 ${Q}`,href:Z,children:X})})}),JJ=O(({className:J})=>Y.Div({class:H`bl b--moon-gray min-vh-20 ${J}`})),DJ=O(({classNames:J,url:Q,size:Z})=>Y.A({class:J,target:"_blank",href:Q||"https://github.com",children:[Y.Img({class:"ba b--none br-100",src:"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",height:H`${()=>Z?.value||32}`,width:H`${()=>Z?.value||32}`})]})),hJ=O(({classNames:J,name:Q,size:Z,onClick:X})=>{return Y.Span({class:H`material-symbols-rounded ${X?"pointer":""} ${J}`,style:H`font-size: ${Z?.value??24}px; line-height: ${Z?.value??24}px;`,onclick:X,children:Q})}),N=O(({classNames:J,colorCss:Q,target:Z,isSelected:X,href:$,onClick:B,label:W})=>{return Y.A({class:H`link underline ${$||B?"pointer":""} ${()=>X?.value?`bg-${Q?.value||"red"} white`:`${Q?.value||"red"}`} ${J}`,target:Z,href:$,onclick:B,children:W})}),cJ=O(({classNames:J,children:Q})=>{return Y.Div({class:H`dn db-ns fg3 pb3 pr2 max-h-80 overflow-y-scroll ${J}`,style:`
      scrollbar-color: #e8e8e8 #f2f1f0;
      scrollbar-width: thin;
    `,children:Q})}),eJ=O(({classNames:J,linkColorCss:Q,text:Z})=>{return console.log(Z.value),Y.Span({class:H`${J}`,children:Y.If({subject:Z.value.includes("##"),isFalsy:Z.value,isTruthy:Y.Span(Y.For({subject:Z.value.split("##"),map:(X,$)=>Y.If({subject:$%2===0,isTruthy:X,isFalsy:N({colorCss:Q||"purple",target:"_blank",label:X.split("|")[0],href:X.split("|")[1]})})}))})})}),y=O(({classNames:J,titleClassNames:Q,itemClassNames:Z,title:X,justifyRight:$,links:B,onLinkClick:W,linkColorCss:U,bottomComponent:z})=>Y.Div({class:H`${()=>$?.value?"tr":""} ${J}`,children:[Y.P({class:H`space-mono mt0 f3 lh-solid ${Q}`,children:X}),Y.Div(Y.For({subject:B,itemKey:"title",map:(D,L)=>{let{title:w,href:q,isSelected:G}=o(D);return Y.Div({class:Z,children:[N({colorCss:U,label:w,onClick:()=>W&&W(L.value),href:q,isSelected:G})]})}})),Y.If({subject:z,isTruthy:z})]})),i=O(({classNames:J,contentClassNames:Q,children:Z})=>{return Y.Div({class:H`w-100 bg-pale ${J}`,children:[Y.Div({class:H`mw8 center ${Q}`,children:Z})]})}),uJ=O(({htmlTitle:J,pageTitle:Q,headElements:Z,chapters:X})=>{let $=j([0,0]),B=j(0),W=F(()=>{let[q,G]=$.value;return X.value[q].topics[G]}),{title:U,article:z}=o(W),D=F(()=>{let[q,G]=$.value;return[X.value[q].title,X.value[q].topics[G].title]}),L=F(()=>{let[q,G]=$.value,R=q,M=G-1;if(!X.value[R]?.topics[M])R=q-1,M=X.value[R]?.topics.length-1||-1;let f=q,K=G+1;if(!X.value[f]?.topics[K])f=q+1,K=0;return{prevChapterIndex:R,prevTopicIndex:M,nextChapterIndex:f,nextTopicIndex:K}}),w=F(()=>{let{prevChapterIndex:q,prevTopicIndex:G,nextChapterIndex:R,nextTopicIndex:M}=L.value,f=X.value[q]?.topics[G]?{isNext:!1,pathIndices:[q,G],chapterTitle:X.value[q].title,title:X.value[q].topics[G].title}:void 0,K=X.value[R]?.topics[M]?{isNext:!0,pathIndices:[R,M],chapterTitle:X.value[R].title,title:X.value[R].topics[M].title}:void 0;return[f,K].filter((h)=>!!h)});return iJ({title:J,headElements:Z,app:pJ({headerTitle:Q,headerComponent:Y.Div({class:"flex flex-wrap items-center f7 b silver light-silver-ns",children:Y.For({subject:D,map:(q)=>Y.Div({class:"mb2 mb0-ns pointer",children:["/",Y.Span({class:"pa1 ph2-ns mh1 br3",children:q})]})})}),navbarComponent:Y.For({subject:X,map:({title:q,topics:G},R)=>y({classNames:"mb4 pb3",titleClassNames:"f4",itemClassNames:"mb2 pb1 f6",linkColorCss:"purple",title:`${R+1}. ${q}`,onLinkClick:(M)=>$.value=[R,M],links:F(()=>G.map((M,f)=>{let[K,h]=$.value;return{title:M.title,isSelected:K===R&&h===f}}))}),n:1/0,nthChild:Y.P({class:"gray f6",children:"** end of list **"})}),contentTitle:U,scrollToTopCounterSignal:B,contentComponent:[z,Y.Div({class:"flex-ns justify-stretch mv4 w-100",children:Y.For({subject:w,n:1,nthChild:Y.Div({class:F(()=>w.value.length>1?"mh3":"")}),map:(q)=>vJ({classNames:"w-100 mt3",onClick:()=>{$.value=q.pathIndices,B.value++},label:Y.Div({class:"tc",children:[q.isNext?"Next Topic &rarr;":"&larr; Previous Topic",Y.Div({class:"f7 mt1",children:[Y.Span({class:"silver",children:q.chapterTitle+": "}),Y.Span({class:"black",children:q.title})]})]})})})})]})})}),_=Y.Div("Coming soon.."),pJ=O(({headerClassNames:J,headerTitle:Q,headerComponent:Z,navbarClassNames:X,navbarComponent:$,contentClassNames:B,contentTitle:W,contentComponent:U,scrollToTopCounterSignal:z})=>{let D;return V(()=>{if(z?.value)D.scrollTo({top:0})}),Y.Div({children:[Y.Div({class:H`mb3 flex-ns flex-wrap items-center ${J}`,children:[Y.H1({class:"mr3 mv2 mv3-ns",children:Q}),Y.If({subject:Z,isTruthy:Z})]}),Y.Div({class:"flex w-100 w-auto-ns",children:[cJ({classNames:X,children:$}),Y.Div({onmount:(L)=>D=L,class:H`fg7 pb5 w-70-ns mw-100 w-auto-ns max-h-80 overflow-y-scroll
              dark-gray gray-ns lh-copy-ns lh-title ${B}`,children:[Y.H2({class:"mt0 lh-solid black mid-gray-ns",children:W}),Y.Div({class:"",children:U})]})]})]})}),sJ=i({classNames:"bg-pale-dark nl3 nr3 nb3 w-auto",contentClassNames:"flex flex-wrap items-start justify-between pv4",children:[Y.Div({class:"flex flex-column items-stretch justify-between",children:[Y.Div({children:[Y.A({class:"flex items-center justify-start no-underline",href:"https://www.cyfer.tech",children:[Y.Img({src:"/assets/images/cyfer-logo.png",height:"32",width:"32"})]}),Y.P({class:"m0 f7",children:"© 2024 Cyfer Tech."}),Y.P({class:"nt2 f7",children:"All rights reserved."})]}),Y.Span({class:"mt4 pt3 mb0",children:[Y.Span({children:"This site is created using "}),N({classNames:"underline",href:"https://maya.cyfer.tech",label:"Maya"}),Y.Span({children:"."})]})]}),Y.Div({class:"flex flex-wrap items-start justify-between",children:[y({justifyRight:!0,classNames:"pr3",itemClassNames:"mb3",title:"Company",links:[{title:"About us",href:"#about-us"},{title:"Blogs",href:"#blogs"},{title:"Team",href:"#about-us"},{title:"Career",href:"/careers"}]}),JJ({className:"mh4 ph2"}),y({justifyRight:!0,classNames:"pr3",itemClassNames:"mb3",title:"Products",links:[{title:"Maya",href:"/products/maya"},{title:"KarmaJs",href:"/karma"},{title:"Yajman",href:"/yajman"},{title:"Batua",href:"/batua"}]}),JJ({className:"mh4 ph2"}),Y.Div({children:[y({justifyRight:!0,itemClassNames:"mb3",title:"Relations",links:[{title:"Sponsor Us",href:"/sponsor-us"},{title:"FAQs",href:"/faqs"},{title:"Feedback",href:"/feedback"}],bottomComponent:Y.Span({class:"flex items-center justify-end",children:[DJ({url:"https://github.com/cyftec"}),Y.A({class:"ml3",target:"_blank",href:"https://twitter.com/cyftec",children:[Y.Img({class:"ba b--none br-100",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAA/0lEQVR4AbXPIazCMACE4d+L2qoZFEGSIGcRc/gJJB5XMzGJmK9EN0HMi+qaibkKVF1txdQe4g0YzPK5yyWXHL9TaPNQ89LojH87N1rbJcXkMF4Fk31UMrf34hm14KUeoQxGArALHTMuQD2cAWQfJXOpgTbksGr9ng8qluShJTPhyCdx63POg7rEim95ZyR68I1ggQpnCEGwyPicw6hZtPEGmnhkycqOio1zm6XuFtyw5XDXfGvuau0dXHzJp8pfBPuhIXO9ZK5ILUCdSvLYMpc6ASBtl3EaC97I4KaFaOCaBE9Zn5jUsVqR2vcTJZO1DdbGoZryVp94Ka/mQfE7f2T3df0WBhLDAAAAAElFTkSuQmCC",height:"24",width:"24"})]})]})})]})]})]}),mJ="0.1.14",oJ=j(document.location.hash),u=j(document.location.pathname);window.onhashchange=()=>{console.log(`New hash is: ${document.location.hash}`),oJ.value=document.location.hash};window.onpopstate=()=>{console.log(`New pathname is: ${document.location.pathname}`),u.value=document.location.pathname};var dJ=F(()=>{return[{isSelected:u.value.startsWith("/docs"),colorCss:"purple",href:"/docs/",label:"Docs"},{isSelected:u.value.startsWith("/tutorial"),colorCss:"purple",href:"/tutorial/",label:"Tutorial"},{isSelected:!1,colorCss:"purple",target:"_blank",href:"https://www.cyfer.tech/blogs/?tags=maya",label:"Blogs"}]}),rJ=()=>{return i({children:Y.Div({class:"pv3 bg-pale flex items-center justify-between",children:[CJ({logoSize:36,logoSrc:"/assets/images/maya-logo.png",logoHref:"/",labelComponent:Y.A({class:"ml3 link black no-underline",href:"/",children:[Y.Div({class:"f4",children:"MAYA"}),N({classNames:"f7",colorCss:"black",target:"_blank",href:"https://github.com/cyftec/maya-ui",label:mJ})]})}),Y.Div({class:"flex items-center justify-end",children:Y.For({subject:dJ,itemKey:"label",n:1/0,nthChild:Y.Div({class:"flex items-center",children:[Y.Span({class:"db dn-ns",children:hJ({size:32,name:"menu",onClick:()=>{}})}),DJ({size:42,classNames:"ml3",url:"https://github.com/cyftec/maya-ui"})]}),map:(J)=>{let Q=o(J);return N({classNames:"db-ns dn ml3 pv1 ph2",isSelected:Q.isSelected,colorCss:Q.colorCss,target:Q.target,href:Q.href,label:Q.label})}})})]})})},iJ=O(({title:J,app:Q,headElements:Z})=>{return Y.Html({lang:"en",children:[Y.Head([Y.Meta({name:"viewport",content:"width=device-width, initial-scale=1"}),Y.Title(J),Y.Link({rel:"stylesheet",href:"/assets/styles.css"}),Y.Link({rel:"icon",type:"image/x-icon",href:"/assets/favicon.ico"}),...Z||[]]),Y.Body({class:"ph3",children:[Y.Script({src:"main.js",defer:!0}),rJ(),i({children:Q}),sJ]})]})}),aJ=[{title:"Overview",topics:[{title:"Getting familiar",article:_},{title:"Prerequisites",article:_},{title:"Installation",article:_},{title:"App structure",article:_},{title:"Brahma, Karma & Maya",article:_},{title:"Karma config",article:_}]},{title:"Brahma (CLI)",topics:[{title:"Why the CLI?",article:_},{title:"brahma create",article:_},{title:"brahma install",article:_},{title:"brahma add",article:_},{title:"brahma remove",article:_},{title:"brahma publish",article:_}]},{title:"Maya",topics:[{title:"Syntax",article:_},{title:"Overview",article:_},{title:"Element",article:_},{title:"component",article:_},{title:"Props",article:_},{title:"Page",article:_}]},{title:"Signal",topics:[{title:"What is signal?",article:_},{title:"Custom implementation",article:_},{title:"Effect",article:_},{title:"Derived signals",article:_},{title:"Signal for mutating list",article:_}]},{title:"Toolbox",topics:[{title:"Default HTML page",article:_},{title:"Router",article:_},{title:"UI toolkit",article:_}]}],nJ=uJ({htmlTitle:"Docs - Maya",pageTitle:"Docs",headElements:[Y.Link({rel:"stylesheet",href:"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/night-owl.css"}),Y.Script({src:"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"})],chapters:aJ}),tJ=()=>{A.start("mount"),ZJ.resetIdCounter(),nJ(),A.start("run")};tJ();
