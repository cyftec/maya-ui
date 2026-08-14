var gB=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","menu","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","search","section","select","slot","small","source","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"],JB=["animate","animateMotion","animateTransform","circle","clipPath","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","svg","symbol","text","textPath","tspan","use","view"],NB={SvgA:"a",SvgScript:"script",SvgStyle:"style",SvgSwitch:"switch",SvgTitle:"title"},FB=["annotation","annotation-xml","maction","math","merror","mfrac","mi","mmultiscripts","mn","mo","mover","mpadded","mphantom","mprescripts","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msubsup","msup","mtable","mtd","mtext","mtr","munder","munderover","semantics"],h,UB=(B)=>{if(!h)h=document.createElement("textarea");return h.innerHTML=B,h.value},CB=(B)=>{try{return decodeURIComponent(B)}catch{return B}},mB=(B)=>{return B.replace(/\\u[\dA-Fa-f]{4}/g,(M)=>String.fromCharCode(parseInt(M.slice(2),16))).replace(/\\x[\dA-Fa-f]{2}/g,(M)=>String.fromCharCode(parseInt(M.slice(2),16)))},hB=()=>{let B=0;return{getNewId:()=>++B,resetIdCounter:()=>B=0}},jB=hB(),O={currentIs:(B)=>window._currentAppPhase===B,start:(B)=>{window._currentAppPhase=B,console.log(`Current phase is ${B}`)}},qB=(B,M,Q)=>{let W=B;W=UB(W),W=CB(W),W=mB(W);let X=W.trim().toLowerCase();for(let Z of M)if(Z.test(X))throw Q;return B},dB=(B)=>qB(B,[/^javascript\s*:/i,/^data\s*:/i,/^vbscript\s*:/i,/^file\s*:/i],'The href attribute value starting with one of "javascript:", "data:", "vbscript:" or "file:" is not allowed.'),cB=(B)=>qB(B,[/url\s*\(/i,/expression\s*\(/i,/javascript\s*:/i,/data\s*:/i,/vbscript\s*:/i,/file\s*:/i],'The style attribute value starting with one of "url(..", "expression(..", "javascript:", "data:", "vbscript:" or "file:" is not allowed.'),sB=(B,M)=>{if(B==="href"){if(typeof M==="boolean")throw"The value of 'href' attribute should not be a boolean";return dB(M||"")}if(B==="style"){if(typeof M==="boolean")throw"The value of 'style' attribute should not be a boolean";return cB(M||"")}return M},c=(()=>{let B=null,M=new Map,Q={addReceiver(W){B=W;try{W.run()}catch(X){throw Q.removeReceiver(W),X}finally{B=null}},removeReceiver(W){M.forEach((X,Z)=>{if(X.delete(W),X.size===0)M.delete(Z)})},ignoreSignalsRegistration(W){let X=B;B=null;try{return W()}finally{B=X}},notifySignalRegistration(W){if(B)if(M.has(W))M.get(W).add(B);else{let X=new Set([B]);M.set(W,X)}},notifySignalUpdate(W){M.get(W)?.forEach((Z)=>{Z.run()})}};return Q})(),a=(B)=>{let M=Object.entries(B).sort((Q,W)=>Q[0].localeCompare(W[0]));return M.forEach(([Q,W],X)=>{if(W&&typeof W==="object"&&!Array.isArray(W))M[X]=[Q,a(W)]}),Object.fromEntries(M)},o=(B)=>{if(typeof B!=="object"||B===null||Array.isArray(B))return!1;return Object.prototype.toString.call(B)==="[object Object]"},T=(B)=>{if(Array.isArray(B)){let Q=[...B],W=[];return Q.forEach((X)=>{W.push(T(X))}),W}if(o(B)){let Q={...B},W={};return Object.keys(Q).forEach((X)=>{W[X]=T(Q[X])}),W}return B},YB=(B,M="index")=>B.map((Q,W)=>({[M]:W,value:Q})),oB=(B,M)=>{let Q=a(B),W=a(M),X=Object.keys(Q),Z=Object.keys(W);if(X.length!==Z.length)return!1;for(let _ of X)if(!Z.includes(_)||!MB(Q[_],W[_]))return!1;return!0},pB=(B,M)=>{if(B.length!==M.length)return!1;if(B.length===0)return!0;for(let Q=0;Q<B.length;Q++)if(!MB(B[Q],M[Q]))return!1;return!0},MB=(B,M)=>{if(typeof B!==typeof M)return!1;if(Array.isArray(B))return pB(B,M);if(B===null||M===null)return B===M;if(typeof B==="object"&&!(B instanceof Set))return oB(B,M);if(typeof B==="bigint"||typeof B==="number"||typeof B==="string"||typeof B==="boolean")return B===M;return B===M},iB=(B,M,Q)=>{let X=YB(T(B),"index");return YB(T(M),"index").map((_)=>{let H="add",J=-1,D=_.value;return X.some((F,v)=>{if(H=MB(F.value,_.value)?F.index===_.index?"idle":"shuffle":Q&&F.value[Q]!==void 0&&F.value[Q]===_.value[Q]?"update":"add",H!=="add")return J=F.index,X.splice(v,1),!0;return!1}),{type:H,oldIndex:J,value:D}})},E=(B)=>["source-signal","derived-signal"].includes(B?.type);function w(B){return E(B)?B.value:B}var G=(...B)=>B.map((M)=>w(M)),rB=(B)=>{let M=(Q)=>B.mutateWith((W)=>{let X=Array.from(W);return Q(X),X});return{concat:(...Q)=>B.mutateWith((W)=>W.concat(...G(...Q))),copyWithin:(...Q)=>M((W)=>W.copyWithin(...G(...Q))),fill:(...Q)=>M((W)=>W.fill(...G(...Q))),filter:(...Q)=>B.mutateWith((W)=>{return W.filter(...G(...Q))}),pop:(...Q)=>M((W)=>W.pop(...G(...Q))),push:(...Q)=>M((W)=>W.push(...G(...Q))),shift:(...Q)=>M((W)=>W.shift(...G(...Q))),toReversed:(...Q)=>M((W)=>W.reverse(...G(...Q))),toSorted:(...Q)=>M((W)=>W.sort(...G(...Q))),toSpliced:(...Q)=>M((W)=>W.splice(...G(...Q))),unshift:(...Q)=>M((W)=>W.unshift(...G(...Q)))}},nB=(B)=>{return{at:(...M)=>$(()=>B.value.at(...G(...M))),concat:(...M)=>$(()=>B.value.concat(...G(...M))),every:(...M)=>$(()=>B.value.every(...G(...M))),entries:()=>$(()=>B.value.entries()),filter:(...M)=>$(()=>B.value.filter(...G(...M))),find:(...M)=>$(()=>B.value.find(...G(...M))),findIndex:(...M)=>$(()=>B.value.findIndex(...G(...M))),findLast:(...M)=>$(()=>B.value.findLast(...G(...M))),findLastIndex:(...M)=>$(()=>B.value.findLastIndex(...G(...M))),flat:(M)=>$(()=>B.value.flat(w(M))),flatMap:(M,Q)=>$(()=>B.value.flatMap(M,w(Q))),forEach:(...M)=>$(()=>{B.value.forEach(...G(...M))}),includes:(...M)=>$(()=>B.value.includes(...G(...M))),indexOf:(...M)=>$(()=>B.value.indexOf(...G(...M))),join:(...M)=>$(()=>B.value.join(...G(...M))),keys:()=>$(()=>B.value.keys()),lastIndexOf:(...M)=>$(()=>B.value.lastIndexOf(...G(...M))),length:()=>$(()=>B.value.length),map:(M,Q)=>$(()=>B.value.map(M,w(Q))),reduce:(M,...Q)=>$(()=>Q.length===0?B.value.reduce(M):B.value.reduce(M,w(Q[0]))),reduceRight:(M,...Q)=>$(()=>Q.length===0?B.value.reduceRight(M):B.value.reduceRight(M,w(Q[0]))),some:(...M)=>$(()=>B.value.some(...G(...M))),slice:(...M)=>$(()=>B.value.slice(...G(...M))),toLocaleString:(...M)=>$(()=>B.value.toLocaleString(...G(...M))),toReversed:(...M)=>$(()=>B.value.toReversed(...G(...M))),toSorted:(...M)=>$(()=>B.value.toSorted(...G(...M))),toSpliced:(...M)=>$(()=>B.value.toSpliced(...G(...M))),values:()=>$(()=>B.value.values()),with:(...M)=>$(()=>B.value.with(...G(...M)))}},tB=(B)=>{return{lastItem:()=>{return $(()=>{return T(B.value).pop()})},partition:(...M)=>{let Q=$(()=>{let[X,Z]=G(...M);return B.value.filter(X,Z)}),W=$(()=>{let[X,Z]=G(...M);return B.value.filter((_,H,J)=>!X.call(Z,_,H,J))});return[Q,W]}}},DB=(B)=>({...nB(B),...tB(B)}),lB=(B)=>({mutate:{...rB(B)},...DB(B)}),aB=(B)=>({toggle:()=>B.mutateWith((M)=>!M)}),eB=(B)=>({mutate:{...aB(B)}}),BM=(B)=>{return{toExponential:(...M)=>$(()=>B.value.toExponential(...G(...M))),toFixed:(...M)=>$(()=>B.value.toFixed(...G(...M))),toPrecision:(...M)=>$(()=>B.value.toPrecision(...G(...M))),toLocaleString:(M,Q)=>$(()=>B.value.toLocaleString(w(M),w(Q)))}},MM=(B)=>{return{toConfined:(M,Q)=>$(()=>{let W=w(M),X=w(Q);return B.value<W?W:B.value>X?X:B.value})}},LB=(B)=>({...BM(B),...MM(B)}),QM=(B)=>({set:(M)=>B.mutateWith((Q)=>({...Q,...M}))}),KB=(B)=>{return{keys:()=>$(()=>Object.keys(B.value)),get:(M)=>$(()=>B.value[M]),props:()=>{let M={};return Object.keys(B.value).forEach((Q)=>{M[Q]=$(()=>B.value[Q])}),M}}},WM=(B)=>({mutate:{...QM(B)},...KB(B)}),RB=(B)=>B.trim().replace(/\s+/g," "),XM=(B)=>{return{concat:function(...M){B.mutateWith((Q)=>Q.concat(...G(...M)))},deepTrim:function(){B.mutateWith((M)=>RB(M))},padEnd:function(...M){B.mutateWith((Q)=>Q.padEnd(...G(...M)))},padStart:function(...M){B.mutateWith((Q)=>Q.padStart(...G(...M)))},repeat:function(...M){B.mutateWith((Q)=>Q.repeat(...G(...M)))},replace:function(...M){B.mutateWith((Q)=>{let[W,X]=G(...M);return Q.replace(W,X)})},replaceAll:function(...M){B.mutateWith((Q)=>{let[W,X]=G(...M);return Q.replaceAll(W,X)})},slice:function(...M){B.mutateWith((Q)=>Q.slice(...G(...M)))},substring:function(...M){B.mutateWith((Q)=>Q.substring(...G(...M)))},trim:function(...M){B.mutateWith((Q)=>Q.trim(...G(...M)))},trimEnd:function(...M){B.mutateWith((Q)=>Q.trimEnd(...G(...M)))},trimStart:function(...M){B.mutateWith((Q)=>Q.trimStart(...G(...M)))},toLocaleLowerCase:function(...M){B.mutateWith((Q)=>Q.toLocaleLowerCase(...G(...M)))},toLocaleUpperCase:function(...M){B.mutateWith((Q)=>Q.toLocaleUpperCase(...G(...M)))},toLowerCase:function(...M){B.mutateWith((Q)=>Q.toLowerCase(...G(...M)))},toUpperCase:function(...M){B.mutateWith((Q)=>Q.toUpperCase(...G(...M)))}}},YM=(B)=>{return{at:(...M)=>$(()=>B.value.at(...G(...M))),charAt:(...M)=>$(()=>B.value.charAt(...G(...M))),charCodeAt:(...M)=>$(()=>B.value.charCodeAt(...G(...M))),codePointAt:(...M)=>$(()=>B.value.codePointAt(...G(...M))),concat:(...M)=>$(()=>B.value.concat(...G(...M))),endsWith:(...M)=>$(()=>B.value.endsWith(...G(...M))),includes:(...M)=>$(()=>B.value.includes(...G(...M))),indexOf:(...M)=>$(()=>B.value.indexOf(...G(...M))),lastIndexOf:(...M)=>$(()=>B.value.lastIndexOf(...G(...M))),padEnd:(...M)=>$(()=>B.value.padEnd(...G(...M))),padStart:(...M)=>$(()=>B.value.padStart(...G(...M))),repeat:(...M)=>$(()=>B.value.repeat(...G(...M))),slice:(...M)=>$(()=>B.value.slice(...G(...M))),startsWith:(...M)=>$(()=>B.value.startsWith(...G(...M))),substring:(...M)=>$(()=>B.value.substring(...G(...M))),trim:(...M)=>$(()=>B.value.trim(...G(...M))),trimEnd:(...M)=>$(()=>B.value.trimEnd(...G(...M))),trimStart:(...M)=>$(()=>B.value.trimStart(...G(...M))),length:()=>$(()=>B.value.length),localeCompare:(...M)=>$(()=>B.value.localeCompare(...G(...M))),normalize:(...M)=>$(()=>B.value.normalize(w(...G(...M)))),replace:(...M)=>$(()=>{let[Q,W]=G(...M);return B.value.replace(Q,W)}),replaceAll:(...M)=>$(()=>{let[Q,W]=G(...M);return B.value.replaceAll(Q,W)}),search:(...M)=>$(()=>B.value.search(...G(...M))),split:(...M)=>$(()=>{let[Q,W]=G(...M);return B.value.split(Q,W)}),toLocaleLowerCase:(...M)=>$(()=>B.value.toLocaleLowerCase(...G(...M))),toLocaleUpperCase:(...M)=>$(()=>B.value.toLocaleUpperCase(...G(...M))),toLowerCase:(...M)=>{return $(()=>B.value.toLowerCase(...G(...M)))},toUpperCase:(...M)=>{return $(()=>B.value.toUpperCase(...G(...M)))}}},ZM=(B)=>{return{deepTrim:()=>{return $(()=>RB(B.value))}}},zB=(B)=>({...YM(B),...ZM(B)}),_M=(B)=>({mutate:{...XM(B)},...zB(B)}),$M=(B,M)=>{let Q=M===void 0?B.nonReactiveValue:M;if(Array.isArray(Q))return DB(B);if(o(Q))return KB(B);if(typeof Q==="string")return zB(B);if(typeof Q==="number")return LB(B);return{}},wM=(B,M)=>{let Q=M===void 0?B.nonReactiveValue:M;if(Array.isArray(Q))return lB(B);if(o(Q))return WM(B);if(typeof Q==="string")return _M(B);if(typeof Q==="number")return LB(B);if(typeof Q==="boolean")return eB(B);return{}},GM=(B)=>{return{then:(M,Q)=>{return $(()=>{let W=w(M),X=w(Q);return B()?W:X})}}},e=(B,M)=>{let Q=(W)=>M?GM(W):$(W);return{truthy:()=>Q(()=>!!B()),falsy:()=>Q(()=>!B()),equalTo:(W)=>Q(()=>B()===w(W)),notEqualTo:(W)=>Q(()=>B()!==w(W)),greaterThan:(W)=>Q(()=>B()>w(W)),greaterThanOrEqualTo:(W)=>Q(()=>B()>=w(W)),smallerThan:(W)=>Q(()=>B()<w(W)),smallerThanOrEqualTo:(W)=>Q(()=>B()<=w(W))}},ZB=(B,M)=>{return{length:e(B,M)}},AB=(B)=>{let M=()=>w(B),Q=()=>{let W=w(B);if(typeof W==="string"||Array.isArray(W))return W.length;return NaN};return{is:{...e(M,!1),...ZB(Q,!1)},if:{...e(M,!0),...ZB(Q,!0)},or:(W)=>{return $(()=>{let X=w(W);return w(B)||X})},toString:()=>{return $(()=>{let W=w(B);if(W===null)return"null";if(W===void 0)return"undefined";if(o(W))return JSON.stringify(W);return W.toString()})}}},vB=(()=>{let B=0;return{get newID(){return++B}}})(),C=(B)=>{let M=vB.newID,Q={get id(){return M},run(){B()},dispose(){c.removeReceiver(Q)}};return c.addReceiver(Q),Q},x=(B,M)=>{let Q=vB.newID,W=void 0,X=T(B),Z={get type(){return"source-signal"},get id(){return Q},get prevValue(){return W},get nonReactiveValue(){return X},get value(){return c.notifySignalRegistration(Z),T(X)},set value(_){if(_===X){console.warn(`Unncessary assignment to sourceSignal with ID - ${Q}`);return}W=X,X=_,c.notifySignalUpdate(Z)},mutateWith(_){let H=_(X);this.value=H}};return Object.assign(Z,AB(Z)),Object.assign(Z,wM(Z,M)),Z},$=(B,M)=>{let Q=x(void 0),W=C(()=>{Q.value=B(Q.nonReactiveValue)}),X={get type(){return"derived-signal"},get prevValue(){return Q.prevValue},get nonReactiveValue(){return Q.nonReactiveValue},get value(){return Q.value},dispose(){W.dispose()}};return Object.assign(X,AB(X)),Object.assign(X,$M(X,M)),X},j=(B)=>{let M=typeof B==="function"?B:()=>w(B);return{...{get result(){return $(()=>M())},get truthy(){return $(()=>!!M())},get falsy(){return $(()=>!M())},get truthyFalsyPair(){return $(()=>{let W=!!M();return[W,!W]})},then:(W,X)=>$(()=>{return M()?w(W):w(X)})},or:(W)=>j(()=>{return M()||w(W)}),orNot:(W)=>j(()=>{return M()||!w(W)}),and:(W)=>j(()=>{return M()&&w(W)}),andNot:(W)=>j(()=>{return M()&&!w(W)}),equals:(W)=>j(()=>{return M()===w(W)}),notEquals:(W)=>j(()=>{return M()!==w(W)}),orBothEqual:(W,X)=>j(()=>{let Z=M(),_=w(W)===w(X);return Z||_}),orBothUnequal:(W,X)=>j(()=>{let Z=M(),_=w(W)!==w(X);return Z||_}),andBothEqual:(W,X)=>j(()=>{let Z=M(),_=w(W)===w(X);return Z&&_}),andBothUnequal:(W,X)=>j(()=>{let Z=M(),_=w(W)!==w(X);return Z&&_}),orThisIsLT:(W,X)=>j(()=>{let Z=M(),_=w(W)<w(X);return Z||_}),orThisIsLTE:(W,X)=>j(()=>{let Z=M(),_=w(W)<=w(X);return Z||_}),orThisIsGT:(W,X)=>j(()=>{let Z=M(),_=w(W)>w(X);return Z||_}),orThisIsGTE:(W,X)=>j(()=>{let Z=M(),_=w(W)>=w(X);return Z||_}),andThisIsLT:(W,X)=>j(()=>{let Z=M(),_=w(W)<w(X);return Z&&_}),andThisIsLTE:(W,X)=>j(()=>{let Z=M(),_=w(W)<=w(X);return Z&&_}),andThisIsGT:(W,X)=>j(()=>{let Z=M(),_=w(W)>w(X);return Z&&_}),andThisIsGTE:(W,X)=>j(()=>{let Z=M(),_=w(W)>=w(X);return Z&&_})}},I=(B)=>{let M=typeof B==="function"?B:()=>w(B);return{...j(B),get result(){return $(M)},add:(Q)=>I(()=>{return M()+w(Q)}),sub:(Q)=>I(()=>{return M()-w(Q)}),mul:(Q)=>I(()=>{return M()*w(Q)}),div:(Q)=>I(()=>{return M()/w(Q)}),mod:(Q)=>I(()=>{return M()%w(Q)}),pow:(Q)=>I(()=>{return M()**w(Q)}),isBetween:(Q,W,X=!0,Z=!0)=>j(()=>{let _=M(),H=w(Q),J=w(W),D=X?_>=H:_>H,F=Z?_<=J:_<J;return D&&F}),isLT:(Q)=>j(()=>M()<w(Q)),isLTE:(Q)=>j(()=>M()<=w(Q)),isGT:(Q)=>j(()=>M()>w(Q)),isGTE:(Q)=>j(()=>M()>=w(Q))}},HM=(B)=>{let M=typeof B==="function"?B:()=>w(B);return{...j(B),lengthBetween:(Q,W,X=!0,Z=!0)=>j(()=>{let H=M().length,J=w(Q),D=w(W),F=X?H>=J:H>J,v=Z?H<=D:H<D;return F&&v}),lengthEquals:(Q)=>j(()=>{return M().length===w(Q)}),lengthNotEquals:(Q)=>j(()=>{return M().length!==w(Q)}),lengthLT:(Q)=>j(()=>{return M().length<w(Q)}),lengthLTE:(Q)=>j(()=>{return M().length<=w(Q)}),lengthGT:(Q)=>j(()=>{return M().length>w(Q)}),lengthGTE:(Q)=>j(()=>{return M().length>=w(Q)})}},r=(B)=>{let Q=(typeof B==="function"?B:()=>w(B))();return typeof Q==="number"?I(B):typeof Q==="string"||Array.isArray(Q)?HM(B):j(B)},A=(B,...M)=>$(()=>{return B.reduce((Q,W,X)=>{let Z,_=M[X];if(typeof _==="function")Z=_()??"";else if(E(_))Z=_.value??"";else Z=_??"";return`${Q}${W}${Z.toString()}`},"")}),QB=(B)=>Array.isArray(B),s=(B)=>!isNaN(B?.nodeID)&&B?.nodeID>0,JM=(B)=>typeof B==="function"&&B.isMayaNodeGetter===!0,g=(B)=>B===void 0||typeof B==="string"||JM(B),FM=(B)=>QB(B)&&B.every((M)=>g(M)),UM=(B)=>!E(B)&&(g(B)||FM(B)),BB=(B)=>E(B)&&g(B.value),EB=(B)=>QB(B)&&B.every((M)=>g(M)||BB(M)),jM=(B)=>!E(B)&&(g(B)||EB(B)),PB=(B)=>E(B)&&UM(B.value),VB=(B)=>jM(B)||PB(B),_B=!1,qM={},N={},DM=globalThis.MutationObserver,LM=new DM((B)=>{B.forEach((M)=>{if(M.type==="childList")M.addedNodes.forEach((Q)=>{if(s(Q)){let W=Q,X=W.nodeID;if(N[X])delete N[X];else qM[X]=W.tagName}}),M.removedNodes.forEach((Q)=>{if(s(Q)){let W=Q,X=W.nodeID,Z=W.unmountListener;if(Z)N[X]={mayaNode:W,unmountListener:Z}}})}),Object.entries(N).forEach(([M,Q])=>{let{mayaNode:W,unmountListener:X}=Q;fB(W,X)})}),fB=(B,M)=>{if(!s(B))return;let Q=B.children;for(let W=0;W<Q.length;W++){let X=Q[W];fB(X,X.unmountListener)}if(M&&M(B),N[B.nodeID])delete N[B.nodeID]},KM=()=>{if(!_B&&!O.currentIs("build"))LM.observe(document.body,{childList:!0,subtree:!0}),_B=!0},$B=(B,M,Q)=>{let W=x(M),X=x(B),Z=Q($(()=>X.value),$(()=>W.value)),_,H,J=!1;if(Z?.isMayaNodeGetter)_=()=>{if(J&&H)return H;return H=Z(),J=!0,H},_.isMayaNodeGetter=!0;else if(!Z||typeof Z==="string")_=Z||"";else throw`One of the child, ${Z} passed in ForElement is invalid.`;return{indexSignal:W,itemSignal:X,mappedChild:_}},wB=(B,M,Q)=>{if(M!==void 0&&M>=0&&Q){let W=M>B.length?B.length:M;B.splice(W,0,Q)}return B},RM=({subject:B,itemKey:M,map:Q,n:W,nthChild:X})=>{if(X&&W===void 0||W!==void 0&&W>-1&&!X)throw Error("Either both 'n' and 'nthChild' be passed or none of them.");let Z=X;if(X&&typeof X!=="string"){let F=X(),v=()=>F;v.isMayaNodeGetter=!0,Z=v}if(!M){let F=()=>wB(w(B).map(Q),W,Z);return E(B)?$(F):F()}let _=w(B);if(_.length&&typeof _[0]!=="object")throw Error("for mutable map, item in the list must be an object");let H=$(()=>{let F=w(B);if(!Array.isArray(F))throw`subject must be an array or signalled array, found ${JSON.stringify(B)}`;return F}),J=$((F)=>{if(!(F||[]).length||!(H.prevValue||[]).length)return H.value.map((z,L)=>$B(z,L,Q));return iB(H.prevValue||[],H.value,M).map((U,z)=>{let L=(F||[])[U.oldIndex];if(console.assert(U.type==="add"&&U.oldIndex===-1&&!L||U.oldIndex>-1&&!!L,"In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer."),L){if(U.type==="shuffle")L.indexSignal.value=z;if(U.type==="update")L.indexSignal.value=z,L.itemSignal.value={...U.value};return L}return $B(U.value,z,Q)})});return $(()=>wB(J.value.map((F)=>F.mappedChild),W,Z))};function zM({subject:B,isTruthy:M,isFalsy:Q}){let W=Y.Span({style:"display: none;"}),X=(Z)=>{if(w(B)){if(!M)return W;let J=M(B);return Z?w(J):J}if(!Q)return W;let H=Q(B);return Z?w(H):H};return E(B)?$(()=>X(!0)):X(!1)}var AM=({subject:B,caseMatcher:M,defaultCase:Q,cases:W})=>{let X=Y.Span({style:"display: none;"}),Z=Q&&Q(),_=(H)=>{let J=w(B),D=w(W),F=void 0;for(let[v,u]of Object.entries(D||{})){let U=M&&M(J,v),z=`${J}`===v;if(U||z){F=H?w(u()):u();break}}return F||Z||X};return E(B)?$(()=>_(!0)):_(!1)},d="http://www.w3.org/2000/svg",vM="http://www.w3.org/1998/Math/MathML",EM=(B,M)=>{if(M===d)return document.createElementNS(d,B);if(FB.includes(B))return document.createElementNS(vM,B);if(JB.includes(B))return document.createElementNS(d,B);return document.createElement(B)},bB=(B)=>B.startsWith("on"),OB=(B)=>B==="onmount"||B==="onunmount",SB=(B,M)=>bB(B)&&M===void 0,uB=(B,M)=>bB(B)&&!OB(B)&&typeof M==="function",yB=(B,M)=>OB(B)&&typeof M==="function",PM=(B,M)=>SB(B,M)||uB(B,M)||yB(B,M),VM=(B,M)=>{Object.entries(M).forEach(([Q,W])=>{if(SB(Q,W));else if(uB(Q,W)){let X=Q.slice(2);B.addEventListener(X,(Z)=>{if(X==="keypress")Z.preventDefault();W(Z)})}else if(yB(Q,W)){if(Q==="onmount"&&!O.currentIs("build")){let X=W;setTimeout(()=>X(B),0)}if(Q==="onunmount"){KM();let X=B.unmountListener;B.unmountListener=(Z)=>{if(W(Z),typeof X==="function")X(Z)}}}else console.error(`Invalid event key: ${Q} for element with tagName: ${B.tagName}`)})},GB=(B,M,Q)=>{let W=E(Q)?Q.value:Q,X=sB(M,W);if(typeof X==="boolean")if(X)B.setAttribute(M,"");else B.removeAttribute(M);else if(M==="value")B.value=X||"";else B.setAttribute(M,X||"")},fM=(B,M)=>{let Q={};Object.entries(M).forEach((X)=>{let[Z,_]=X;if(E(_))Q[Z]=_;GB(B,Z,_)});let W=C(()=>{Object.entries(Q).forEach((X)=>{let[Z,_]=X,H=_.value;if(!O.currentIs("run"))return;GB(B,Z,H)})});B.effects.push(W)},bM=(B)=>{if(!B||typeof B==="string")return document.createTextNode(UB(B||""));if(g(B)){let M=B();if(!s(M))throw Error(`Invalid maya-node-getter child. Type: ${typeof B}`);return M}throw Error(`Invalid child. Type of child: ${typeof B}`)},n=(B,M,Q)=>{let W=B.childNodes[Q],X=bM(M);if(W&&X)B.replaceChild(X,W);else if(X)B.appendChild(X);else console.error(`No child found for node with tagName: ${B.tagName}`)},OM=(B,M)=>{if(!M)return;if(PB(M)){let Z=C(()=>{let _=M.value,H=QB(_)?_:[_];H.forEach((D,F)=>n(B,D,F));let J=H.length;while(J<B.childNodes.length){let D=B.childNodes[J];if(D)B.removeChild(D)}});B.effects.push(Z)}let Q=M,W=g(Q)?[Q]:EB(Q)?Q.map((Z)=>BB(Z)?Z:Z):[],X=[];if(W.forEach((Z,_)=>{if(BB(Z))X.push({index:_,childSignal:Z});let H=w(Z);n(B,H,_)}),X.length)X.forEach(({index:Z,childSignal:_})=>{let H=C(()=>{let J=_.value;if(!O.currentIs("run"))return;n(B,J,Z)});B.effects.push(H)})},SM=(B,M)=>{let Q=void 0,W={},X={};return Object.entries(B).forEach(([Z,_])=>{if(Z==="children")if(VB(_))Q=_;else throw Error(`Invalid children prop for node with tagName: ${M}

 ${JSON.stringify(_)}`);else if(PM(Z,_))W[Z]=_;else X[Z]=_}),{children:Q,eventProps:W,attributeProps:X}},kB=(B,M,Q)=>{let W=()=>{let X=jB.getNewId(),Z=O.currentIs("mount")?document.querySelector(`[data-elem-id="${X}"]`):EM(B,Q);Z.nodeID=X,Z.effects=[],Z.unmountListener=()=>{Z.effects.forEach((J)=>J.dispose())};let _=VB(M)?{children:M}:M;if(!O.currentIs("run"))_["data-elem-id"]=Z.nodeID.toString();let H=SM(_,Z.tagName);if(VM(Z,H.eventProps),fM(Z,H.attributeProps),OM(Z,H.children),!O.currentIs("build"))Z.removeAttribute("data-elem-id");return Z};return W.isMayaNodeGetter=!0,W},uM=(B)=>(M)=>kB(B,M),yM=(B)=>(M)=>kB(B,M,d),kM=[...gB,...JB,...FB].reduce((B,M)=>{let Q=uM(M),W=M.split("-").map((X)=>X.charAt(0).toUpperCase()+X.slice(1)).join("");return B[W]=Q,B},{}),IM=Object.entries(NB).reduce((B,[M,Q])=>{return B[M]=yM(Q),B},{}),TM={For:RM,If:zM,Switch:AM},Y={...kM,...IM,...TM},xM=(B)=>{let M=w(B);if(!Array.isArray(M))return!1;return M.some((Q)=>E(Q))},IB=(B)=>{return(Q={})=>{let W={};for(let X of Object.keys(Q))if(Q[X]===void 0)delete Q[X];return Object.entries(Q).forEach((X)=>{let[Z,_]=X,H=typeof _==="function"?_:xM(_)?w(_):E(_)?_:$(()=>w(_));W[Z]=H}),B(W)}},P=(B)=>IB(B),OQ=P(({logoSrc:B,logoHref:M,logoSize:Q,labelComponent:W})=>{let X=A`${()=>Q?.value||32}`;return Y.A({class:"space-mono link black flex items-center justify-start",href:M,children:[Y.Img({src:B,height:X,width:X}),Y.If({subject:W,isTruthy:()=>W})]})}),SQ=P(({children:B})=>Y.Div({class:"flex items-center",children:B})),gM=P(({classNames:B,labelClassNames:M,href:Q,label:W,onClick:X})=>{let Z=A`flex justify-stretch pointer bg-white hover-bg-light-gray b--gray ba bw1 br-pill ${B}`,_=A`w-100 no-underline bg-transparent dark-gray pv2 ph3 ${M}`;return Y.Button({class:Z,onclick:X,children:Y.A({class:_,...Q?{href:Q}:{},children:W})})}),uQ=P(({className:B})=>Y.Div({class:A`bl b--moon-gray min-vh-20 ${B}`})),yQ=P(({classNames:B,url:M,size:Q})=>Y.A({class:B,target:"_blank",href:M||"https://github.com",children:[Y.Img({class:"ba b--none br-100",src:"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",height:A`${()=>Q?.value||32}`,width:A`${()=>Q?.value||32}`})]})),NM=P(({classNames:B,hoverTitle:M,name:Q,size:W,onClick:X})=>{return Y.Span({class:A`material-symbols-rounded ${X?"pointer":""} ${B}`,style:A`font-size: ${W?.value??24}px; line-height: ${W?.value??24}px;`,title:M,onclick:X,children:Q})}),p=P(({classNames:B,colorCss:M,target:Q,isSelected:W,href:X,onClick:Z,label:_})=>{let H=r(M).then(`${M?.value}`,"dark-gray"),J=A`bg-${H}`,D=r(W).then("white",H),F=r(W).then(J,"transparent"),v=X||Z?"pointer":"";return Y.A({class:A`link underline ${v} ${D} ${F} ${B}`,target:Q,onclick:Z,children:_,...X?{href:X}:{}})}),CM=P(({classNames:B,children:M})=>{return Y.Div({class:A`dn db-ns fg3 pb3 pr2 max-h-80 overflow-y-scroll ${B}`,style:`
      scrollbar-color: #e8e8e8 #f2f1f0;
      scrollbar-width: thin;
    `,children:M})}),HB=P(({classNames:B,linkColorCss:M,text:Q})=>{return Y.Span({class:B,children:Y.If({subject:Q.includes("##"),isFalsy:()=>Q,isTruthy:()=>Y.For({subject:Q.split("##"),map:(W,X)=>{let[Z="",_=""]=W.split("|");return Y.If({subject:X%2===0,isTruthy:()=>W,isFalsy:()=>p({colorCss:M||"theme-col",target:"_blank",label:Z,href:_})})}})})})}),mM=P(({classNames:B,titleClassNames:M,itemClassNames:Q,title:W,justifyRight:X,links:Z,onLinkClick:_,linkColorCss:H,bottomComponent:J})=>{return Y.Div({class:A`${()=>X?.value?"tr":""} ${B}`,children:[Y.P({class:A`space-mono mt0 f3 lh-solid ${M}`,children:W}),Y.Div(Y.For({subject:Z,itemKey:"title",map:(D,F)=>{let{title:v,href:u,isSelected:U}=D.props();return Y.Div({class:Q,children:[p({classNames:"ph2",colorCss:H,label:v,onClick:()=>_&&_(F.value),href:u,isSelected:U})]})}})),Y.If({subject:J,isTruthy:()=>J})]})}),WB=P(({classNames:B,contentClassNames:M,children:Q})=>{return Y.Div({class:A`w-100 bg-pale ${B}`,children:[Y.Div({class:A`mw8 center ${M}`,children:Q})]})}),hM=IB(({headerClassNames:B,headerTitle:M,headerComponent:Q,navbarClassNames:W,navbarComponent:X,contentClassNames:Z,contentTitle:_,contentComponent:H,scrollToTopCounterSignal:J})=>{let D;return C(()=>{if(J?.value)D.scrollTo({top:0})}),[Y.Div({class:A`mt3 mb5 flex-ns flex-wrap items-end ${B}`,children:[Y.H1({class:"mr3 mv2 mv1-ns",children:M}),Y.If({subject:Q,isTruthy:()=>Q})]}),Y.Div({class:"flex w-100 w-auto-ns",children:[CM({classNames:W,children:X}),Y.Div({onmount:(F)=>D=F,class:A`fg7 pb5 w-70-ns mw-100 w-auto-ns max-h-80 overflow-y-scroll
              dark-gray gray-ns lh-copy-ns lh-title ${Z}`,children:[Y.H2({class:"mt0 lh-solid black mid-gray-ns",children:_}),Y.Div({class:"",children:H})]})]})]}),TB="0.2.0",t=(B,M)=>Y.Div({class:"footer-group",children:[Y.Strong(B),...M.map((Q)=>Y.A({href:Q.href,...Q.href.startsWith("http")?{target:"_blank",rel:"noreferrer"}:{},children:[Q.label,Q.href.startsWith("http")?" ↗":""]}))]}),dM=WB({classNames:"site-footer-frame",contentClassNames:"site-footer-shell",children:Y.Footer({class:"site-footer",children:[Y.Div({class:"footer-brand",children:[Y.A({class:"footer-logo",href:"/",children:[Y.Img({src:"/assets/images/maya-logo.svg",height:"38",width:"38",alt:""}),Y.Span({children:[Y.Strong("MAYA"),Y.Small(`UI framework ${TB}`)]})]}),Y.P("A TypeScript-native, MPA-first UI framework by Cyfer. Built close to the browser platform.")]}),Y.Div({class:"footer-links",children:[t("Learn",[{label:"Documentation",href:"/docs/"},{label:"Tutorial",href:"/tutorial/"},{label:"Benchmark",href:"https://benchmark.maya.cyfer.tech/"}]),t("Ecosystem",[{label:"Signal",href:"https://signal.cyfer.tech"},{label:"Maya on npm",href:"https://www.npmjs.com/package/@cyftec/maya"},{label:"Brahma on npm",href:"https://www.npmjs.com/package/@cyftec/brahma"}]),t("Connect",[{label:"GitHub",href:"https://github.com/cyftec/maya-ui"},{label:"Cyfer",href:"https://www.cyfer.tech"},{label:"Maya blogs",href:"https://www.cyfer.tech/blogs?tags=maya"}])]}),Y.Div({class:"footer-bottom",children:[Y.Span("© 2026 Cyfer Tech. All rights reserved."),Y.Span("This site is built with Maya.")]})]})}),cM=[{href:"/#architecture",label:"Architecture"},{href:"/#signals",label:"Signals"},{href:"/#toolchain",label:"Brahma"},{href:"/#benchmark",label:"Benchmark"},{href:"/docs/",label:"Docs"},{href:"/tutorial/",label:"Tutorial"}],sM=()=>WB({classNames:"site-header-frame",contentClassNames:"site-header-shell",children:Y.Header({class:"site-header",children:[Y.A({class:"site-brand",href:"/","aria-label":"Maya home",children:[Y.Img({src:"/assets/images/maya-logo.svg",height:"34",width:"34",alt:""}),Y.Span({children:[Y.Strong("MAYA"),Y.Small(TB)]})]}),Y.Nav({class:"site-nav","aria-label":"Primary navigation",children:cM.map((B)=>Y.A({href:B.href,children:B.label}))}),Y.A({class:"header-github",href:"https://github.com/cyftec/maya-ui",target:"_blank",rel:"noreferrer",children:[Y.Span("GitHub"),Y.Span({"aria-hidden":"true",children:"↗"})]})]})}),oM=P(({title:B,headElements:M,app:Q})=>{let W=w(M||[]);return Y.Html({lang:"en",children:[Y.Head([Y.Meta({charset:"UTF-8"}),Y.Meta({name:"viewport",content:"width=device-width, initial-scale=1"}),Y.Title(B),Y.Link({rel:"stylesheet",href:"/assets/styles.css"}),Y.Link({rel:"icon",type:"image/x-icon",href:"/assets/images/maya-favicon.ico"}),...W]),Y.Body({class:"site-body ph3",children:[Y.Script({src:"main.js",defer:!0}),sM(),WB({children:Q}),dM]})]})}),pM=P(({htmlTitle:B,pageTitle:M,headElements:Q,chapters:W})=>{let X=x([0,0]),Z=x(0),_=([U,z])=>{let L=W.value[U],V=L?.topics[z];if(!L||!V)throw Error(`No topic exists at chapter ${U}, topic ${z}.`);return{chapter:L,topic:V}},H=$(()=>{return _(X.value).topic}),{title:J,article:D}=H.props(),F=$(()=>{let{chapter:U,topic:z}=_(X.value);return[U.title,z.title]}),v=$(()=>{let[U,z]=X.value,L=U,V=z-1;if(!W.value[L]?.topics[V])L=U-1,V=(W.value[L]?.topics.length??0)-1;let y=U,k=z+1;if(!W.value[y]?.topics[k])y=U+1,k=0;return{previous:[L,V],next:[y,k]}}),u=$(()=>{let{previous:U,next:z}=v.value;return[[!1,U],[!0,z]].flatMap(([V,y])=>{let[k,m]=y,i=W.value[k],XB=i?.topics[m];return i&&XB?[{isNext:V,pathIndices:y,chapterTitle:i.title,title:XB.title}]:[]})});return oM({title:B,headElements:Q,app:hM({headerTitle:M,headerComponent:Y.Div({class:"flex flex-wrap items-end f7 b silver light-silver-ns",children:Y.For({subject:F,map:(U)=>Y.Div({class:"mb2 mb0-ns",children:[Y.Span({class:"mh1 mh2-ns",children:"/"}),Y.Span({class:"pa1 ph2-ns mh1 br3 pointer",children:U})]})})}),navbarComponent:Y.For({subject:W,map:({title:U,topics:z},L)=>mM({classNames:"mb0 mb4-ns pb3",titleClassNames:"f4",itemClassNames:"mb3 f6 lh-title",linkColorCss:"theme-col",title:`${L+1}. ${U}`,onLinkClick:(V)=>X.value=[L,V],links:$(()=>z.map((V,y)=>{let[k,m]=X.value;return{title:V.title,isSelected:k===L&&m===y}}))}),n:1/0,nthChild:Y.P({class:"gray f6",children:"** end of list **"})}),contentTitle:J,scrollToTopCounterSignal:Z,contentComponent:[D,Y.Div({class:"flex-ns justify-stretch mv4 w-100",children:Y.For({subject:u,n:1,nthChild:Y.Div({class:$(()=>u.value.length>1?"mh3":"")}),map:(U)=>gM({classNames:"w-100 mt3",onClick:()=>{X.value=U.pathIndices,Z.value++},label:Y.Div({class:"tc",children:[U.isNext?"Next Topic &rarr;":"&larr; Previous Topic",Y.Div({class:"f7 mt1",children:[Y.Span({class:"silver",children:U.chapterTitle+": "}),Y.Span({class:"black",children:U.title})]})]})})})})]})})}),kQ=Y.Div("Coming soon.."),iM=Y.Div({children:Y.For({subject:[`Currently, active development is happening on this framework. And a stable version has not
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
     For all other syntax rules, please check `,". The basic rules mentioned above is enough for now for getting started."],MQ=Y.Div({onmount:xB,children:[Y.H3({class:"black mid-gray-ns",children:l.FIRST_THINGS}),...Y.For({subject:lM,map:(B)=>Y.P({class:"mt0 mb3",children:B}),n:1,nthChild:Y.H3({class:"black mid-gray-ns",children:l.GETTING_FAMILIAR})}),Y.Div({class:"flex-ns w-100 w-auto-ns mv4 gray",children:Y.For({subject:Object.values(aM),map:(B,M)=>Y.Div({class:`b--gray br4 overflow-hidden mb3 lh-copy f6 w-100 w-auto-ns  ${M===0?"br--left-ns br-ns":"br--right-ns"}`,children:[Y.Div({class:"pv2 ph3 bg-black white f4",children:B.title}),Y.Pre({class:"ma0 hljs pa2",children:Y.Code(B.code)})]})})}),Y.Br(),Y.H3({class:"mv0 lh-solid black mid-gray-ns",children:l.SYNTAX_RULES}),Y.Ul({class:"mb4",children:Y.For({subject:eM,map:(B)=>Y.Li({class:"mb2",children:B})})}),...Y.For({subject:BQ,n:1,nthChild:p({colorCss:"theme-col",href:"/docs",label:"docs here"}),map:(B)=>B})]}),q=(B)=>{let M=x("content_copy"),Q=x("copy"),W=()=>{M.value="done_all",Q.value="copied",navigator.clipboard.writeText(B||""),setTimeout(()=>{M.value="content_copy",Q.value="copy"},2000)};return Y.Div({class:"mv3 pa3 br4 hljs overflow-auto",children:Y.Pre({class:"ma0 relative",children:[Y.Code(B),NM({classNames:"absolute top-0 right-0 bg-white-30 br-100 pa1",hoverTitle:Q,name:M,onClick:W})]})})},f=(B)=>Y.Div({class:"list bg-white pa3 mv3 bl bw4 br4 b--theme-col",children:B}),R=(...B)=>Y.Div({onmount:xB,children:B.flat()}),S=(B,...M)=>Y.Div({class:"mt5 mb4",children:[Y.H3({class:"black",children:B}),...M]}),K=(...B)=>Y.For({subject:B,map:(M)=>Y.P({class:"mt0 mb3",children:M})}),b=(...B)=>Y.Ul({class:"mb4",children:Y.For({subject:B,map:(M)=>Y.Li({class:"mb2",children:M})})}),QQ={TITLE:"Setup environment",PARA:"Firstly, make sure that below environments are ready.",STEPS:[{DESCRIPTION:"Install VS Code from ##here|https://code.visualstudio.com/## if not already done. You can also use any other editor of your choice. But you'll miss some good-to-have benefits.",ALERT:void 0,CODE:void 0},{DESCRIPTION:"Open your favourite terminal.",ALERT:void 0,CODE:void 0}]},WQ={TITLE:"Install packages",PARA:`After environment is set up, install below packages which is required
        for the development.`,STEPS:[{DESCRIPTION:"Install latest 'bun' package globally on your machine. Having 'nodejs' or 'npm' alongside 'bun' is not necessory.",ALERT:`Only recommended way to install 'bun' globally on your machine is to do it from
  ##bun.sh|https://bun.sh/## website directly. Installing 'bun' globally using 
  'npm install -g bun' doesn't work well with Maya and its CLI currently.`,CODE:void 0},{DESCRIPTION:"Check if bun is installed properly using below command in your terminal.",ALERT:void 0,CODE:"bun"},{DESCRIPTION:"Install 'brahma' Cli for developing Maya apps using below command.",ALERT:void 0,CODE:"bun add -g @cyftec/brahma"},{DESCRIPTION:"Check if 'brahma' CLI is installed properly using below command in your terminal.",ALERT:void 0,CODE:"brahma"}]},XQ=[QQ,WQ],YQ=Y.Div({children:Y.For({subject:XQ,map:(B)=>Y.Div({class:"mb5",children:[Y.H3({class:"black",children:B.TITLE}),Y.P({class:"mt0",children:B.PARA}),Y.Ol({children:Y.For({subject:B.STEPS,map:({DESCRIPTION:M,ALERT:Q,CODE:W})=>Y.Li({class:"mb2",children:[HB({text:M}),Y.If({subject:Q,isTruthy:()=>f(HB({text:Q||""}))}),Y.If({subject:W,isTruthy:()=>q(W||"")})]})})})]})})}),ZQ=R(Y.H3({class:"black",children:"Create a Maya app"}),K("Brahma creates a ready-to-run Maya project from one command. The app name becomes the new folder, and the optional mode chooses the kind of project scaffold you want to start with.","Start with a web app while learning. TypeScript pages become static HTML and page JavaScript, while the typed NoCSS source becomes the generated application stylesheet."),q("brahma create hello-maya"),Y.H3({class:"black",children:"Install and run"}),K("Run the below commands in terminal. It installs dependencies and then stages your app in watch mode for seeing the generated app UI and continously develop the app."),q(`cd hello-maya
brahma install
brahma stage`),S("Project modes",b("web — a normal web app with multiple page routes.","pwa — a progressive-web-app (PWA) scaffold with a typed manifest, icons, and service-worker entry point.","ext — a Chrome extension scaffold with a typed manifest, popup, content script, and service worker.")),f("The 'brahma create' command creates the selected scaffold and installs its NoCSS probe. 'brahma install' creates local package/config files from _karma/karma.ts and installs dependencies. Run it before the first 'brahma stage' and whenever generated files or dependencies need synchronization."),q(`brahma create hello-pwa --pwa
brahma create hello-extension --ext`)),_Q=R(Y.H3({class:"black",children:"Find your way around the app"}),K("A Maya project keeps application source under dev. The configured appViewDir contains pages and public assets. Directories beginning with the configured @ delimiter are source-only and are not copied as routes.","The standard web scaffold uses dev/view/pages/page.ts for the home page, an about/page.ts file for a folder route, and contacts.page.ts for a dotted page route."),q(`hello-maya/
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
            └── page.ts`),S("What gets built",b("page.ts in a directory becomes index.html and main.js in the matching output directory.","name.page.ts becomes name.html and name.main.js.","The configured styles.ts becomes generated, minified CSS containing only collected NoCSS rules.","Other non-page TypeScript files become JavaScript files; public assets are copied.","Ignored @ folders stay available to imports but are not emitted as standalone output.")),q(`dev/view/pages/page.ts          -> stage/index.html      + stage/main.js
dev/view/pages/about/page.ts    -> stage/about/index.html + stage/about/main.js
dev/view/pages/contacts.page.ts -> stage/contacts.html   + stage/contacts.main.js
dev/view/pages/assets/styles.ts -> stage/assets/styles.css`)),$Q=R(Y.H3({class:"black",children:"Maya is the UI runtime"}),K("Maya turns TypeScript expressions into real DOM elements. Its m object contains one capitalized factory for each supported HTML tag, such as m.Div, m.H1, and m.Button.","Maya is built on UI mutation philosophy and thus the browser DOM remains the actual UI tree, eliminating the need of any Virtual DOM like ther in other frrameworks. Maya remembers the exact nodes it created with the help of Signals, and then signal effects update only the text, child position, or attribute that depends on changed signal state."),q(`import { m } from "@cyftec/maya/core";

const greeting = m.H1("Hello Maya");

const page = m.Main([
  greeting,
  m.P("This is a real TypeScript expression."),
]);`),S("Three phases",Y.Ol({children:[Y.Li({class:"mb2",children:"Build: Brahma runs you app view (page.ts) in JSDOM and builds static HTML multi-page-app (MPA)."}),Y.Li({class:"mb2",children:"Mount: the page script finds those nodes using data-elem-id markers."}),Y.Li({class:"mb2",children:"Run: events and signal effects are now allowed to change the DOM."})]})),q("TypeScript page -> static HTML with markers -> mount existing DOM -> run reactive effects")),wQ=R(Y.H3({class:"black",children:"Configure the project in karma.ts"}),K("Karma is a TypeScript object exported from _karma/karma.ts. It is the source Brahma reads for source and output paths, page and stylesheet names, package metadata, editor settings, Git ignores, and the generated TypeScript configuration.","Generated package.json and tsconfig.json are disposable projections of Karma. Change the typed Karma source, then run brahma install to synchronize them."),q(`import type { Karma } from "./types.js";

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
    dependencies: { "@cyftec/maya": "0.2.0" },
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
};`),S("The important distinction",f("_karma/karma.ts is the source configuration. package.json, tsconfig.json, .gitignore, VS Code settings, and Zed settings are generated or synchronized from it. TypeScript is pinned exactly to 7.0.2; do not replace it with a range or downgrade it to hide an error."))),GQ=R(Y.H3({children:"Style the app with NoCSS"}),K("NoCSS is Maya's application styling system. You author a typed styles.ts module, use its css helper in Maya elements, and let Brahma generate styles.css from the class names collected while it builds the pages.","The stylesheet filename and assets directory come from _karma/karma.ts. In the standard web scaffold, the source is dev/view/pages/assets/styles.ts and the generated asset is stage/assets/styles.css."),q(`import {
  getCss,
  type AppClassNames,
  type AtomicClassOverrides,
  type BaseClassName,
} from "@cyftec/maya/nocss";

export const overriddenBaseClasses = {
  default: {
    theme: "{ color: #ee4440; }",
  },
} as const satisfies AtomicClassOverrides;

export const compoundClasses = {
  card: "theme pa3 br3 shadow-1",
} as const;

export type ClassName = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses,
  typeof compoundClasses
>;

export const css = getCss<ClassName>();`),S("Use the typed helper",q(`import { css } from "./assets/styles.js";

m.Article({
  class: css(
    "card",
    css.when(selected, "bw2", "bw1"),
  ),
  children: "Typed and collected",
});`),b("Use css for every class, including one static class.","Use css.when for boolean style states.","Use css.cases when one subject selects among several style states.","Use css.ifNullable only when null or undefined needs a static fallback.","Add missing declarations and reusable groups to the same styles.ts.")),f("Coding agents may author application styles only through NoCSS. They must not write a CSS file, inline style, style element, injected CSS, raw class string, or another styling dependency. This restriction does not apply to humans.")),HQ=R(Y.H3({class:"black",children:"Let Brahma build and serve"}),K("Brahma is Maya's Bun-first CLI. It creates scaffolds, installs generated project files, builds pages, compiles NoCSS, watches source changes, and produces deployable output.","During stage, Brahma clears the NoCSS registry, statically builds the pages, generates the used stylesheet, watches the configured source directory, and serves the staging folder."),q(`brahma help
brahma stage
brahma publish
brahma reset
brahma reset --stylesheet
brahma uninstall`),S("A useful development loop",b("Edit a page or shared component inside dev.","Express every application class through the typed NoCSS css helper.","Run brahma stage to build and serve the current app.","Open the printed localhost address and test the browser behavior.","Run brahma publish when you want minified production output.")),q(`brahma stage  # build, watch, and serve
brahma publish # build production files`)),JQ=R(Y.H3({class:"black",children:"Syntax is TypeScript"}),K("Maya does not add a template language. You write normal TypeScript and call functions that describe the DOM. The visual mapping is close to HTML, but every node is an expression.","Use a direct child for a short element, or pass an object when you need attributes, events, and children together."),q(`import { css } from "./assets/styles.js";

m.Div("A short child")

m.Div({
  class: css("card"),
  children: [m.H2("A heading"), m.P("A paragraph")],
})`),b("HTML tags become capitalized m factories.","The children property contains a string, element getter, array, or supported signal value.","Events receive functions, not quoted HTML event strings.","Use normal JavaScript and TypeScript wherever it makes the code clearer.")),FQ=R(Y.H3({class:"black",children:"From one element to an app"}),K("A Maya application is assembled from small getters. Elements compose into fragments, fragments become components, and a default page getter gives Brahma an entry point to build.","There is no virtual DOM tree to learn. When the page is mounted, the same getter sequence attaches behavior to the static nodes that were already generated."),q(`import { component } from "@cyftec/maya/core";
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
});`),f("The builder calls the default export during build. A page must be safe to evaluate in JSDOM.")),UQ=R(Y.H3({class:"black",children:"Elements are getters"}),K("Calling m.Div(...) returns an element getter. Calling that getter creates the element during build, or finds its matching static element during mount.","This is why a getter can be passed around as a child and reused by a component without needing a special template compiler."),q(`const title = m.H1("Welcome");
const content = m.Main([
  title,
  m.P({ id: "intro", children: "Read this first." }),
]);

const node = content();`),S("Element props",b("id, href, value, and data-* become attributes; pass application class values through the typed NoCSS css helper.","onclick, oninput, and other supported lower-case event keys register listeners.","onmount and onunmount are lifecycle callbacks for browser-only work and cleanup."))),jQ=R(Y.H3({class:"black",children:"Fragments group children"}),K("A fragment is a function that returns children rather than one wrapper element. Use it when a reusable piece of UI should contribute several siblings to its parent.","Use fragment() for a reusable sibling group and component() for one reusable Maya child. Keep plain functions for work that does not return Maya UI."),q(`import { component, fragment, m } from "@cyftec/maya/core";

const Actions = fragment(() => [
  m.Button({ children: "Save" }),
  m.Button({ children: "Cancel" }),
]);

const Toolbar = component(() =>
  m.Div({ children: [m.Strong("Actions"), Actions()] }),
);`)),qQ=R(Y.H3({class:"black",children:"Components add a typed boundary"}),K("Use component() when reusable Maya UI has named props. Maya preserves compatible reactive values and callback functions so the component can forward data into attributes or children without a rerender loop."),q(`import { component, m } from "@cyftec/maya/core";
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

Badge({ label: "New", tone: "success" });`),f("A component is your TypeScript function; m.Div and m.Span are the element factories it composes.")),DQ=R(Y.H3({class:"black",children:"Props describe data and behavior"}),K("Pass attributes directly to an element and named values to a component. Keep callback props as functions so the child can connect them to a DOM event.","For reactive values, pass a signal. Maya's element and attribute logic will track it and update the exact target when the signal changes."),q(`type CounterProps = {
  value: ReturnType<typeof signal<number>>;
  onIncrement: () => void;
};

const Counter = component<CounterProps>(({ value, onIncrement }) =>
  m.Button({ onclick: onIncrement, children: tmpl\`Count: \${value}\` }),
);`),f("A value prop is data. An onSomething prop is behavior. A signal prop is data that may change.")),LQ=R(Y.H3({class:"black",children:"A page is a default export"}),K("Brahma recognizes a file as a page when its filename matches karma.brahma.build.buildablePageFileName. The page module's default export must be the root Maya HTML getter.","Include the generated page script in the body. It mounts the page and starts the run phase in the browser."),q(`import { m } from "@cyftec/maya/core";
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
});`)),KQ=R(Y.H3({class:"black",children:"Folders become routes"}),K("Brahma uses the view folder structure as the URL structure. Put page.ts inside a folder for an index page, and use a dotted page filename for a single named HTML file."),q(`dev/view/pages/page.ts             -> /index.html
dev/view/pages/docs/page.ts        -> /docs/index.html
dev/view/pages/docs/signals/page.ts -> /docs/signals/index.html
dev/view/pages/contact.page.ts     -> /contact.html`),b("Relative imports follow the source folder structure.","Relative links should point to the built route.","The generated script name follows the page route.")),RQ=R(Y.H3({class:"black",children:"Static and reactive pages"}),K("A static Maya page uses ordinary strings and elements. Brahma can build it completely, and the browser only needs the generated page script if it has interactions.","A reactive page adds signals. The initial value still becomes static HTML, but the mounted page also registers effects that update individual nodes or attributes as state changes."),q(`const message = "Always the same";
const count = signal(0); // source number signal
const countLabel = tmpl\`Clicks: \${count}\`; // derived string signal

m.Div([
  m.P(message),
  m.P(countLabel),
  m.Button({ onclick: () => count.value++, children: "Click" }),
]);`),f("Both kinds of page are built ahead of time. Reactive does not mean the whole page is re-rendered. It only mean that when prebuilt reactive page is loaded and mounted in the browser, the DOM gets mutated when the signalled attributes or nodes changes")),zQ=R(Y.H3({class:"black",children:"A signal is changing state"}),K("A signal is a small state container with a .value. Read its value to use the current state, and assign a new value to notify the computations that read it.","Maya re-exports signal helpers from @cyftec/maya/signals, including signal, derive, effect, and tmpl."),q('const name = signal("Ada");\nconst greeting = m.P({ children: tmpl`Hello, ${name}!` });\n\nname.value = "Grace";'),b("signal(value) creates mutable source state.","Reading .value inside a reactive computation records a dependency.","Assigning .value causes dependent effects and derived signals to run.")),AQ=R(Y.H3({class:"black",children:"Effects run when dependencies change"}),K("effect() runs its callback immediately and again whenever a signal read by that callback changes. Maya uses this mechanism internally for reactive children and attributes.","Usually, let an element consume the signal directly. Use an explicit effect when you need an imperative side effect such as logging or synchronizing a browser API."),q(`const count = signal(0);

effect(() => {
  console.log("The count is", count.value);
});

count.value = 1; // the effect runs again`),f("Keep signal reads inside the effect callback so the dependency is tracked.")),vQ=R(Y.H3({class:"black",children:"Derived signals calculate values"}),K("derive() creates read-only state from other signals. It recalculates when the signals read in its callback change, which keeps display logic out of event handlers."),q(`const first = signal("Ada");
const last = signal("Lovelace");
const fullName = derive(() =>
  \`\${first.value} \${last.value}\`,
);

m.P({ children: fullName });`),S("Choose the right primitive",b("Use signal for state an event handler changes.","Use derive for a value calculated from state.","Use effect for an imperative action after a dependency changes.","Use tmpl for a convenient derived string in text or attributes."))),EQ=R(Y.H3({class:"black",children:"Signals connect UI to state"}),K("Pass a signal as a child or attribute when the target should update. Use m.If, m.Switch, and m.For when the shape of the child list itself depends on state.","For a mutable list of objects, give m.For an itemKey. Maya can preserve each mapped DOM node while updating the derived item and index signals."),q(`const tasks = signal([
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
});`),f("Use an itemKey only when the list (passed to 'subject') is a list of object items. And the key exists in each object item and the property value of that key is unique for each object item.")),PQ=R(Y.H3({class:"black",children:"Build a small Todo List"}),K("Combine elements, a component, signals, a keyed list, and native events. Keep the source signal at page level, use a reusable row component, and let m.For render the list.","Start with the basic loop, then add filtering, derived counts, and persistence as separate experiments."),q(`type Todo = { id: number; text: string; done: boolean };
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
});`),S("Next experiments",b("Add a derived count of unfinished tasks.","Use m.If to show an empty state when the list is empty.","Use m.Switch to show All, Open, and Done filters.","Add onunmount cleanup for any external browser resource."))),VQ=[{title:"Before Starting",topics:[{title:"Getting familiar",article:MQ},{title:"Prerequisites",article:tM},{title:"Disclaimer",article:iM}]},{title:"Project Setup",topics:[{title:"Setup & Installations",article:YQ},{title:"Your first app using 'brahma create'",article:ZQ},{title:"App structure",article:_Q},{title:"Maya",article:$Q},{title:"Karma",article:wQ},{title:"NoCSS styling",article:GQ},{title:"Brahma",article:HQ}]},{title:"Learning Maya from sample app",topics:[{title:"Syntax",article:JQ},{title:"Overview",article:FQ},{title:"Element",article:UQ},{title:"Fragment",article:jQ},{title:"Component",article:qQ},{title:"Props",article:DQ},{title:"Page",article:LQ},{title:"Folder based routes",article:KQ}]},{title:"Reactivity",topics:[{title:"Static vs Reactive Maya app",article:RQ},{title:"What is signal?",article:zQ},{title:"Effect",article:AQ},{title:"Derived signals",article:vQ},{title:"Signal for reactivity",article:EQ}]},{title:"Todo List app example",topics:[{title:"Build a Todo List",article:PQ}]}],fQ=pM({htmlTitle:"Tutorial - Maya",pageTitle:"Tutorial",headElements:[Y.Link({rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/agate.min.css"}),Y.Script({src:"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"})],chapters:VQ}),bQ=()=>{O.start("mount"),jB.resetIdCounter(),fQ(),O.start("run")};bQ();
