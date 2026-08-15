var gB=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","menu","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","search","section","select","slot","small","source","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"],JB=["animate","animateMotion","animateTransform","circle","clipPath","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","svg","symbol","text","textPath","tspan","use","view"],NB={SvgA:"a",SvgScript:"script",SvgStyle:"style",SvgSwitch:"switch",SvgTitle:"title"},FB=["annotation","annotation-xml","maction","math","merror","mfrac","mi","mmultiscripts","mn","mo","mover","mpadded","mphantom","mprescripts","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msubsup","msup","mtable","mtd","mtext","mtr","munder","munderover","semantics"],h,UB=(B)=>{if(!h)h=document.createElement("textarea");return h.innerHTML=B,h.value},CB=(B)=>{try{return decodeURIComponent(B)}catch{return B}},mB=(B)=>{return B.replace(/\\u[\dA-Fa-f]{4}/g,(M)=>String.fromCharCode(parseInt(M.slice(2),16))).replace(/\\x[\dA-Fa-f]{2}/g,(M)=>String.fromCharCode(parseInt(M.slice(2),16)))},hB=()=>{let B=0;return{getNewId:()=>++B,resetIdCounter:()=>B=0}},jB=hB(),S={currentIs:(B)=>window._currentAppPhase===B,start:(B)=>{window._currentAppPhase=B,console.log(`Current phase is ${B}`)}},qB=(B,M,Q)=>{let W=B;W=UB(W),W=CB(W),W=mB(W);let X=W.trim().toLowerCase();for(let Z of M)if(Z.test(X))throw Q;return B},dB=(B)=>qB(B,[/^javascript\s*:/i,/^data\s*:/i,/^vbscript\s*:/i,/^file\s*:/i],'The href attribute value starting with one of "javascript:", "data:", "vbscript:" or "file:" is not allowed.'),cB=(B)=>{if(typeof B!=="string")return!1;if(/[\x00-\x20\s\'"()?:#]/.test(B))return!1;if(/^[\/\\][\/\\]/.test(B))return!1;return/^[a-zA-Z0-9_\-\.\/]+$/.test(B)},sB=(B)=>{let M=qB(B,[/expression\s*\(/i,/javascript\s*:/i,/data\s*:/i,/vbscript\s*:/i,/file\s*:/i],'The style attribute value starting with one of "expression(..", "javascript:", "data:", "vbscript:" or "file:" is not allowed.'),Q=/url\s*\(/i.test(M)&&M.split("url(").pop()?.split(")").shift()?.slice(1,-1);if(Q&&!cB(Q))throw'Only relative import is allowed in "url(..".';return B},oB=(B,M)=>{if(B==="href"){if(typeof M==="boolean")throw"The value of 'href' attribute should not be a boolean";return dB(M||"")}if(B==="style"){if(typeof M==="boolean")throw"The value of 'style' attribute should not be a boolean";return sB(M||"")}return M},c=(()=>{let B=null,M=new Map,Q={addReceiver(W){B=W;try{W.run()}catch(X){throw Q.removeReceiver(W),X}finally{B=null}},removeReceiver(W){M.forEach((X,Z)=>{if(X.delete(W),X.size===0)M.delete(Z)})},ignoreSignalsRegistration(W){let X=B;B=null;try{return W()}finally{B=X}},notifySignalRegistration(W){if(B)if(M.has(W))M.get(W).add(B);else{let X=new Set([B]);M.set(W,X)}},notifySignalUpdate(W){M.get(W)?.forEach((Z)=>{Z.run()})}};return Q})(),a=(B)=>{let M=Object.entries(B).sort((Q,W)=>Q[0].localeCompare(W[0]));return M.forEach(([Q,W],X)=>{if(W&&typeof W==="object"&&!Array.isArray(W))M[X]=[Q,a(W)]}),Object.fromEntries(M)},o=(B)=>{if(typeof B!=="object"||B===null||Array.isArray(B))return!1;return Object.prototype.toString.call(B)==="[object Object]"},T=(B)=>{if(Array.isArray(B)){let Q=[...B],W=[];return Q.forEach((X)=>{W.push(T(X))}),W}if(o(B)){let Q={...B},W={};return Object.keys(Q).forEach((X)=>{W[X]=T(Q[X])}),W}return B},YB=(B,M="index")=>B.map((Q,W)=>({[M]:W,value:Q})),pB=(B,M)=>{let Q=a(B),W=a(M),X=Object.keys(Q),Z=Object.keys(W);if(X.length!==Z.length)return!1;for(let _ of X)if(!Z.includes(_)||!MB(Q[_],W[_]))return!1;return!0},iB=(B,M)=>{if(B.length!==M.length)return!1;if(B.length===0)return!0;for(let Q=0;Q<B.length;Q++)if(!MB(B[Q],M[Q]))return!1;return!0},MB=(B,M)=>{if(typeof B!==typeof M)return!1;if(Array.isArray(B))return iB(B,M);if(B===null||M===null)return B===M;if(typeof B==="object"&&!(B instanceof Set))return pB(B,M);if(typeof B==="bigint"||typeof B==="number"||typeof B==="string"||typeof B==="boolean")return B===M;return B===M},rB=(B,M,Q)=>{let X=YB(T(B),"index");return YB(T(M),"index").map((_)=>{let H="add",F=-1,K=_.value;return X.some((j,v)=>{if(H=MB(j.value,_.value)?j.index===_.index?"idle":"shuffle":Q&&j.value[Q]!==void 0&&j.value[Q]===_.value[Q]?"update":"add",H!=="add")return F=j.index,X.splice(v,1),!0;return!1}),{type:H,oldIndex:F,value:K}})},f=(B)=>["source-signal","derived-signal"].includes(B?.type);function w(B){return f(B)?B.value:B}var G=(...B)=>B.map((M)=>w(M)),nB=(B)=>{let M=(Q)=>B.mutateWith((W)=>{let X=Array.from(W);return Q(X),X});return{concat:(...Q)=>B.mutateWith((W)=>W.concat(...G(...Q))),copyWithin:(...Q)=>M((W)=>W.copyWithin(...G(...Q))),fill:(...Q)=>M((W)=>W.fill(...G(...Q))),filter:(...Q)=>B.mutateWith((W)=>{return W.filter(...G(...Q))}),pop:(...Q)=>M((W)=>W.pop(...G(...Q))),push:(...Q)=>M((W)=>W.push(...G(...Q))),shift:(...Q)=>M((W)=>W.shift(...G(...Q))),toReversed:(...Q)=>M((W)=>W.reverse(...G(...Q))),toSorted:(...Q)=>M((W)=>W.sort(...G(...Q))),toSpliced:(...Q)=>M((W)=>W.splice(...G(...Q))),unshift:(...Q)=>M((W)=>W.unshift(...G(...Q)))}},tB=(B)=>{return{at:(...M)=>$(()=>B.value.at(...G(...M))),concat:(...M)=>$(()=>B.value.concat(...G(...M))),every:(...M)=>$(()=>B.value.every(...G(...M))),entries:()=>$(()=>B.value.entries()),filter:(...M)=>$(()=>B.value.filter(...G(...M))),find:(...M)=>$(()=>B.value.find(...G(...M))),findIndex:(...M)=>$(()=>B.value.findIndex(...G(...M))),findLast:(...M)=>$(()=>B.value.findLast(...G(...M))),findLastIndex:(...M)=>$(()=>B.value.findLastIndex(...G(...M))),flat:(M)=>$(()=>B.value.flat(w(M))),flatMap:(M,Q)=>$(()=>B.value.flatMap(M,w(Q))),forEach:(...M)=>$(()=>{B.value.forEach(...G(...M))}),includes:(...M)=>$(()=>B.value.includes(...G(...M))),indexOf:(...M)=>$(()=>B.value.indexOf(...G(...M))),join:(...M)=>$(()=>B.value.join(...G(...M))),keys:()=>$(()=>B.value.keys()),lastIndexOf:(...M)=>$(()=>B.value.lastIndexOf(...G(...M))),length:()=>$(()=>B.value.length),map:(M,Q)=>$(()=>B.value.map(M,w(Q))),reduce:(M,...Q)=>$(()=>Q.length===0?B.value.reduce(M):B.value.reduce(M,w(Q[0]))),reduceRight:(M,...Q)=>$(()=>Q.length===0?B.value.reduceRight(M):B.value.reduceRight(M,w(Q[0]))),some:(...M)=>$(()=>B.value.some(...G(...M))),slice:(...M)=>$(()=>B.value.slice(...G(...M))),toLocaleString:(...M)=>$(()=>B.value.toLocaleString(...G(...M))),toReversed:(...M)=>$(()=>B.value.toReversed(...G(...M))),toSorted:(...M)=>$(()=>B.value.toSorted(...G(...M))),toSpliced:(...M)=>$(()=>B.value.toSpliced(...G(...M))),values:()=>$(()=>B.value.values()),with:(...M)=>$(()=>B.value.with(...G(...M)))}},lB=(B)=>{return{lastItem:()=>{return $(()=>{return T(B.value).pop()})},partition:(...M)=>{let Q=$(()=>{let[X,Z]=G(...M);return B.value.filter(X,Z)}),W=$(()=>{let[X,Z]=G(...M);return B.value.filter((_,H,F)=>!X.call(Z,_,H,F))});return[Q,W]}}},DB=(B)=>({...tB(B),...lB(B)}),aB=(B)=>({mutate:{...nB(B)},...DB(B)}),eB=(B)=>({toggle:()=>B.mutateWith((M)=>!M)}),BM=(B)=>({mutate:{...eB(B)}}),MM=(B)=>{return{toExponential:(...M)=>$(()=>B.value.toExponential(...G(...M))),toFixed:(...M)=>$(()=>B.value.toFixed(...G(...M))),toPrecision:(...M)=>$(()=>B.value.toPrecision(...G(...M))),toLocaleString:(M,Q)=>$(()=>B.value.toLocaleString(w(M),w(Q)))}},QM=(B)=>{return{toConfined:(M,Q)=>$(()=>{let W=w(M),X=w(Q);return B.value<W?W:B.value>X?X:B.value})}},LB=(B)=>({...MM(B),...QM(B)}),WM=(B)=>({set:(M)=>B.mutateWith((Q)=>({...Q,...M}))}),KB=(B)=>{return{keys:()=>$(()=>Object.keys(B.value)),get:(M)=>$(()=>B.value[M]),props:()=>{let M={};return Object.keys(B.value).forEach((Q)=>{M[Q]=$(()=>B.value[Q])}),M}}},XM=(B)=>({mutate:{...WM(B)},...KB(B)}),RB=(B)=>B.trim().replace(/\s+/g," "),YM=(B)=>{return{concat:function(...M){B.mutateWith((Q)=>Q.concat(...G(...M)))},deepTrim:function(){B.mutateWith((M)=>RB(M))},padEnd:function(...M){B.mutateWith((Q)=>Q.padEnd(...G(...M)))},padStart:function(...M){B.mutateWith((Q)=>Q.padStart(...G(...M)))},repeat:function(...M){B.mutateWith((Q)=>Q.repeat(...G(...M)))},replace:function(...M){B.mutateWith((Q)=>{let[W,X]=G(...M);return Q.replace(W,X)})},replaceAll:function(...M){B.mutateWith((Q)=>{let[W,X]=G(...M);return Q.replaceAll(W,X)})},slice:function(...M){B.mutateWith((Q)=>Q.slice(...G(...M)))},substring:function(...M){B.mutateWith((Q)=>Q.substring(...G(...M)))},trim:function(...M){B.mutateWith((Q)=>Q.trim(...G(...M)))},trimEnd:function(...M){B.mutateWith((Q)=>Q.trimEnd(...G(...M)))},trimStart:function(...M){B.mutateWith((Q)=>Q.trimStart(...G(...M)))},toLocaleLowerCase:function(...M){B.mutateWith((Q)=>Q.toLocaleLowerCase(...G(...M)))},toLocaleUpperCase:function(...M){B.mutateWith((Q)=>Q.toLocaleUpperCase(...G(...M)))},toLowerCase:function(...M){B.mutateWith((Q)=>Q.toLowerCase(...G(...M)))},toUpperCase:function(...M){B.mutateWith((Q)=>Q.toUpperCase(...G(...M)))}}},ZM=(B)=>{return{at:(...M)=>$(()=>B.value.at(...G(...M))),charAt:(...M)=>$(()=>B.value.charAt(...G(...M))),charCodeAt:(...M)=>$(()=>B.value.charCodeAt(...G(...M))),codePointAt:(...M)=>$(()=>B.value.codePointAt(...G(...M))),concat:(...M)=>$(()=>B.value.concat(...G(...M))),endsWith:(...M)=>$(()=>B.value.endsWith(...G(...M))),includes:(...M)=>$(()=>B.value.includes(...G(...M))),indexOf:(...M)=>$(()=>B.value.indexOf(...G(...M))),lastIndexOf:(...M)=>$(()=>B.value.lastIndexOf(...G(...M))),padEnd:(...M)=>$(()=>B.value.padEnd(...G(...M))),padStart:(...M)=>$(()=>B.value.padStart(...G(...M))),repeat:(...M)=>$(()=>B.value.repeat(...G(...M))),slice:(...M)=>$(()=>B.value.slice(...G(...M))),startsWith:(...M)=>$(()=>B.value.startsWith(...G(...M))),substring:(...M)=>$(()=>B.value.substring(...G(...M))),trim:(...M)=>$(()=>B.value.trim(...G(...M))),trimEnd:(...M)=>$(()=>B.value.trimEnd(...G(...M))),trimStart:(...M)=>$(()=>B.value.trimStart(...G(...M))),length:()=>$(()=>B.value.length),localeCompare:(...M)=>$(()=>B.value.localeCompare(...G(...M))),normalize:(...M)=>$(()=>B.value.normalize(w(...G(...M)))),replace:(...M)=>$(()=>{let[Q,W]=G(...M);return B.value.replace(Q,W)}),replaceAll:(...M)=>$(()=>{let[Q,W]=G(...M);return B.value.replaceAll(Q,W)}),search:(...M)=>$(()=>B.value.search(...G(...M))),split:(...M)=>$(()=>{let[Q,W]=G(...M);return B.value.split(Q,W)}),toLocaleLowerCase:(...M)=>$(()=>B.value.toLocaleLowerCase(...G(...M))),toLocaleUpperCase:(...M)=>$(()=>B.value.toLocaleUpperCase(...G(...M))),toLowerCase:(...M)=>{return $(()=>B.value.toLowerCase(...G(...M)))},toUpperCase:(...M)=>{return $(()=>B.value.toUpperCase(...G(...M)))}}},_M=(B)=>{return{deepTrim:()=>{return $(()=>RB(B.value))}}},zB=(B)=>({...ZM(B),..._M(B)}),$M=(B)=>({mutate:{...YM(B)},...zB(B)}),wM=(B,M)=>{let Q=M===void 0?B.nonReactiveValue:M;if(Array.isArray(Q))return DB(B);if(o(Q))return KB(B);if(typeof Q==="string")return zB(B);if(typeof Q==="number")return LB(B);return{}},GM=(B,M)=>{let Q=M===void 0?B.nonReactiveValue:M;if(Array.isArray(Q))return aB(B);if(o(Q))return XM(B);if(typeof Q==="string")return $M(B);if(typeof Q==="number")return LB(B);if(typeof Q==="boolean")return BM(B);return{}},HM=(B)=>{return{then:(M,Q)=>{return $(()=>{let W=w(M),X=w(Q);return B()?W:X})}}},e=(B,M)=>{let Q=(W)=>M?HM(W):$(W);return{truthy:()=>Q(()=>!!B()),falsy:()=>Q(()=>!B()),equalTo:(W)=>Q(()=>B()===w(W)),notEqualTo:(W)=>Q(()=>B()!==w(W)),greaterThan:(W)=>Q(()=>B()>w(W)),greaterThanOrEqualTo:(W)=>Q(()=>B()>=w(W)),smallerThan:(W)=>Q(()=>B()<w(W)),smallerThanOrEqualTo:(W)=>Q(()=>B()<=w(W))}},ZB=(B,M)=>{return{length:e(B,M)}},AB=(B)=>{let M=()=>w(B),Q=()=>{let W=w(B);if(typeof W==="string"||Array.isArray(W))return W.length;return NaN};return{is:{...e(M,!1),...ZB(Q,!1)},if:{...e(M,!0),...ZB(Q,!0)},or:(W)=>{return $(()=>{let X=w(W);return w(B)||X})},toString:()=>{return $(()=>{let W=w(B);if(W===null)return"null";if(W===void 0)return"undefined";if(o(W))return JSON.stringify(W);return W.toString()})}}},vB=(()=>{let B=0;return{get newID(){return++B}}})(),C=(B)=>{let M=vB.newID,Q={get id(){return M},run(){B()},dispose(){c.removeReceiver(Q)}};return c.addReceiver(Q),Q},x=(B,M)=>{let Q=vB.newID,W=void 0,X=T(B),Z={get type(){return"source-signal"},get id(){return Q},get prevValue(){return W},get nonReactiveValue(){return X},get value(){return c.notifySignalRegistration(Z),T(X)},set value(_){if(_===X){console.warn(`Unncessary assignment to sourceSignal with ID - ${Q}`);return}W=X,X=_,c.notifySignalUpdate(Z)},mutateWith(_){let H=_(X);this.value=H}};return Object.assign(Z,AB(Z)),Object.assign(Z,GM(Z,M)),Z},$=(B,M)=>{let Q=x(void 0),W=C(()=>{Q.value=B(Q.nonReactiveValue)}),X={get type(){return"derived-signal"},get prevValue(){return Q.prevValue},get nonReactiveValue(){return Q.nonReactiveValue},get value(){return Q.value},dispose(){W.dispose()}};return Object.assign(X,AB(X)),Object.assign(X,wM(X,M)),X},D=(B)=>{let M=typeof B==="function"?B:()=>w(B);return{...{get result(){return $(()=>M())},get truthy(){return $(()=>!!M())},get falsy(){return $(()=>!M())},get truthyFalsyPair(){return $(()=>{let W=!!M();return[W,!W]})},then:(W,X)=>$(()=>{return M()?w(W):w(X)})},or:(W)=>D(()=>{return M()||w(W)}),orNot:(W)=>D(()=>{return M()||!w(W)}),and:(W)=>D(()=>{return M()&&w(W)}),andNot:(W)=>D(()=>{return M()&&!w(W)}),equals:(W)=>D(()=>{return M()===w(W)}),notEquals:(W)=>D(()=>{return M()!==w(W)}),orBothEqual:(W,X)=>D(()=>{let Z=M(),_=w(W)===w(X);return Z||_}),orBothUnequal:(W,X)=>D(()=>{let Z=M(),_=w(W)!==w(X);return Z||_}),andBothEqual:(W,X)=>D(()=>{let Z=M(),_=w(W)===w(X);return Z&&_}),andBothUnequal:(W,X)=>D(()=>{let Z=M(),_=w(W)!==w(X);return Z&&_}),orThisIsLT:(W,X)=>D(()=>{let Z=M(),_=w(W)<w(X);return Z||_}),orThisIsLTE:(W,X)=>D(()=>{let Z=M(),_=w(W)<=w(X);return Z||_}),orThisIsGT:(W,X)=>D(()=>{let Z=M(),_=w(W)>w(X);return Z||_}),orThisIsGTE:(W,X)=>D(()=>{let Z=M(),_=w(W)>=w(X);return Z||_}),andThisIsLT:(W,X)=>D(()=>{let Z=M(),_=w(W)<w(X);return Z&&_}),andThisIsLTE:(W,X)=>D(()=>{let Z=M(),_=w(W)<=w(X);return Z&&_}),andThisIsGT:(W,X)=>D(()=>{let Z=M(),_=w(W)>w(X);return Z&&_}),andThisIsGTE:(W,X)=>D(()=>{let Z=M(),_=w(W)>=w(X);return Z&&_})}},I=(B)=>{let M=typeof B==="function"?B:()=>w(B);return{...D(B),get result(){return $(M)},add:(Q)=>I(()=>{return M()+w(Q)}),sub:(Q)=>I(()=>{return M()-w(Q)}),mul:(Q)=>I(()=>{return M()*w(Q)}),div:(Q)=>I(()=>{return M()/w(Q)}),mod:(Q)=>I(()=>{return M()%w(Q)}),pow:(Q)=>I(()=>{return M()**w(Q)}),isBetween:(Q,W,X=!0,Z=!0)=>D(()=>{let _=M(),H=w(Q),F=w(W),K=X?_>=H:_>H,j=Z?_<=F:_<F;return K&&j}),isLT:(Q)=>D(()=>M()<w(Q)),isLTE:(Q)=>D(()=>M()<=w(Q)),isGT:(Q)=>D(()=>M()>w(Q)),isGTE:(Q)=>D(()=>M()>=w(Q))}},JM=(B)=>{let M=typeof B==="function"?B:()=>w(B);return{...D(B),lengthBetween:(Q,W,X=!0,Z=!0)=>D(()=>{let H=M().length,F=w(Q),K=w(W),j=X?H>=F:H>F,v=Z?H<=K:H<K;return j&&v}),lengthEquals:(Q)=>D(()=>{return M().length===w(Q)}),lengthNotEquals:(Q)=>D(()=>{return M().length!==w(Q)}),lengthLT:(Q)=>D(()=>{return M().length<w(Q)}),lengthLTE:(Q)=>D(()=>{return M().length<=w(Q)}),lengthGT:(Q)=>D(()=>{return M().length>w(Q)}),lengthGTE:(Q)=>D(()=>{return M().length>=w(Q)})}},r=(B)=>{let Q=(typeof B==="function"?B:()=>w(B))();return typeof Q==="number"?I(B):typeof Q==="string"||Array.isArray(Q)?JM(B):D(B)},A=(B,...M)=>$(()=>{return B.reduce((Q,W,X)=>{let Z,_=M[X];if(typeof _==="function")Z=_()??"";else if(f(_))Z=_.value??"";else Z=_??"";return`${Q}${W}${Z.toString()}`},"")}),QB=(B)=>Array.isArray(B),s=(B)=>!isNaN(B?.nodeID)&&B?.nodeID>0,FM=(B)=>typeof B==="function"&&B.isMayaNodeGetter===!0,g=(B)=>B===void 0||typeof B==="string"||FM(B),UM=(B)=>QB(B)&&B.every((M)=>g(M)),jM=(B)=>!f(B)&&(g(B)||UM(B)),BB=(B)=>f(B)&&g(B.value),EB=(B)=>QB(B)&&B.every((M)=>g(M)||BB(M)),qM=(B)=>!f(B)&&(g(B)||EB(B)),PB=(B)=>f(B)&&jM(B.value),VB=(B)=>qM(B)||PB(B),_B=!1,DM={},N={},LM=globalThis.MutationObserver,KM=new LM((B)=>{B.forEach((M)=>{if(M.type==="childList")M.addedNodes.forEach((Q)=>{if(s(Q)){let W=Q,X=W.nodeID;if(N[X])delete N[X];else DM[X]=W.tagName}}),M.removedNodes.forEach((Q)=>{if(s(Q)){let W=Q,X=W.nodeID,Z=W.unmountListener;if(Z)N[X]={mayaNode:W,unmountListener:Z}}})}),Object.entries(N).forEach(([M,Q])=>{let{mayaNode:W,unmountListener:X}=Q;fB(W,X)})}),fB=(B,M)=>{if(!s(B))return;let Q=B.children;for(let W=0;W<Q.length;W++){let X=Q[W];fB(X,X.unmountListener)}if(M&&M(B),N[B.nodeID])delete N[B.nodeID]},RM=()=>{if(!_B&&!S.currentIs("build"))KM.observe(document.body,{childList:!0,subtree:!0}),_B=!0},$B=(B,M,Q)=>{let W=x(M),X=x(B),Z=Q($(()=>X.value),$(()=>W.value)),_,H,F=!1;if(Z?.isMayaNodeGetter)_=()=>{if(F&&H)return H;return H=Z(),F=!0,H},_.isMayaNodeGetter=!0;else if(!Z||typeof Z==="string")_=Z||"";else throw`One of the child, ${Z} passed in ForElement is invalid.`;return{indexSignal:W,itemSignal:X,mappedChild:_}},wB=(B,M,Q)=>{if(M!==void 0&&M>=0&&Q){let W=M>B.length?B.length:M;B.splice(W,0,Q)}return B},zM=({subject:B,itemKey:M,map:Q,n:W,nthChild:X})=>{if(X&&W===void 0||W!==void 0&&W>-1&&!X)throw Error("Either both 'n' and 'nthChild' be passed or none of them.");let Z=X;if(X&&typeof X!=="string"){let j=X(),v=()=>j;v.isMayaNodeGetter=!0,Z=v}if(!M){let j=()=>wB(w(B).map(Q),W,Z);return f(B)?$(j):j()}let _=w(B);if(_.length&&typeof _[0]!=="object")throw Error("for mutable map, item in the list must be an object");let H=$(()=>{let j=w(B);if(!Array.isArray(j))throw`subject must be an array or signalled array, found ${JSON.stringify(B)}`;return j}),F=$((j)=>{if(!(j||[]).length||!(H.prevValue||[]).length)return H.value.map((z,R)=>$B(z,R,Q));return rB(H.prevValue||[],H.value,M).map((q,z)=>{let R=(j||[])[q.oldIndex];if(console.assert(q.type==="add"&&q.oldIndex===-1&&!R||q.oldIndex>-1&&!!R,"In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer."),R){if(q.type==="shuffle")R.indexSignal.value=z;if(q.type==="update")R.indexSignal.value=z,R.itemSignal.value={...q.value};return R}return $B(q.value,z,Q)})});return $(()=>wB(F.value.map((j)=>j.mappedChild),W,Z))};function AM({subject:B,isTruthy:M,isFalsy:Q}){let W=Y.Span({style:"display: none;"}),X=(Z)=>{if(w(B)){if(!M)return W;let F=M(B);return Z?w(F):F}if(!Q)return W;let H=Q(B);return Z?w(H):H};return f(B)?$(()=>X(!0)):X(!1)}var vM=({subject:B,caseMatcher:M,defaultCase:Q,cases:W})=>{let X=Y.Span({style:"display: none;"}),Z=Q&&Q(),_=(H)=>{let F=w(B),K=w(W),j=void 0;for(let[v,u]of Object.entries(K||{})){let q=M&&M(F,v),z=`${F}`===v;if(q||z){j=H?w(u()):u();break}}return j||Z||X};return f(B)?$(()=>_(!0)):_(!1)},d="http://www.w3.org/2000/svg",EM="http://www.w3.org/1998/Math/MathML",PM=(B,M)=>{if(M===d)return document.createElementNS(d,B);if(FB.includes(B))return document.createElementNS(EM,B);if(JB.includes(B))return document.createElementNS(d,B);return document.createElement(B)},bB=(B)=>B.startsWith("on"),OB=(B)=>B==="onmount"||B==="onunmount",SB=(B,M)=>bB(B)&&M===void 0,uB=(B,M)=>bB(B)&&!OB(B)&&typeof M==="function",yB=(B,M)=>OB(B)&&typeof M==="function",VM=(B,M)=>SB(B,M)||uB(B,M)||yB(B,M),fM=(B,M)=>{Object.entries(M).forEach(([Q,W])=>{if(SB(Q,W));else if(uB(Q,W)){let X=Q.slice(2);B.addEventListener(X,(Z)=>{if(X==="keypress")Z.preventDefault();W(Z)})}else if(yB(Q,W)){if(Q==="onmount"&&!S.currentIs("build")){let X=W;setTimeout(()=>X(B),0)}if(Q==="onunmount"){RM();let X=B.unmountListener;B.unmountListener=(Z)=>{if(W(Z),typeof X==="function")X(Z)}}}else console.error(`Invalid event key: ${Q} for element with tagName: ${B.tagName}`)})},GB=(B,M,Q)=>{let W=f(Q)?Q.value:Q,X=oB(M,W);if(typeof X==="boolean")if(X)B.setAttribute(M,"");else B.removeAttribute(M);else if(M==="value")B.value=X||"";else B.setAttribute(M,X||"")},bM=(B,M)=>{let Q={};Object.entries(M).forEach((X)=>{let[Z,_]=X;if(f(_))Q[Z]=_;GB(B,Z,_)});let W=C(()=>{Object.entries(Q).forEach((X)=>{let[Z,_]=X,H=_.value;if(!S.currentIs("run"))return;GB(B,Z,H)})});B.effects.push(W)},OM=(B)=>{if(!B||typeof B==="string")return document.createTextNode(UB(B||""));if(g(B)){let M=B();if(!s(M))throw Error(`Invalid maya-node-getter child. Type: ${typeof B}`);return M}throw Error(`Invalid child. Type of child: ${typeof B}`)},n=(B,M,Q)=>{let W=B.childNodes[Q],X=OM(M);if(W&&X)B.replaceChild(X,W);else if(X)B.appendChild(X);else console.error(`No child found for node with tagName: ${B.tagName}`)},SM=(B,M)=>{if(!M)return;if(PB(M)){let Z=C(()=>{let _=M.value,H=QB(_)?_:[_];H.forEach((K,j)=>n(B,K,j));let F=H.length;while(F<B.childNodes.length){let K=B.childNodes[F];if(K)B.removeChild(K)}});B.effects.push(Z)}let Q=M,W=g(Q)?[Q]:EB(Q)?Q.map((Z)=>BB(Z)?Z:Z):[],X=[];if(W.forEach((Z,_)=>{if(BB(Z))X.push({index:_,childSignal:Z});let H=w(Z);n(B,H,_)}),X.length)X.forEach(({index:Z,childSignal:_})=>{let H=C(()=>{let F=_.value;if(!S.currentIs("run"))return;n(B,F,Z)});B.effects.push(H)})},uM=(B,M)=>{let Q=void 0,W={},X={};return Object.entries(B).forEach(([Z,_])=>{if(Z==="children")if(VB(_))Q=_;else throw Error(`Invalid children prop for node with tagName: ${M}

 ${JSON.stringify(_)}`);else if(VM(Z,_))W[Z]=_;else X[Z]=_}),{children:Q,eventProps:W,attributeProps:X}},kB=(B,M,Q)=>{let W=()=>{let X=jB.getNewId(),Z=S.currentIs("mount")?document.querySelector(`[data-elem-id="${X}"]`):PM(B,Q);Z.nodeID=X,Z.effects=[],Z.unmountListener=()=>{Z.effects.forEach((F)=>F.dispose())};let _=VB(M)?{children:M}:M;if(!S.currentIs("run"))_["data-elem-id"]=Z.nodeID.toString();let H=uM(_,Z.tagName);if(fM(Z,H.eventProps),bM(Z,H.attributeProps),SM(Z,H.children),!S.currentIs("build"))Z.removeAttribute("data-elem-id");return Z};return W.isMayaNodeGetter=!0,W},yM=(B)=>(M)=>kB(B,M),kM=(B)=>(M)=>kB(B,M,d),IM=[...gB,...JB,...FB].reduce((B,M)=>{let Q=yM(M),W=M.split("-").map((X)=>X.charAt(0).toUpperCase()+X.slice(1)).join("");return B[W]=Q,B},{}),TM=Object.entries(NB).reduce((B,[M,Q])=>{return B[M]=kM(Q),B},{}),xM={For:zM,If:AM,Switch:vM},Y={...IM,...TM,...xM},gM=(B)=>{let M=w(B);if(!Array.isArray(M))return!1;return M.some((Q)=>f(Q))},IB=(B)=>{return(Q={})=>{let W={};for(let X of Object.keys(Q))if(Q[X]===void 0)delete Q[X];return Object.entries(Q).forEach((X)=>{let[Z,_]=X,H=typeof _==="function"?_:gM(_)?w(_):f(_)?_:$(()=>w(_));W[Z]=H}),B(W)}},b=(B)=>IB(B),IQ=b(({logoSrc:B,logoHref:M,logoSize:Q,labelComponent:W})=>{let X=A`${()=>Q?.value||32}`;return Y.A({class:"space-mono link black flex items-center justify-start",href:M,children:[Y.Img({src:B,height:X,width:X}),Y.If({subject:W,isTruthy:()=>W})]})}),TQ=b(({children:B})=>Y.Div({class:"flex items-center",children:B})),NM=b(({classNames:B,labelClassNames:M,href:Q,label:W,onClick:X})=>{let Z=A`flex justify-stretch pointer bg-white hover-bg-light-gray b--gray ba bw1 br-pill ${B}`,_=A`w-100 no-underline bg-transparent dark-gray pv2 ph3 ${M}`;return Y.Button({class:Z,onclick:X,children:Y.A({class:_,...Q?{href:Q}:{},children:W})})}),xQ=b(({className:B})=>Y.Div({class:A`bl b--moon-gray min-vh-20 ${B}`})),gQ=b(({classNames:B,url:M,size:Q})=>Y.A({class:B,target:"_blank",href:M||"https://github.com",children:[Y.Img({class:"ba b--none br-100",src:"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",height:A`${()=>Q?.value||32}`,width:A`${()=>Q?.value||32}`})]})),CM=b(({classNames:B,hoverTitle:M,name:Q,size:W,onClick:X})=>{return Y.Span({class:A`material-symbols-rounded ${X?"pointer":""} ${B}`,style:A`font-size: ${W?.value??24}px; line-height: ${W?.value??24}px;`,title:M,onclick:X,children:Q})}),p=b(({classNames:B,colorCss:M,target:Q,isSelected:W,href:X,onClick:Z,label:_})=>{let H=r(M).then(`${M?.value}`,"dark-gray"),F=A`bg-${H}`,K=r(W).then("white",H),j=r(W).then(F,"transparent"),v=X||Z?"pointer":"";return Y.A({class:A`link underline ${v} ${K} ${j} ${B}`,target:Q,onclick:Z,children:_,...X?{href:X}:{}})}),mM=b(({classNames:B,children:M})=>{return Y.Div({class:A`dn db-ns fg3 pb3 pr2 max-h-80 overflow-y-scroll ${B}`,style:`
      scrollbar-color: #e8e8e8 #f2f1f0;
      scrollbar-width: thin;
    `,children:M})}),HB=b(({classNames:B,linkColorCss:M,text:Q})=>{return Y.Span({class:B,children:Y.If({subject:Q.includes("##"),isFalsy:()=>Q,isTruthy:()=>Y.For({subject:Q.split("##"),map:(W,X)=>{let[Z="",_=""]=W.split("|");return Y.If({subject:X%2===0,isTruthy:()=>W,isFalsy:()=>p({colorCss:M||"theme-col",target:"_blank",label:Z,href:_})})}})})})}),hM=b(({classNames:B,titleClassNames:M,itemClassNames:Q,title:W,justifyRight:X,links:Z,onLinkClick:_,linkColorCss:H,bottomComponent:F})=>{return Y.Div({class:A`${()=>X?.value?"tr":""} ${B}`,children:[Y.P({class:A`space-mono mt0 f3 lh-solid ${M}`,children:W}),Y.Div(Y.For({subject:Z,itemKey:"title",map:(K,j)=>{let{title:v,href:u,isSelected:q}=K.props();return Y.Div({class:Q,children:[p({classNames:"ph2",colorCss:H,label:v,onClick:()=>_&&_(j.value),href:u,isSelected:q})]})}})),Y.If({subject:F,isTruthy:()=>F})]})}),WB=b(({classNames:B,contentClassNames:M,children:Q})=>{return Y.Div({class:A`w-100 bg-pale ${B}`,children:[Y.Div({class:A`mw8 center ${M}`,children:Q})]})}),dM=IB(({headerClassNames:B,headerTitle:M,headerComponent:Q,navbarClassNames:W,navbarComponent:X,contentClassNames:Z,contentTitle:_,contentComponent:H,scrollToTopCounterSignal:F})=>{let K;return C(()=>{if(F?.value)K.scrollTo({top:0})}),[Y.Div({class:A`mt3 mb5 flex-ns flex-wrap items-end ${B}`,children:[Y.H1({class:"mr3 mv2 mv1-ns",children:M}),Y.If({subject:Q,isTruthy:()=>Q})]}),Y.Div({class:"flex w-100 w-auto-ns",children:[mM({classNames:W,children:X}),Y.Div({onmount:(j)=>K=j,class:A`fg7 pb5 w-70-ns mw-100 w-auto-ns max-h-80 overflow-y-scroll
              dark-gray gray-ns lh-copy-ns lh-title ${Z}`,children:[Y.H2({class:"mt0 lh-solid black mid-gray-ns",children:_}),Y.Div({class:"",children:H})]})]})]}),TB="0.2.2",t=(B,M)=>Y.Div({class:"footer-group",children:[Y.Strong(B),...M.map((Q)=>Y.A({href:Q.href,...Q.href.startsWith("http")?{target:"_blank",rel:"noreferrer"}:{},children:[Q.label,Q.href.startsWith("http")?" ↗":""]}))]}),cM=WB({classNames:"site-footer-frame",contentClassNames:"site-footer-shell",children:Y.Footer({class:"site-footer",children:[Y.Div({class:"footer-brand",children:[Y.A({class:"footer-logo",href:"/",children:[Y.Img({src:"/assets/images/maya-logo.svg",height:"38",width:"38",alt:""}),Y.Span({children:[Y.Strong("MAYA"),Y.Small(`UI framework ${TB}`)]})]}),Y.P("A TypeScript-native, MPA-first UI framework by Cyfer. Built close to the browser platform.")]}),Y.Div({class:"footer-links",children:[t("Learn",[{label:"Documentation",href:"/docs/"},{label:"Tutorial",href:"/tutorial/"},{label:"Benchmark",href:"https://benchmark.maya.cyfer.tech/"}]),t("Ecosystem",[{label:"Signal",href:"https://signal.cyfer.tech"},{label:"Maya on npm",href:"https://www.npmjs.com/package/@cyftec/maya"},{label:"Brahma on npm",href:"https://www.npmjs.com/package/@cyftec/brahma"}]),t("Connect",[{label:"GitHub",href:"https://github.com/cyftec/maya-ui"},{label:"Cyfer",href:"https://www.cyfer.tech"},{label:"Maya blogs",href:"https://www.cyfer.tech/blogs?tags=maya"}])]}),Y.Div({class:"footer-bottom",children:[Y.Span("© 2026 Cyfer Tech. All rights reserved."),Y.Span("This site is built with Maya.")]})]})}),sM=[{href:"/#architecture",label:"Architecture"},{href:"/#signals",label:"Signals"},{href:"/#toolchain",label:"Brahma"},{href:"/#benchmark",label:"Benchmark"},{href:"/docs/",label:"Docs"},{href:"/tutorial/",label:"Tutorial"}],oM=()=>WB({classNames:"site-header-frame",contentClassNames:"site-header-shell",children:Y.Header({class:"site-header",children:[Y.A({class:"site-brand",href:"/","aria-label":"Maya home",children:[Y.Img({src:"/assets/images/maya-logo.svg",height:"34",width:"34",alt:""}),Y.Span({children:[Y.Strong("MAYA"),Y.Small(TB)]})]}),Y.Nav({class:"site-nav","aria-label":"Primary navigation",children:sM.map((B)=>Y.A({href:B.href,children:B.label}))}),Y.A({class:"header-github",href:"https://github.com/cyftec/maya-ui",target:"_blank",rel:"noreferrer",children:[Y.Span("GitHub"),Y.Span({"aria-hidden":"true",children:"↗"})]})]})}),pM=b(({title:B,headElements:M,app:Q})=>{let W=w(M||[]);return Y.Html({lang:"en",children:[Y.Head([Y.Meta({charset:"UTF-8"}),Y.Meta({name:"viewport",content:"width=device-width, initial-scale=1"}),Y.Title(B),Y.Link({rel:"stylesheet",href:"/assets/styles.css"}),Y.Link({rel:"icon",type:"image/x-icon",href:"/assets/images/maya-favicon.ico"}),...W]),Y.Body({class:"site-body ph3",children:[Y.Script({src:"main.js",defer:!0}),oM(),WB({children:Q}),cM]})]})}),iM=b(({htmlTitle:B,pageTitle:M,headElements:Q,chapters:W})=>{let X=x([0,0]),Z=x(0),_=([q,z])=>{let R=W.value[q],O=R?.topics[z];if(!R||!O)throw Error(`No topic exists at chapter ${q}, topic ${z}.`);return{chapter:R,topic:O}},H=$(()=>{return _(X.value).topic}),{title:F,article:K}=H.props(),j=$(()=>{let{chapter:q,topic:z}=_(X.value);return[q.title,z.title]}),v=$(()=>{let[q,z]=X.value,R=q,O=z-1;if(!W.value[R]?.topics[O])R=q-1,O=(W.value[R]?.topics.length??0)-1;let y=q,k=z+1;if(!W.value[y]?.topics[k])y=q+1,k=0;return{previous:[R,O],next:[y,k]}}),u=$(()=>{let{previous:q,next:z}=v.value;return[[!1,q],[!0,z]].flatMap(([O,y])=>{let[k,m]=y,i=W.value[k],XB=i?.topics[m];return i&&XB?[{isNext:O,pathIndices:y,chapterTitle:i.title,title:XB.title}]:[]})});return pM({title:B,headElements:Q,app:dM({headerTitle:M,headerComponent:Y.Div({class:"flex flex-wrap items-end f7 b silver light-silver-ns",children:Y.For({subject:j,map:(q)=>Y.Div({class:"mb2 mb0-ns",children:[Y.Span({class:"mh1 mh2-ns",children:"/"}),Y.Span({class:"pa1 ph2-ns mh1 br3 pointer",children:q})]})})}),navbarComponent:Y.For({subject:W,map:({title:q,topics:z},R)=>hM({classNames:"mb0 mb4-ns pb3",titleClassNames:"f4",itemClassNames:"mb3 f6 lh-title",linkColorCss:"theme-col",title:`${R+1}. ${q}`,onLinkClick:(O)=>X.value=[R,O],links:$(()=>z.map((O,y)=>{let[k,m]=X.value;return{title:O.title,isSelected:k===R&&m===y}}))}),n:1/0,nthChild:Y.P({class:"gray f6",children:"** end of list **"})}),contentTitle:F,scrollToTopCounterSignal:Z,contentComponent:[K,Y.Div({class:"flex-ns justify-stretch mv4 w-100",children:Y.For({subject:u,n:1,nthChild:Y.Div({class:$(()=>u.value.length>1?"mh3":"")}),map:(q)=>NM({classNames:"w-100 mt3",onClick:()=>{X.value=q.pathIndices,Z.value++},label:Y.Div({class:"tc",children:[q.isNext?"Next Topic &rarr;":"&larr; Previous Topic",Y.Div({class:"f7 mt1",children:[Y.Span({class:"silver",children:q.chapterTitle+": "}),Y.Span({class:"black",children:q.title})]})]})})})})]})})}),NQ=Y.Div({children:Y.For({subject:[`Currently, active development is happening on this framework. And a stable version has not
      been released yet. This framework should not and cannot be used for production apps. However, for the demonstration
      purpose a few small apps has been or will be released.`,`The purpose of this tutorial is to only share the working and usage details of the
      Maya Web Framework. So that, if one is interested in exploring new technological developments,
      they get to know yet another approach to solving current problems/limitations in the web development field.`],map:(B)=>Y.P(B)})}),rM=`
  It's great! That you are interested in learning more about Maya. Let's make sure that we
  are ready with below prerequisites. That, you have,
`,nM=["Good knowledge of HTML, CSS and JavaScript.","Basic knowledge of TypeScript.","Basic knowledge of using a Terminal in your machine and executing shell commands using it.",`MacOS or Linux (as preferred) operating system on your machine. However if you are working with
  Windows, you can use WSL on Windows for current purpose.`,"Terminal emulator of your choice on your machine."],tM=Y.Div([Y.P({class:"mt0",children:rM}),Y.Ul({children:Y.For({subject:nM,map:(B)=>Y.Li({class:"mb2",children:Y.If({subject:B.includes("##"),isFalsy:()=>B,isTruthy:()=>Y.Span(Y.For({subject:B.split("##"),map:(M,Q)=>{let[W="",X=""]=M.split("|");return Y.If({subject:Q%2===0,isTruthy:()=>M,isFalsy:()=>p({colorCss:"theme-col",target:"_blank",label:W,href:X})})}}))})})})})]),xB=()=>{let M=document.getElementById("hightlight-js-script");if(M)M.parentElement?.removeChild(M);document.body.appendChild(Y.Script({id:"hightlight-js-script",defer:!0,children:"hljs.highlightAll();"})())},l={FIRST_THINGS:"First things first",GETTING_FAMILIAR:"Getting familar with Maya's templating syntax",SYNTAX_RULES:"Basic syntax rules"},lM=[`Before jumping straight into complete tutorial, let's just ponder upon a few things first.
  Currently, there are a handful of popular web frameworks and libraries out there, with their fair shares
  of usage in the market. And each of them have a peculiar templating syntax. Many devs do feel that
  the syntax of one of the libraries is more intuitive compared to that of the others. Taking that
  into consideration, it's only fair that you delve into Maya's syntax first.`,`Just have a look into both HTML and Maya syntaxes. Hopefully, just by seeing and comparing them you
  would intuitively find a mapping pattern (from HTML to Maya).`],aM={HTML:{title:"HTML",code:`<div
  id="container"
  class="center pa3"
>
  <h3>My Blog Title</h3>
  <p class="bg-yellow">
    Highlighted Paragraph.
  </p>
  <p>Normal Paragraph.</p>
  <ul>
    Some list items
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  <ul>
</div>
`},MAYA:{title:"Maya",code:`import { css } from "./assets/styles.ts";

m.Div({
  id: "container",
  class: css("center pa3"),
  children: [
    m.H3("My Blog Title"),
    m.P({
      class: css("bg-yellow"),
      children: "Highlighted Paragraph.",
    }),
    m.P("Normal Paragraph."),
    m.Ul([
      "Some list items",
      m.Li("Item 1"),
      m.Li("Item 2"),
      m.Li("Item 3"),
    ]),
  ],
})
`}},eM=[`A Maya element is either a string or a (HTML equivalent template) function, for example,
 "some string" or m.Span().`,`The equivalent of HTML element in Maya is depicted as m.<Capitalised-HTML-tag>(). I.e.
 HTML 'div' element in Maya will be represented as 'm.Div()'.`,"The 'm' in 'm.Div' is an object which contains all the Maya elements like 'Div', 'P', 'Input', etc.",`The functional Maya element takes one of these as arguments - a Maya element, anrray of Maya elements or
 an object, which consists of HTML attributes key-value pairs and/or 'children' as its properties.`,`The 'children' property in the object passed in functional Maya Element as argument should have one of these
 values - a Maya Element or an array of Maya Elements.`,`Besides 'children', the other properties in the object passed in functional Maya Element as argument, are
 nothing but HTML attributes. The key-value pairs of these properties should be the normal HTML
 attribute key-value pairs.`,`Maya application classes are passed through the typed NoCSS css helper. This validates each class and
 registers it so Brahma can include the matching rule in the generated stylesheet.`,`One difference here is that the value of an event attribute should
 not be a string, unlike that in HTML but an actual (event listener) function. For example,
 the equivalent of this HTML code - <button onclick="someFn()">click me</button> in Maya will be - 
 m.Button({ onclick: function someFn(){}, children: "click me" }).`],BQ=[`You might still be confused about how to use this syntax. How to create components using this?
     How to use a component in the app? Or, how to create an app or a page in the app using this?
     Don't worry. As that will be covered in later chapters.
     For all other syntax rules, please check `,". The basic rules mentioned above is enough for now for getting started."],MQ=Y.Div({onmount:xB,children:[Y.H3({class:"black mid-gray-ns",children:l.FIRST_THINGS}),...Y.For({subject:lM,map:(B)=>Y.P({class:"mt0 mb3",children:B}),n:1,nthChild:Y.H3({class:"black mid-gray-ns",children:l.GETTING_FAMILIAR})}),Y.Div({class:"flex-ns w-100 w-auto-ns mv4 gray",children:Y.For({subject:Object.values(aM),map:(B,M)=>Y.Div({class:`b--gray br4 overflow-hidden mb3 lh-copy f6 w-100 w-auto-ns  ${M===0?"br--left-ns br-ns":"br--right-ns"}`,children:[Y.Div({class:"pv2 ph3 bg-black white f4",children:B.title}),Y.Pre({class:"ma0 hljs pa2",children:Y.Code(B.code)})]})})}),Y.Br(),Y.H3({class:"mv0 lh-solid black mid-gray-ns",children:l.SYNTAX_RULES}),Y.Ul({class:"mb4",children:Y.For({subject:eM,map:(B)=>Y.Li({class:"mb2",children:B})})}),...Y.For({subject:BQ,n:1,nthChild:p({colorCss:"theme-col",href:"/docs",label:"docs here"}),map:(B)=>B})]}),J=(B)=>{let M=x("content_copy"),Q=x("copy"),W=()=>{M.value="done_all",Q.value="copied",navigator.clipboard.writeText(B||""),setTimeout(()=>{M.value="content_copy",Q.value="copy"},2000)};return Y.Div({class:"mv3 pa3 br4 hljs overflow-auto",children:Y.Pre({class:"ma0 relative",children:[Y.Code(B),CM({classNames:"absolute top-0 right-0 bg-white-30 br-100 pa1",hoverTitle:Q,name:M,onClick:W})]})})},E=(B)=>Y.Div({class:"list bg-white pa3 mv3 bl bw4 br4 b--theme-col",children:B}),L=(...B)=>Y.Div({onmount:xB,children:B.flat()}),V=(B,...M)=>Y.Div({class:"mt5 mb4",children:[Y.H3({class:"black",children:B}),...M]}),U=(...B)=>Y.For({subject:B,map:(M)=>Y.P({class:"mt0 mb3",children:M})}),P=(...B)=>Y.Ul({class:"mb4",children:Y.For({subject:B,map:(M)=>Y.Li({class:"mb2",children:M})})}),QQ=L(Y.H3({class:"black",children:"Syntax is TypeScript"}),U("Maya does not add a template language. You write normal TypeScript and call functions that describe the DOM. The visual mapping is close to HTML, but every node is an expression.","Use a direct child for a short element, or pass an object when you need attributes, events, and children together."),J(`import { css } from "./assets/styles.js";

m.Div("A short child")

m.Div({
  class: css("card"),
  children: [m.H2("A heading"), m.P("A paragraph")],
})`),P("HTML tags become capitalized m factories.","The children property contains a string, element getter, array, or supported signal value.","Events receive functions, not quoted HTML event strings.","Use normal JavaScript and TypeScript wherever it makes the code clearer.")),WQ=L(Y.H3({class:"black",children:"From one element to an app"}),U("A Maya application is assembled from small getters. Elements compose into fragments, fragments become components, and a default page getter gives Brahma an entry point to build.","There is no virtual DOM tree to learn. When the page is mounted, the same getter sequence attaches behavior to the static nodes that were already generated."),J(`import { component } from "@cyftec/maya/core";
import { css } from "./assets/styles.js";

const Card = component(() =>
  m.Article({
    class: css("card"),
    children: [m.H2("Title"), m.P("Content")],
  }),
);

export default m.Html({
  children: [
    m.Head(m.Title("My page")),
    m.Body([m.Script({ src: "main.js", defer: true }), Card()]),
  ],
});`),E("The builder calls the default export during build. A page must be safe to evaluate in JSDOM.")),XQ=L(Y.H3({class:"black",children:"Elements are getters"}),U("Calling m.Div(...) returns an element getter. Calling that getter creates the element during build, or finds its matching static element during mount.","This is why a getter can be passed around as a child and reused by a component without needing a special template compiler."),J(`const title = m.H1("Welcome");
const content = m.Main([
  title,
  m.P({ id: "intro", children: "Read this first." }),
]);

const node = content();`),V("Element props",P("id, href, value, and data-* become attributes; pass application class values through the typed NoCSS css helper.","onclick, oninput, and other supported lower-case event keys register listeners.","onmount and onunmount are lifecycle callbacks for browser-only work and cleanup."))),CQ=L(Y.H3({class:"black",children:"Fragments group children"}),U("A fragment is a function that returns children rather than one wrapper element. Use it when a reusable piece of UI should contribute several siblings to its parent.","Use fragment() for a reusable sibling group and component() for one reusable Maya child. Keep plain functions for work that does not return Maya UI."),J(`import { component, fragment, m } from "@cyftec/maya/core";

const Actions = fragment(() => [
  m.Button({ children: "Save" }),
  m.Button({ children: "Cancel" }),
]);

const Toolbar = component(() =>
  m.Div({ children: [m.Strong("Actions"), Actions()] }),
);`)),YQ=L(Y.H3({class:"black",children:"Components add a typed boundary"}),U("Use component() when reusable Maya UI has named props. Maya preserves compatible reactive values and callback functions so the component can forward data into attributes or children without a rerender loop."),J(`import { component, m } from "@cyftec/maya/core";
import { css } from "./assets/styles.js";

type BadgeProps = {
  label: string;
  tone: "neutral" | "success" | "danger";
};
const Badge = component<BadgeProps>(({ label, tone }) =>
  m.Span({
    class: css.cases(tone, {
      "near-black": "neutral",
      "dark-green": "success",
      "dark-red": "danger",
    }),
    children: label,
  }),
);

Badge({ label: "New", tone: "success" });`),E("A component is your TypeScript function; m.Div and m.Span are the element factories it composes.")),ZQ=L(Y.H3({class:"black",children:"Props describe data and behavior"}),U("Pass attributes directly to an element and named values to a component. Keep callback props as functions so the child can connect them to a DOM event.","For reactive values, pass a signal. Maya's element and attribute logic will track it and update the exact target when the signal changes."),J(`type CounterProps = {
  value: ReturnType<typeof signal<number>>;
  onIncrement: () => void;
};

const Counter = component<CounterProps>(({ value, onIncrement }) =>
  m.Button({ onclick: onIncrement, children: tmpl\`Count: \${value}\` }),
);`),E("A value prop is data. An onSomething prop is behavior. A signal prop is data that may change.")),_Q=L(Y.H3({class:"black",children:"A page is a default export"}),U("Brahma recognizes a file as a page when its filename matches karma.brahma.build.buildablePageFileName. The page module's default export must be the root Maya HTML getter.","Include the generated page script in the body. It mounts the page and starts the run phase in the browser."),J(`import { m } from "@cyftec/maya/core";
import { css } from "./assets/styles.js";

export default m.Html({
  lang: "en",
  children: [
    m.Head([
      m.Title("Home"),
      m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
    ]),
    m.Body([
      m.Script({ src: "main.js", defer: true }),
      m.Main({ class: css("center mw8 pa3"), children: m.H1("Home page") }),
    ]),
  ],
});`)),mQ=L(Y.H3({class:"black",children:"Folders become routes"}),U("Brahma uses the view folder structure as the URL structure. Put page.ts inside a folder for an index page, and use a dotted page filename for a single named HTML file."),J(`dev/view/pages/page.ts             -> /index.html
dev/view/pages/docs/page.ts        -> /docs/index.html
dev/view/pages/docs/signals/page.ts -> /docs/signals/index.html
dev/view/pages/contact.page.ts     -> /contact.html`),P("Relative imports follow the source folder structure.","Relative links should point to the built route.","The generated script name follows the page route.")),$Q={TITLE:"Setup environment",PARA:"Firstly, make sure that below environments are ready.",STEPS:[{DESCRIPTION:"Install VS Code from ##here|https://code.visualstudio.com/## if not already done. You can also use any other editor of your choice. But you'll miss some good-to-have benefits.",ALERT:void 0,CODE:void 0},{DESCRIPTION:"Open your favourite terminal.",ALERT:void 0,CODE:void 0}]},wQ={TITLE:"Install packages",PARA:`After environment is set up, install below packages which is required
        for the development.`,STEPS:[{DESCRIPTION:"Install latest 'bun' package globally on your machine. Having 'nodejs' or 'npm' alongside 'bun' is not necessory.",ALERT:`Only recommended way to install 'bun' globally on your machine is to do it from
  ##bun.sh|https://bun.sh/## website directly. Installing 'bun' globally using 
  'npm install -g bun' doesn't work well with Maya and its CLI currently.`,CODE:void 0},{DESCRIPTION:"Check if bun is installed properly using below command in your terminal.",ALERT:void 0,CODE:"bun"},{DESCRIPTION:"Install 'brahma' Cli for developing Maya apps using below command.",ALERT:void 0,CODE:"bun add -g @cyftec/brahma"},{DESCRIPTION:"Check if 'brahma' CLI is installed properly using below command in your terminal.",ALERT:void 0,CODE:"brahma"}]},GQ=[$Q,wQ],HQ=Y.Div({children:Y.For({subject:GQ,map:(B)=>Y.Div({class:"mb5",children:[Y.H3({class:"black",children:B.TITLE}),Y.P({class:"mt0",children:B.PARA}),Y.Ol({children:Y.For({subject:B.STEPS,map:({DESCRIPTION:M,ALERT:Q,CODE:W})=>Y.Li({class:"mb2",children:[HB({text:M}),Y.If({subject:Q,isTruthy:()=>E(HB({text:Q||""}))}),Y.If({subject:W,isTruthy:()=>J(W||"")})]})})})]})})}),hQ=L(Y.H3({class:"black",children:"Create a Maya app"}),U("Brahma creates a ready-to-run Maya project from one command. The app name becomes the new folder, and the optional mode chooses the kind of project scaffold you want to start with.","Start with a web app while learning. TypeScript pages become static HTML and page JavaScript, while the typed NoCSS source becomes the generated application stylesheet."),J("brahma create hello-maya"),Y.H3({class:"black",children:"Install and run"}),U("Run the below commands in terminal. It installs dependencies and then stages your app in watch mode for seeing the generated app UI and continously develop the app."),J(`cd hello-maya
brahma install
brahma stage`),V("Project modes",P("web — a normal web app with multiple page routes.","pwa — a progressive-web-app (PWA) scaffold with a typed manifest, icons, and service-worker entry point.","ext — a Chrome extension scaffold with a typed manifest, popup, content script, and service worker.")),E("The 'brahma create' command creates the selected scaffold and installs its NoCSS probe. 'brahma install' creates local package/config files from _karma/karma.ts and installs dependencies. Run it before the first 'brahma stage' and whenever generated files or dependencies need synchronization."),J(`brahma create hello-pwa --pwa
brahma create hello-extension --ext`)),JQ=L(Y.H3({class:"black",children:"Find your way around the app"}),U("A Maya project keeps application source under dev. The configured appViewDir contains pages and public assets. Directories beginning with the configured @ delimiter are source-only and are not copied as routes.","The standard web scaffold uses dev/view/pages/page.ts for the home page, an about/page.ts file for a folder route, and contacts.page.ts for a dotted page route."),J(`hello-maya/
├── _karma/karma.ts
└── dev/
    ├── controllers/
    ├── models/
    └── view/
        ├── elements/
        └── pages/
            ├── assets/styles.ts
            ├── about/page.ts
            ├── contacts.page.ts
            └── page.ts`),V("What gets built",P("page.ts in a directory becomes index.html and main.js in the matching output directory.","name.page.ts becomes name.html and name.main.js.","The configured styles.ts becomes generated, minified CSS containing only collected NoCSS rules.","Other non-page TypeScript files become JavaScript files; public assets are copied.","Ignored @ folders stay available to imports but are not emitted as standalone output.")),J(`dev/view/pages/page.ts          -> stage/index.html      + stage/main.js
dev/view/pages/about/page.ts    -> stage/about/index.html + stage/about/main.js
dev/view/pages/contacts.page.ts -> stage/contacts.html   + stage/contacts.main.js
dev/view/pages/assets/styles.ts -> stage/assets/styles.css`)),dQ=L(Y.H3({class:"black",children:"Maya is the UI runtime"}),U("Maya turns TypeScript expressions into real DOM elements. Its m object contains one capitalized factory for each supported HTML tag, such as m.Div, m.H1, and m.Button.","Maya is built on UI mutation philosophy and thus the browser DOM remains the actual UI tree, eliminating the need of any Virtual DOM like ther in other frrameworks. Maya remembers the exact nodes it created with the help of Signals, and then signal effects update only the text, child position, or attribute that depends on changed signal state."),J(`import { m } from "@cyftec/maya/core";

const greeting = m.H1("Hello Maya");

const page = m.Main([
  greeting,
  m.P("This is a real TypeScript expression."),
]);`),V("Three phases",Y.Ol({children:[Y.Li({class:"mb2",children:"Build: Brahma runs you app view (page.ts) in JSDOM and builds static HTML multi-page-app (MPA)."}),Y.Li({class:"mb2",children:"Mount: the page script finds those nodes using data-elem-id markers."}),Y.Li({class:"mb2",children:"Run: events and signal effects are now allowed to change the DOM."})]})),J("TypeScript page -> static HTML with markers -> mount existing DOM -> run reactive effects")),FQ=L(Y.H3({class:"black",children:"Configure the project in karma.ts"}),U("Karma is a TypeScript object exported from _karma/karma.ts. It is the source Brahma reads for source and output paths, page and stylesheet names, package metadata, editor settings, Git ignores, and the generated TypeScript configuration.","Generated package.json and tsconfig.json are disposable projections of Karma. Change the typed Karma source, then run brahma install to synchronize them."),J(`import type { Karma } from "./types.js";

export const karma: Karma = {
  brahma: {
    build: {
      appSrcDir: "dev",
      appViewDir: "dev/view/pages",
      buildablePageFileName: "page.ts",
      buildableStylesheetFileName: "styles.ts",
      assetsDirName: "assets",
      buildableManifestFileName: "manifest.ts",
      ignoreDelimiter: "@",
      stagingDir: "stage",
      publishDir: "docs",
      skipErrorAndBuildNext: false,
      disposable: ["stage", "node_modules"],
    },
    serve: {
      port: 3000,
      redirectOnStart: true,
      reloadPageOnFocus: false,
      watchDir: "dev",
      serveDir: "stage",
    },
  },
  maya: {
    name: "hello-maya",
    appType: "web",
    dependencies: { "@cyftec/maya": "0.2.2" },
    devDependencies: {
      "@types/bun": "^1.3.14",
      typescript: "7.0.2",
    },
  },
  git: { ignore: ["stage", "node_modules"] },
  vscode: { settings: { "deno.enable": false, "files.exclude": {} } },
  zed: { settings: { file_scan_exclusions: [] } },
  tsconfig: {
    compilerOptions: {
      lib: ["ESNext", "DOM", "DOM.Iterable"],
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "Bundler",
      moduleDetection: "force",
      allowImportingTsExtensions: true,
      isolatedModules: true,
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      noErrorTruncation: true,
      noFallthroughCasesInSwitch: true,
      noPropertyAccessFromIndexSignature: true,
      noUncheckedIndexedAccess: true,
      noUncheckedSideEffectImports: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      types: ["bun-types"],
    },
    include: ["_karma/**/*.ts", "dev/**/*.ts"],
  },
};`),V("The important distinction",E("_karma/karma.ts is the source configuration. package.json, tsconfig.json, .gitignore, VS Code settings, and Zed settings are generated or synchronized from it. TypeScript is pinned exactly to 7.0.2; do not replace it with a range or downgrade it to hide an error."))),cQ=L(Y.H3({children:"Style the app with NoCSS"}),U("NoCSS is Maya's recommended atomic styling system for your app's own elemental rules. You author a typed styles.ts module, use its css helper in Maya elements, and let Brahma generate styles.css from the class names collected while it builds the pages.","The stylesheet filename and assets directory come from _karma/karma.ts. In the standard web scaffold, the source is dev/view/pages/assets/styles.ts and the generated asset is stage/assets/styles.css.","NoCSS can coexist with a deliberate third-party style source, such as an icon package or syntax-highlighting theme. Give each source a clear job and avoid accidental cascade overlap."),J(`import {
  defineCompoundClasses,
  getCss,
  type AppAtomicClassNames,
  type AppClassNames,
  type AtomicClassOverrides,
  type AtomicClassName,
} from "@cyftec/maya/nocss";

export const atomicClassOverrides = {
  default: {
    theme: "{ color: #ee4440; }",
  },
} as const satisfies AtomicClassOverrides;

type AppAtomicClassName = AppAtomicClassNames<
  AtomicClassName,
  typeof atomicClassOverrides
>;

export const compoundClasses = defineCompoundClasses<AppAtomicClassName>()({
  card: "theme pa3 br3 shadow-1",
});

export type ClassName = AppClassNames<
  AtomicClassName,
  typeof atomicClassOverrides,
  typeof compoundClasses
>;

export const css = getCss<ClassName, typeof compoundClasses>(compoundClasses);`),V("Use the typed helper",J(`import { css } from "./assets/styles.js";

m.Article({
  class: css(
    "card",
    css.when(selected, "bw2", "bw1"),
  ),
  children: "Typed and collected",
});`),P("Use css for every class, including one static class.","Use css.when for boolean style states.","Use css.cases when one subject selects among several style states.","Use css.ifNullable only when null or undefined needs a static fallback.","Add missing declarations and reusable groups to the same styles.ts.","For a single concern: use a matching atom, override an atom when its declaration does not fit, or add a missing atom.","For a repeated combination: use an existing compound or create a flat compound from resolved atoms.")),E("Coding agents may author application styles only through NoCSS. They must not write a CSS file, inline style, style element, injected CSS, raw class string, or another styling dependency. This is an agent-workflow rule: human application authors may choose a deliberate hybrid alongside NoCSS.")),sQ=L(Y.H3({class:"black",children:"Let Brahma build and serve"}),U("Brahma is Maya's Bun-first CLI. It creates scaffolds, installs generated project files, builds pages, compiles NoCSS, watches source changes, and produces deployable output.","During stage, Brahma clears the NoCSS registry, statically builds the pages, generates the used stylesheet, watches the configured source directory, and serves the staging folder."),J(`brahma help
brahma stage
brahma publish
brahma reset
brahma reset --stylesheet
brahma uninstall`),V("A useful development loop",P("Edit a page or shared component inside dev.","Express every application class through the typed NoCSS css helper.","Run brahma stage to build and serve the current app.","Open the printed localhost address and test the browser behavior.","Run brahma publish when you want minified production output.")),J(`brahma stage  # build, watch, and serve
brahma publish # build production files`)),oQ=L(Y.H3({class:"black",children:"Static and reactive pages"}),U("A static Maya page uses ordinary strings and elements. Brahma can build it completely, and the browser only needs the generated page script if it has interactions.","A reactive page adds signals. The initial value still becomes static HTML, but the mounted page also registers effects that update individual nodes or attributes as state changes."),J(`const message = "Always the same";
const count = signal(0); // source number signal
const countLabel = tmpl\`Clicks: \${count}\`; // derived string signal

m.Div([
  m.P(message),
  m.P(countLabel),
  m.Button({ onclick: () => count.value++, children: "Click" }),
]);`),E("Both kinds of page are built ahead of time. Reactive does not mean the whole page is re-rendered. It only mean that when prebuilt reactive page is loaded and mounted in the browser, the DOM gets mutated when the signalled attributes or nodes changes")),UQ=L(Y.H3({class:"black",children:"A signal is changing state"}),U("A signal is a small state container with a .value. Read its value to use the current state, and assign a new value to notify the computations that read it.","Maya re-exports signal helpers from @cyftec/maya/signals, including signal, derive, effect, and tmpl."),J('const name = signal("Ada");\nconst greeting = m.P({ children: tmpl`Hello, ${name}!` });\n\nname.value = "Grace";'),P("signal(value) creates mutable source state.","Reading .value inside a reactive computation records a dependency.","Assigning .value causes dependent effects and derived signals to run.")),jQ=L(Y.H3({class:"black",children:"Effects run when dependencies change"}),U("effect() runs its callback immediately and again whenever a signal read by that callback changes. Maya uses this mechanism internally for reactive children and attributes.","Usually, let an element consume the signal directly. Use an explicit effect when you need an imperative side effect such as logging or synchronizing a browser API."),J(`const count = signal(0);

effect(() => {
  console.log("The count is", count.value);
});

count.value = 1; // the effect runs again`),E("Keep signal reads inside the effect callback so the dependency is tracked.")),qQ=L(Y.H3({class:"black",children:"Derived signals calculate values"}),U("derive() creates read-only state from other signals. It recalculates when the signals read in its callback change, which keeps display logic out of event handlers."),J(`const first = signal("Ada");
const last = signal("Lovelace");
const fullName = derive(() =>
  \`\${first.value} \${last.value}\`,
);

m.P({ children: fullName });`),V("Choose the right primitive",P("Use signal for state an event handler changes.","Use derive for a value calculated from state.","Use effect for an imperative action after a dependency changes.","Use tmpl for a convenient derived string in text or attributes."))),DQ=L(Y.H3({class:"black",children:"Signals connect UI to state"}),U("Pass a signal as a child or attribute when the target should update. Use m.If, m.Switch, and m.For when the shape of the child list itself depends on state.","For a mutable list of objects, give m.For an itemKey. Maya can preserve each mapped DOM node while updating the derived item and index signals."),J(`const tasks = signal([
  { id: 1, text: "Learn signals", done: false },
]);

m.Ul({
  children: m.For({
    subject: tasks,
    itemKey: "id",
    map: (task) => m.Li({
      children: tmpl\`\${() => task.value.text}\`,
    }),
  }),
});`),E("Use an itemKey only when the list (passed to 'subject') is a list of object items. And the key exists in each object item and the property value of that key is unique for each object item.")),pQ=L(Y.H3({class:"black",children:"Build a small Todo List"}),U("Combine elements, a component, signals, a keyed list, and native events. Keep the source signal at page level, use a reusable row component, and let m.For render the list.","Start with the basic loop, then add filtering, derived counts, and persistence as separate experiments."),J(`type Todo = { id: number; text: string; done: boolean };
const todos = signal<Todo[]>([]);
const draft = signal("");

const addTodo = () => {
  if (!draft.value.trim()) return;
  todos.push({ id: Date.now(), text: draft.value, done: false });
  draft.value = "";
};

m.Form({
  onsubmit: (event) => { event.preventDefault(); addTodo(); },
  children: [
    m.Input({
      value: draft,
      oninput: (event) =>
        (draft.value = (event.target as HTMLInputElement).value),
    }),
    m.Button({ type: "submit", children: "Add" }),
  ],
});`),V("Next experiments",P("Add a derived count of unfinished tasks.","Use m.If to show an empty state when the list is empty.","Use m.Switch to show All, Open, and Done filters.","Add onunmount cleanup for any external browser resource."))),LQ=L(Y.H3({class:"black",children:"Three pieces, one workflow"}),U("Maya is the runtime that creates and updates DOM elements. Karma is the typed project configuration. Brahma is the CLI and builder that reads Karma and turns the source project into a runnable app.","NoCSS is Maya's styling system: application TypeScript registers typed classes, and Brahma generates the stylesheet from the rules actually used by the built pages."),J(`TypeScript pages + NoCSS source + assets
          |
       karma.ts
          |
       Brahma
          |
  static HTML + JS + generated CSS
          |
        Maya runtime`),P("Maya: m.* factories, components, lifecycle events, and reactive DOM updates.","Karma: build paths, route naming, serving options, package metadata, Git, VS Code settings, and Zed settings.","Brahma: create, install, stage, publish, reset, NoCSS compilation, and uninstall commands.")),KQ=L(Y.H3({class:"black",children:"Why use a CLI?"}),U("A Maya app has a predictable build pipeline. Brahma packages that pipeline into short commands, so you do not have to manually copy scaffolds, configure a watcher, or remember how route files become output files.","The CLI is deliberately small: it prepares the project and delegates UI authoring to normal TypeScript files."),P("Create a web, PWA, or extension scaffold.","Install dependencies and generated project files from karma.ts.","Build and serve a staging directory while watching source changes.","Build minified static output for deployment."),J(`brahma help
brahma create my-app
brahma install
brahma stage
brahma publish`)),RQ=L(Y.H3({class:"black",children:"brahma create"}),U("create makes a new app directory from the matching sample scaffold, installs the configured NoCSS stylesheet probe, and adds the shared Karma files. The first argument is the folder name; the optional flag selects web, pwa, or ext mode."),J(`brahma create my-app
brahma create my-pwa --pwa
brahma create my-extension --ext`),E("create only prepares the source scaffold. Enter the folder and run brahma install before staging the app."),J(`cd my-app
brahma install
brahma stage`)),zQ=L(Y.H3({class:"black",children:"brahma install"}),U("With no package argument, install uses karma.ts to write package.json, tsconfig.json, .vscode/settings.json, .zed/settings.json, and .gitignore, then runs bun install. This keeps generated project files aligned with the typed configuration.","With a package argument, Brahma adds that package with Bun and synchronizes the resulting dependency back into karma.ts."),J(`brahma install
brahma install @cyftec/maya
brahma install lodash`)),AQ=L(Y.H3({class:"black",children:"brahma uninstall"}),U("uninstall is the reverse of install. With a package argument it removes that dependency and updates karma.ts. Without one, it removes installed packages and generated project files according to the app configuration."),J(`brahma uninstall lodash
brahma uninstall`),E("Use version control before resetting or removing generated files if you need to recover local changes.")),vQ=L(Y.H3({class:"black",children:"brahma publish"}),U("publish builds the app using the production flag. Brahma writes to brahma.build.publishDir, compiles the used NoCSS rules, and minifies the generated page JavaScript and stylesheet. The result is static output ready to deploy.","The command does not start the development server; it produces the files you deploy."),J(`brahma publish
# output location comes from karma.brahma.build.publishDir`)),EQ=L(Y.H3({class:"black",children:"brahma reset"}),U("reset restores karma.ts from the base scaffold. A soft reset preserves the app mode; a hard reset returns to the base web configuration. Changes made to karma.ts can be lost, so check version control first."),J(`brahma reset
brahma reset --hard`),E("Use brahma reset --stylesheet only to restore the configured NoCSS probe. It overwrites that source file, so preserve intentional styling changes first."),J("brahma reset --stylesheet")),PQ=L(Y.H3({children:"TypeScript 7.0.2 baseline"}),U("The monorepo and generated Maya applications use exactly TypeScript 7.0.2. The exact pin keeps editors, local checks, generated projects, and CI on one compiler instead of allowing package ranges to resolve differently.","Repository packages extend one strict tsconfig.base.json. A generated app cannot inherit that repository file, so _karma/karma.ts carries the equivalent compiler options and writes its disposable tsconfig.json during brahma install."),J(`"devDependencies": {
  "typescript": "7.0.2"
}`),P("Change shared repository compiler behavior in tsconfig.base.json.","Keep package configs limited to includes, excludes, and required test aliases.","Change a generated app's TypeScript configuration in _karma/karma.ts, not generated tsconfig.json.","Do not downgrade TypeScript or replace the exact version with a range to hide a diagnostic."),J(`bun run typecheck
./node_modules/.bin/tsc --version`)),VQ=L(Y.H3({children:"NoCSS is the application styling system"}),U("NoCSS is Maya's recommended atomic styling system for first-party element rules. Its configured styles.ts source exports application overrides, responsive constraints, compound classes, a complete ClassName type, and the app's typed css helper.","Brahma clears the class registry, statically renders every page, collects atomic names passed through css, and emits only matching atomic rules as a minified styles.css in the output assets directory. Compound names expand before either HTML or CSS is produced.","It is not Maya's only styling option. A human application author may deliberately combine NoCSS with an icon package, syntax-highlighting theme, or another library-owned stylesheet when that source is the right owner."),J(`import {
  defineCompoundClasses,
  getCss,
  type AppAtomicClassNames,
  type AppClassNames,
  type AtomicClassOverrides,
  type AtomicClassName,
} from "@cyftec/maya/nocss";

export const atomicClassOverrides = {
  default: {
    theme: "{ color: #ee4440; }",
    "focus-ring:focus-visible":
      "{ outline: .1875rem solid currentColor; }",
  },
} as const satisfies AtomicClassOverrides;

type AppAtomicClassName = AppAtomicClassNames<
  AtomicClassName,
  typeof atomicClassOverrides
>;

export const compoundClasses = defineCompoundClasses<AppAtomicClassName>()({
  action: "theme focus-ring pointer ph3 pv2 br2",
});

export type ClassName = AppClassNames<
  AtomicClassName,
  typeof atomicClassOverrides,
  typeof compoundClasses
>;

export const css = getCss<ClassName, typeof compoundClasses>(compoundClasses);`),V("Apply and collect classes",J(`import { css } from "./assets/styles.js";

m.Button({
  class: css(
    "action",
    css.when(busy, "o-50", ""),
  ),
  children: "Save",
});`),P("css combines static, optional, validated, and signalled class phrases.","css.when registers both boolean outcomes during the static build.","css.cases registers every declared subject outcome and an optional default.","css.ifNullable uses a static fallback only for null or undefined.","Use responsive -ns, -m, and -l classes or the matching override groups.")),V("Choose atoms before compounds",...U("For one visual concern, first check the atomic vocabulary. Use a matching atom; override an existing atom when its declaration does not fit the application; create a narrowly scoped atom when none exists.","For a repeated combination, use an existing compound when it matches. Otherwise resolve each concern as an atom first, then define one flat compound from those atoms.","Keep third-party presentation in the source that owns it. NoCSS can coexist with library styles; avoid competing rules for the same property on the same element unless the intended cascade is explicit and tested.")),V("Mandatory rule for coding agents",...U("Coding agents must author CSS-based application styles only through NoCSS. They must pass every class through the app's typed css helper and must not create or edit a stylesheet, inline style, style element, injected CSS, or an additional styling dependency.","This restriction is for coding agents, not human contributors. A human author may retain or add a deliberate hybrid styling source; an agent changing first-party elemental styling must use NoCSS. Canvas drawing commands remain valid for canvas pixels."),E("Use NoCSS for features that belong in its atomic model. Do not force a third-party asset or a genuinely global concern into that model merely to avoid a deliberate hybrid."))),fQ=L(Y.H3({class:"black",children:"Maya's signal integration"}),U("Maya does not implement a second signal system. It re-exports @cyftec/signals through @cyftec/maya/signals and uses the same primitives internally for reactive attributes, children, derived values, and effects.","The important Maya behavior is where those signals connect: each element stores the effects associated with its attributes and children, and those effects are disposed when the element unmounts."),J(`import { signal, derive, effect } from "@cyftec/maya/signals";

const count = signal(0);
const doubled = derive(() => count.value * 2);

effect(() => console.log(doubled.value));`),E("Use the public Maya signal import in app code. The dependency package supplies the implementation; Maya supplies the DOM integration.")),bQ=L(Y.H3({class:"black",children:"The default HTML page"}),U("A page is a Maya HTML getter with head metadata, a body, and the page-local script emitted by Brahma. The script must be deferred so the static DOM exists before mount begins."),J(`import { m } from "@cyftec/maya/core";
import { css } from "./assets/styles.js";

export default m.Html({
  lang: "en",
  children: [
    m.Head([
      m.Title("My app"),
      m.Meta({ charset: "UTF-8" }),
      m.Meta({ name: "viewport", content: "width=device-width, initial-scale=1" }),
      m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
    ]),
    m.Body([
      m.Script({ src: "main.js", defer: true }),
      m.Main({ class: css("center mw8 pa3"), children: m.H1("Hello Maya") }),
    ]),
  ],
});`)),OQ=L(Y.H3({class:"black",children:"A small app-level router helper"}),U("Maya itself does not ship a client-side router. The website demonstrates a small helper that wraps document.location.pathname and hash in signals, then updates them on popstate and hashchange.","This is useful for lightweight UI state, but it does not create routes, load pages, or replace Brahma's file-based MPA routing."),J(`import { signal } from "@cyftec/maya/signals";

export const path = signal(document.location.pathname);
export const hash = signal(document.location.hash);

window.onpopstate = () => {
  path.value = document.location.pathname;
};`),E("Read document and window only in browser-safe code. A page is evaluated in JSDOM during build.")),SQ=L(Y.H3({class:"black",children:"The UI toolkit"}),U("The current Maya toolkit exports query(). It wraps a GET fetch request in signal state so a component can react to loading, data, and error changes."),J(`import { query } from "@cyftec/maya/toolkit";

const users = query<User[]>("/api/users", undefined);

users.runQuery();
users.isLoading.value;
users.data.value;
users.error.value;
users.abortQuery();
users.clearCache();`),V("What it is not",P("It is not a full data cache or retry framework.","It does not define a component-level loading UI for you.","It does not replace fetch or native browser error handling."))),uQ=[{title:"Overview",topics:[{title:"Getting familiar",article:MQ},{title:"Prerequisites",article:tM},{title:"Installation",article:HQ},{title:"App structure",article:JQ},{title:"Brahma, Karma & Maya",article:LQ},{title:"Karma config",article:FQ},{title:"TypeScript 7.0.2",article:PQ}]},{title:"Brahma (CLI)",topics:[{title:"Why the CLI?",article:KQ},{title:"brahma create",article:RQ},{title:"brahma install",article:zQ},{title:"brahma uninstall",article:AQ},{title:"brahma reset",article:EQ},{title:"brahma publish",article:vQ}]},{title:"Maya",topics:[{title:"Syntax",article:QQ},{title:"Overview",article:WQ},{title:"Element",article:XQ},{title:"component",article:YQ},{title:"Props",article:ZQ},{title:"Page",article:_Q}]},{title:"NoCSS",topics:[{title:"Styling applications",article:VQ}]},{title:"Signal",topics:[{title:"What is signal?",article:UQ},{title:"Custom implementation",article:fQ},{title:"Effect",article:jQ},{title:"Derived signals",article:qQ},{title:"Signal for mutating list",article:DQ}]},{title:"Toolbox",topics:[{title:"Default HTML page",article:bQ},{title:"Router",article:OQ},{title:"UI toolkit",article:SQ}]}],yQ=iM({htmlTitle:"Docs - Maya",pageTitle:"Docs",headElements:[Y.Link({rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/agate.min.css"}),Y.Script({src:"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"})],chapters:uQ}),kQ=()=>{S.start("mount"),jB.resetIdCounter(),yQ(),S.start("run")};kQ();
