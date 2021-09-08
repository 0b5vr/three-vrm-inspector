/*! For license information please see three-vrm-inspector.js.LICENSE.txt */
  display: inline-block;
  width: ${Eb};
  height: ${Eb};
  text-align: center;
  cursor: pointer;

  &:hover {
    color: ${Fe};
  }
`,Ab=Ne.div`
  height: ${Eb};
  line-height: ${Eb};
  width: 100%;
  background: ${"#30343b"};
  cursor: move;
`,Lb=Ne.div`
  position: absolute;
  min-width: 240px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 1.0);
`,Rb=e=>{var t,n,r;const[o,a]=(0,i.useState)(null!==(t=e.initPosition)&&void 0!==t?t:{left:0,top:0}),[s,l]=(0,i.useState)(null!==(n=e.initOpening)&&void 0!==n&&n),u=function(){const e=(0,i.useRef)(-1/0);return(0,i.useCallback)((t=>{const n=performance.now();n-e.current<250?(t(),e.current=-1/0):e.current=n}),[e])}(),c=(0,i.useCallback)((t=>{var n;null===(n=e.onClick)||void 0===n||n.call(e,t,e.paneKey)}),[e.onClick,e.paneKey]),h=(0,i.useCallback)((e=>{e.preventDefault();let t=o.left,n=o.top;!function(e,r){let i,o=!1,s={x:0,y:0};const l=()=>{o||(requestAnimationFrame(l),i&&(((e,r)=>{e.preventDefault(),e.stopPropagation(),t+=r.x,n+=r.y,a({left:t,top:n})})(i,s),i=void 0,s={x:0,y:0}))};l();const u=e=>{i=e,s.x+=e.movementX,s.y+=e.movementY},c=e=>{o||(o=!0),window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",c),window.removeEventListener("mousedown",c)};window.addEventListener("mousemove",u),window.addEventListener("mouseup",c),setTimeout((()=>window.addEventListener("mousedown",c)))}(),u((()=>{l(!s)}))}),[s,o]),d=(0,i.useCallback)((t=>{var n;t.preventDefault(),t.stopPropagation(),null===(n=e.onClick)||void 0===n||n.call(e,t,e.paneKey),l(!s)}),[s,e.onClick,e.paneKey]);return i.createElement(Lb,{style:{left:o.left,top:o.top},className:e.className,onMouseDown:c},i.createElement(Ab,{onMouseDown:h},i.createElement(Tb,{onMouseDown:d},s?"-":"+"),e.title),s&&(null!==(r=e.children)&&void 0!==r?r:null))},Cb=Ne.input`
  margin-right: 8px;
`,Pb=Ne.span`
  color: ${Ue};
`,Ib=Ne.div`
  display: flex;
  align-items: center;
`,kb=({name:e,isAvailable:t})=>{const{inspector:n}=(0,i.useContext)(Mb),r=(0,i.useCallback)((t=>{var r,i;null===(i=null===(r=n.vrm)||void 0===r?void 0:r.expressionManager)||void 0===i||i.setValue(e,parseFloat(t.target.value))}),[]);return i.createElement(Ib,null,i.createElement(Cb,{type:"range",min:"0",max:"1",step:"0.001",defaultValue:"0",disabled:!t,onChange:r}),t?e:i.createElement(Pb,null,e))},Ob=[bg.Neutral,bg.Happy,bg.Angry,bg.Sad,bg.Relaxed,bg.Surprised,bg.Blink,bg.BlinkLeft,bg.BlinkRight,bg.Aa,bg.Ee,bg.Ih,bg.Oh,bg.Ou,bg.LookLeft,bg.LookRight,bg.LookDown,bg.LookUp],Nb=new Set(Ob),Db=Ne.div`
  width: 100%;
  height: 2px;
  margin: 8px 0;
  background: ${Ue};
`,Fb=Ne.div`
  color: ${Ue};
`,Ub=Ne.div`
  padding: 8px;
  background: ${ze};
  backdrop-filter: blur( 5px );
`,zb=e=>{var t,n;const{inspector:r}=(0,i.useContext)(Mb),o=null===(t=r.vrm)||void 0===t?void 0:t.expressionManager,a=null==o?void 0:o.expressionMap,s=[];a&&Array.from(Object.keys(a)).forEach((e=>{Nb.has(e)||s.push(e)}));const l=(null!==(n=null==s?void 0:s.length)&&void 0!==n?n:0)>=1;return i.createElement(Rb,Object.assign({},e),i.createElement(Ub,null,o?i.createElement(i.Fragment,null,Ob.map((e=>i.createElement(kb,{key:e,name:e,isAvailable:null!=(null==o?void 0:o.getExpression(e))}))),i.createElement(Db,null),null==s?void 0:s.map((e=>i.createElement(kb,{key:e,name:e,isAvailable:!0}))),!l&&i.createElement(Fb,null,"(No custom expressions)")):"No blendShapeProxy detected."))},Bb=Ne.input`
`,Hb=Ne.div`
  line-height: 20px;
`,Vb=({callback:e,label:t})=>{const[n,r]=(0,i.useState)(!0),o=(0,i.useCallback)((({target:t})=>{e(t.checked),r(t.checked)}),[e]);return i.createElement(Hb,null,i.createElement(Bb,{type:"checkbox",checked:n,onChange:o}),t)},Gb=Ne.div`
  padding: 8px;
  background: ${ze};
  backdrop-filter: blur( 5px );
`,jb=e=>{const{inspector:t}=(0,i.useContext)(Mb),n=(0,i.useCallback)((e=>{t.springBoneJointHelperRoot.visible=e}),[t]),r=(0,i.useCallback)((e=>{t.springBoneColliderHelperRoot.visible=e}),[t]);return i.createElement(Rb,Object.assign({},e),i.createElement(Gb,null,i.createElement(Vb,{callback:n,label:"Spring Bones"}),i.createElement(Vb,{callback:r,label:"Spring Bone Colliders"})))},$b=Ne.span`
  user-select: none;
  cursor: pointer;
`,Wb=Ne.div`
  margin-left: 1.13em;
`,qb=Ne.span`
  color: ${({isHovering:e})=>e?Fe:De};
  cursor: pointer;
`,Xb=Ne.div`
`,Yb=Ne.span`
`,Qb=Ne(Yb)`
  color: ${Ge};
`,Zb=Ne(Yb)`
  color: ${je};
`,Kb=Ne(Yb)`
  color: ${je};
`,Jb=Ne(Yb)`
  color: ${"#f7f025"};
`,ex=Ne.span`
  margin: 0;
  padding: 0;
  pointer-events: auto;
  font-family: 'Roboto Mono', monospace;
`,tx=({name:e,value:t,fullPath:n=""})=>{const{highlighter:r}=(0,i.useContext)(Mb),[o,a]=(0,i.useState)(!1),[s,l]=(0,i.useState)(!1),[u,c]=(0,i.useState)([void 0]),h=(0,i.useCallback)((e=>{e.stopPropagation(),a(!o)}),[a,o]),d=(0,i.useCallback)((()=>{l(!0),c([r.highlight(n)])}),[l,c,r,n]),f=(0,i.useCallback)((()=>{var e;l(!1),null===(e=u[0])||void 0===e||e.call(u)}),[l,u]),p=Array.isArray(t),m=null==t,g="number"==typeof t,v="boolean"==typeof t,y="string"==typeof t,b=!(p||m||g||v||y),x={onClick:h,onMouseEnter:d,onMouseLeave:f,isHovering:s};return i.createElement(i.Fragment,null,i.createElement(ex,null,i.createElement(qb,Object.assign({},x),e?`${e}: `:""),p&&i.createElement(i.Fragment,null,i.createElement($b,Object.assign({},x),"["),o&&i.createElement(Wb,null,t.map(((e,t)=>i.createElement(Xb,{key:t},i.createElement(tx,{name:t.toString()+((null==e?void 0:e.name)?` (${e.name})`:""),value:e,fullPath:`${n}/${t}`}))))),i.createElement($b,Object.assign({},x),` ${o?"":t.length} ]`)),b&&i.createElement(i.Fragment,null,i.createElement($b,Object.assign({},x),"{"),o&&i.createElement(Wb,null,Object.keys(t).map(((e,r)=>i.createElement(Xb,{key:r},i.createElement(tx,{name:e,value:t[e],fullPath:`${n}/${e}`}))))),i.createElement($b,Object.assign({},x),` ${o?"":Object.keys(t).join(", ")} }`)),m&&i.createElement(i.Fragment,null,i.createElement(Qb,Object.assign({},x),t)),g&&i.createElement(i.Fragment,null,i.createElement(Zb,Object.assign({},x),t)),v&&i.createElement(i.Fragment,null,i.createElement(Kb,Object.assign({},x),String(t))),y&&i.createElement(i.Fragment,null,i.createElement(Jb,Object.assign({},x),'"',t,'"'))))},nx=Ne.div`
  margin: 0;
  padding: 0;
  width: 480px;
  height: 320px;
  overflow: scroll;
  white-space: nowrap;
  background: ${ze};
  backdrop-filter: blur( 5px );
  pointer-events: auto;
  resize: both;
`,rx=e=>{const{inspector:t}=(0,i.useContext)(Mb),[n,r]=(0,i.useState)(void 0);return(0,i.useEffect)((()=>{const e=()=>{r(t.gltf.parser.json)};return t.on("load",e),()=>{t.off("load",e)}}),[t]),i.createElement(Rb,Object.assign({},e),i.createElement(nx,null,i.createElement(tx,{value:n})))},ix=Ne.div`
  padding: 8px;
  background: ${ze};
  backdrop-filter: blur( 5px );
`,ox=Ne.select`
  width: 100%;
`,ax=e=>{const{materialDebugger:t}=(0,i.useContext)(Mb),n=(0,i.useCallback)((e=>{const n=parseInt(e.target.value);t.applyMode(n)}),[t]);return i.createElement(Rb,Object.assign({},e),i.createElement(ix,null,i.createElement(ox,{onChange:n},i.createElement("option",{value:db.None},"None"),i.createElement("option",{value:db.MToonNormal},"MToon Normal"),i.createElement("option",{value:db.MToonLitShadeRate},"MToon LitShadeRate"),i.createElement("option",{value:db.MToonUV},"MToon UV"),i.createElement("option",{value:db.UVGrid},"UV Grid"))))},sx=Ne.a`
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  color: #53c5ff;
  vertical-align: top;
  font-weight: bold;
`,lx=Ne.span`
  font-weight: bold;
`,ux=Ne.div`
  line-height: 20px;
`,cx=({children:e})=>null==e?null:i.createElement(sx,{href:e,target:"_blank",rel:"noreferrer noreferrer"},e),hx=({meta:e})=>i.createElement(i.Fragment,null,i.createElement(ux,null,"Title:"," ",i.createElement(lx,null,e.title)),i.createElement(ux,null,"Author:"," ",i.createElement(lx,null,e.author)),i.createElement(ux,null,"Version:"," ",i.createElement(lx,null,e.version)),i.createElement(ux,null,"Reference:"," ",i.createElement(lx,null,e.reference)),i.createElement(ux,null,"Contact Information:"," ",i.createElement(lx,null,e.contactInformation)),i.createElement(ux,null,"Allowed User Name:"," ",i.createElement(lx,null,e.allowedUserName)),i.createElement(ux,null,"Violent Ussage Name:"," ",i.createElement(lx,null,e.violentUssageName)),i.createElement(ux,null,"Sexual Ussage Name:"," ",i.createElement(lx,null,e.sexualUssageName)),i.createElement(ux,null,"Commercial Ussage Name:"," ",i.createElement(lx,null,e.commercialUssageName)),i.createElement(ux,null,"Other Permission URL:"," ",i.createElement(cx,null,e.otherPermissionUrl)),i.createElement(ux,null,"License Name:"," ",i.createElement(lx,null,e.licenseName)),i.createElement(ux,null,"Other License URL:"," ",i.createElement(cx,null,e.otherLicenseUrl))),dx=Ne.a`
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  color: #53c5ff;
  vertical-align: top;
  font-weight: bold;
`,fx=Ne.span`
  font-weight: bold;
`,px=Ne.div`
  line-height: 20px;
`,mx=({children:e})=>null==e?null:i.createElement(dx,{href:e,target:"_blank",rel:"noreferrer noreferrer"},e),gx=({meta:e})=>{var t;return i.createElement(i.Fragment,null,i.createElement(px,null,"Name:"," ",i.createElement(fx,null,e.name)),i.createElement(px,null,"Version:"," ",i.createElement(fx,null,e.version)),i.createElement(px,null,"Authors:"," ",i.createElement(fx,null,e.authors.join(", "))),i.createElement(px,null,"Copyright Information:"," ",i.createElement(fx,null,e.copyrightInformation)),i.createElement(px,null,"Contact Information:"," ",i.createElement(fx,null,e.contactInformation)),i.createElement(px,null,"References:"," ",i.createElement(fx,null,null===(t=e.references)||void 0===t?void 0:t.join(", "))),i.createElement(px,null,"Third Party Licenses:"," ",i.createElement(fx,null,e.thirdPartyLicenses)),i.createElement(px,null,"License URL:"," ",i.createElement(mx,null,e.licenseUrl)),i.createElement(px,null,"Avatar Permission:"," ",i.createElement(fx,null,e.avatarPermission)),i.createElement(px,null,"Allow Excessively Violent Usage:"," ",i.createElement(fx,null,String(e.allowExcessivelyViolentUsage))),i.createElement(px,null,"Allow Excessively Sexual Usage:"," ",i.createElement(fx,null,String(e.allowExcessivelySexualUsage))),i.createElement(px,null,"Commercial Usage Name:"," ",i.createElement(fx,null,e.commercialUsage)),i.createElement(px,null,"Allow Political or Religious Usage:"," ",i.createElement(fx,null,String(e.allowPoliticalOrReligiousUsage))),i.createElement(px,null,"Allow Antisocial or Hate Usage:"," ",i.createElement(fx,null,String(e.allowAntisocialOrHateUsage))),i.createElement(px,null,"Credit Notation:"," ",i.createElement(fx,null,e.creditNotation)),i.createElement(px,null,"Allow Redistribution:"," ",i.createElement(fx,null,String(e.allowRedistribution))),i.createElement(px,null,"Modification:"," ",i.createElement(fx,null,e.modification)),i.createElement(px,null,"Other License URL:"," ",i.createElement(mx,null,e.otherLicenseUrl)))},vx=Ne.div`
  padding: 8px;
  background: ${ze};
  backdrop-filter: blur( 5px );
`,yx=e=>{var t;const{inspector:n}=(0,i.useContext)(Mb),r=null===(t=n.vrm)||void 0===t?void 0:t.meta;let o=i.createElement(i.Fragment,null,"No meta detected.");return"1"===(null==r?void 0:r.metaVersion)?o=i.createElement(gx,{meta:r}):"0"===(null==r?void 0:r.metaVersion)&&(o=i.createElement(hx,{meta:r})),i.createElement(Rb,Object.assign({},e),i.createElement(vx,null,o))},bx=Ne.button`
  display: block;
`,xx=({name:e,url:t})=>{const{inspector:n}=(0,i.useContext)(Mb),r=(0,i.useCallback)((()=>{n.loadVRM(t)}),[n]);return i.createElement(bx,{value:e,onClick:r},e)},_x=[{name:"three-vrm-girl (VRM0.X)",url:yb},{name:"three-vrm-girl (VRM1.0-beta)",url:n.p+"28a18ed70df0c534f8305ab6b6b6dc5f.vrm"}],wx=Ne.div`
  padding: 8px;
  background: ${ze};
  backdrop-filter: blur( 5px );
`,Mx=e=>i.createElement(Rb,Object.assign({},e),i.createElement(wx,null,_x.map((({name:e,url:t})=>i.createElement(xx,{key:e,name:e,url:t}))))),Sx=Ne.span`
  font-weight: bold;
`,Ex=Ne.div`
  line-height: 20px;
`,Tx=Ne.div`
  padding: 8px;
  background: ${ze};
  backdrop-filter: blur( 5px );
`,Ax=e=>{var t,n,r,o,a,s,l,u,c,h;const{inspector:d}=(0,i.useContext)(Mb),f=null===(t=d.stats)||void 0===t?void 0:t.dimension.map((e=>e.toFixed(3)));return i.createElement(Rb,Object.assign({},e),i.createElement(Tx,null,i.createElement(Ex,null,"Dimension:"," ",i.createElement(Sx,null,"( ",null!==(n=null==f?void 0:f[0])&&void 0!==n?n:0,", ",null!==(r=null==f?void 0:f[1])&&void 0!==r?r:0,", ",null!==(o=null==f?void 0:f[2])&&void 0!==o?o:0," )")),i.createElement(Ex,null,"Vertices:"," ",i.createElement(Sx,null,null===(a=d.stats)||void 0===a?void 0:a.vertices)),i.createElement(Ex,null,"Polygons:"," ",i.createElement(Sx,null,null===(s=d.stats)||void 0===s?void 0:s.polygons)),i.createElement(Ex,null,"Meshes:"," ",i.createElement(Sx,null,null===(l=d.stats)||void 0===l?void 0:l.meshes)),i.createElement(Ex,null,"Primitives:"," ",i.createElement(Sx,null,null===(u=d.stats)||void 0===u?void 0:u.primitives)),i.createElement(Ex,null,"Materials:"," ",i.createElement(Sx,null,null===(c=d.stats)||void 0===c?void 0:c.materials)),i.createElement(Ex,null,"Spring Bones:"," ",i.createElement(Sx,null,null===(h=d.stats)||void 0===h?void 0:h.springBones))))},Lx=Ne.span`
`,Rx=Ne.span`
`,Cx=Ne.span`
  color: ${Ue};
`,Px=Ne.div`
  margin-left: 1.13em;
`,Ix=Ne.div`
  font-family: 'Roboto Mono', monospace;
  cursor: pointer;

  &:hover ${Lx} {
    color: ${Fe};
  }
`,kx=e=>{const[t,n]=(0,i.useState)(!1),r=0===e.severity?Be:1===e.severity?He:Ve,o=(0,i.useCallback)((()=>{n(!t)}),[t]);return i.createElement(Ix,{onClick:o},i.createElement(Lx,null,t?"- ":"+ "),i.createElement(Rx,{style:{color:r}},e.code),i.createElement(Cx,null," - "+e.pointer),t&&i.createElement(Px,null,e.message))},Ox=Ne.div`
  width: 100%;
`,Nx=Ne.div`
  width: 100%;
  height: 2px;
  margin: 8px 0;
  background: ${Ue};
`,Dx=Ne.div`
  font-weight: bold;
  margin: 8px;
`,Fx=Ne.span`
  font-weight: bold;
`,Ux=Ne.div`
  line-height: 20px;
`,zx=Ne.div`
  padding: 8px;
  width: 480px;
  height: 320px;
  overflow-y: scroll;
  background: ${ze};
  backdrop-filter: blur( 5px );
  pointer-events: auto;
  resize: both;
`,Bx=e=>{var t,n;const{inspector:r}=(0,i.useContext)(Mb),o=null===(t=r.validationReport)||void 0===t?void 0:t.issues;return i.createElement(Rb,Object.assign({},e),i.createElement(zx,null,i.createElement(Ux,null,"Validator Version:"," ",i.createElement(Fx,null,null===(n=r.validationReport)||void 0===n?void 0:n.validatorVersion)),i.createElement(Ux,null,"Errors:"," ",i.createElement(Fx,{style:{color:(null==o?void 0:o.numErrors)?Be:Ue}},null==o?void 0:o.numErrors)),i.createElement(Ux,null,"Warnings:"," ",i.createElement(Fx,{style:{color:(null==o?void 0:o.numWarnings)?He:Ue}},null==o?void 0:o.numWarnings)),i.createElement(Ux,null,"Infos:"," ",i.createElement(Fx,{style:{color:(null==o?void 0:o.numInfos)?Ve:Ue}},null==o?void 0:o.numInfos)),i.createElement(Ux,null,"Hints:"," ",i.createElement(Fx,{style:{color:(null==o?void 0:o.numHints)?Ve:Ue}},null==o?void 0:o.numHints)),i.createElement(Nx,null),(null==o?void 0:o.truncated)&&i.createElement(Dx,null,"There are too many issues! Showing only 100 entries."),i.createElement(Ox,null,null==o?void 0:o.messages.map(((e,t)=>i.createElement(kx,{key:t,code:e.code,message:e.message,severity:e.severity,pointer:e.pointer}))))))},Hx=()=>{const[e,t]=(0,i.useState)(["jsonTree","materialDebugger","meta","stats","blendShape","validationReport","sampleModels","helpers"]),n=(0,i.useCallback)(((n,r)=>{const i=e.concat();i.splice(e.indexOf(r),1),i.push(r),t(i)}),[e]),r={jsonTree:i.createElement(rx,{key:"jsonTree",paneKey:"jsonTree",title:"JSON Tree",onClick:n,initPosition:{left:0,top:0}}),materialDebugger:i.createElement(ax,{key:"materialDebugger",paneKey:"materialDebugger",title:"MToon Material Debugger",onClick:n,initPosition:{left:0,top:20}}),meta:i.createElement(yx,{key:"meta",paneKey:"meta",title:"Meta",onClick:n,initPosition:{left:0,top:40}}),stats:i.createElement(Ax,{key:"stats",paneKey:"stats",title:"Stats",onClick:n,initPosition:{left:0,top:60}}),blendShape:i.createElement(zb,{key:"blendShape",paneKey:"blendShape",title:"Blend Shape Proxy",onClick:n,initPosition:{left:0,top:80}}),validationReport:i.createElement(Bx,{key:"validationReport",paneKey:"validationReport",title:"Validation Report",onClick:n,initPosition:{left:0,top:100}}),sampleModels:i.createElement(Mx,{key:"sampleModels",paneKey:"sampleModels",title:"Sample Models",onClick:n,initPosition:{left:0,top:120}}),helpers:i.createElement(jb,{key:"helpers",paneKey:"helpers",title:"Helpers",onClick:n,initPosition:{left:0,top:140}})};return i.createElement(i.Fragment,null,e.map((e=>r[e])))},Vx=Ne.div`
  margin: 0;
  padding: 0;
`,Gx=Ne.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  font-family: 'Roboto', sans-serif;
  font-weight: ${300};
  font-size: ${Sb};
  color: ${De};
  text-align: center;
  pointer-events: none;
`,jx=()=>{const{inspector:e}=(0,i.useContext)(Mb),[t,n]=(0,i.useState)(null);(0,i.useEffect)((()=>{const t=()=>{n(null)},r=e=>{n(e)};return e.on("load",t),e.on("progress",r),()=>{e.off("load",t),e.off("progress",r)}}));const r=(0,i.useMemo)((()=>t?t.loaded/t.total:null),[t]);return i.createElement(i.Fragment,null,i.createElement(Gx,null,i.createElement(Vx,null,r?(100*r).toFixed(2):"yay")))},$x=(function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];var o=be.apply(void 0,[e].concat(n)),a="sc-global-"+Se(JSON.stringify(o)),s=new Oe(o,a);function l(e){var t=le(),n=ue(),r=(0,i.useContext)(Ce),o=(0,i.useRef)(t.allocateGSInstance(a)).current;return(0,i.useLayoutEffect)((function(){return u(o,e,t,r,n),function(){return s.removeStyles(o,t)}}),[o,e,t,r,n]),null}function u(e,t,n,r,i){if(s.isStatic)s.renderStyles(e,T,n,i);else{var o=m({},t,{theme:xe(t,r,l.defaultProps)});s.renderStyles(e,o,n,i)}}return i.memo(l)})`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono:400');

  html {
    font-size: ${Sb};
  }

  body {
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }
`,Wx=Ne.canvas`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`,qx=Ne.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  font-weight: ${300};
  color: ${De};
`,Xx=()=>{const{inspector:e}=(0,i.useContext)(Mb),t=(0,i.useCallback)((t=>{t&&e.setup(t)}),[]);return i.createElement(i.Fragment,null,i.createElement(qx,null,i.createElement(Wx,{ref:t}),i.createElement(Hx,null),i.createElement(jx,null)))};var Yx=n(935);const Qx=document.createElement("div");document.body.appendChild(Qx),Yx.render(i.createElement((()=>i.createElement(i.Fragment,null,i.createElement($x,null),i.createElement(Xx,null))),null),Qx)}},t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}return n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),n(484)})()}));