// Native desktop Plugin API only. No MCP, fetch, credentials, or network calls.
let dashboard, page, lib, root, body, answer, before, variables, textStyles;
let stage = 0;
const created = [], changed = [], removed = [];
const remember = n => { created.push(n.id); if ('findAll' in n) created.push(...n.findAll().map(c => c.id)); return n; };
const snapshot = n => JSON.stringify([n,...n.findAll()].map(x=>({id:x.id,name:x.name,type:x.type,parent:x.parent.id,bounds:x.absoluteBoundingBox,characters:x.type==='TEXT'?x.characters:undefined,fills:'fills' in x?x.fills:undefined})));
const paint = k => figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',variables['color/'+k]);
function space(n,k,v){ n[k]=v; if(variables['space/'+v])n.setBoundVariable(k,variables['space/'+v]); }
function round(n,v){n.cornerRadius=v;for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])n.setBoundVariable(k,variables['radius/'+v]);}
function frame(p,name,w,dir='VERTICAL',gap=16,pad=0,h){const n=figma.createFrame();p.appendChild(n);n.name=name;n.layoutMode=dir;n.resize(w,h||40);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical=h?'FIXED':'HUG';n.fills=[];n.clipsContent=false;space(n,'itemSpacing',gap);for(const k of ['paddingLeft','paddingRight','paddingTop','paddingBottom'])space(n,k,pad);return remember(n);}
function txt(p,name,s,size=14,weight='Regular',color='text',w){const n=figma.createText();p.appendChild(n);n.name=name;n.fontName={family:'Geist',style:weight};n.fontSize=size;n.lineHeight={unit:'PIXELS',value:size===24?32:size===16?24:size===12?16:20};n.fills=[paint(color)];n.textAutoResize=w?'HEIGHT':'WIDTH_AND_HEIGHT';if(w)n.resize(w,24);n.characters=s;return remember(n);}
function icon(p,k,color='muted',size=16){const n=figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="#A3AEA7" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+ICONS[k]+'</svg>');p.appendChild(n);n.name='Lucide / '+k;for(const v of n.findAll()){v.name='Lucide / '+k+' / Path';if('strokes'in v)v.strokes=v.strokes.map(s=>s.type==='SOLID'?paint(color):s);}return remember(n);}
function row(p,name,w,gap=8,h){const n=frame(p,name,w,'HORIZONTAL',gap,0,h);n.counterAxisAlignItems='CENTER';return n;}
function divider(p,w){const n=figma.createRectangle();p.appendChild(n);n.name='Divider';n.resize(w,1);n.fills=[paint('border')];return remember(n);}
function badge(p,label,tone='muted'){const c=lib.findOne(n=>n.type==='COMPONENT'&&n.name==='Dusk / Badge / '+tone);if(!c)throw Error('Badge component missing: '+tone);const n=c.createInstance();p.appendChild(n);const k=Object.keys(c.componentPropertyDefinitions).find(k=>k.startsWith('Label#'));n.setProperties({[k]:label});n.name='Badge / '+label;return remember(n);}
function button(p,label,w=180,primary=false){const c=lib.findOne(n=>n.type==='COMPONENT'&&n.name==='Dusk / Button / outline / Icon and label');if(!c)throw Error('Existing Dusk button missing');const n=c.createInstance();p.appendChild(n);n.name='Button / '+label;const k=Object.keys(c.componentPropertyDefinitions).find(k=>k.startsWith('Label#'));n.setProperties({[k]:label});const ico=n.findOne(x=>x.type==='FRAME'&&x.name.includes('Lucide'));if(ico)ico.visible=false;n.resize(w,36);if(primary){n.fills=[paint('accent')];for(const t of n.findAllWithCriteria({types:['TEXT']}))t.fills=[paint('background')];}return remember(n);}
function nodeLink(n,id){n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'URL',url:'https://www.figma.com/design/ZyQUty3B29ozTpl26B6mvm/src2cart?node-id='+id.replace(':','-')}]}]);}
async function init(){
 dashboard=await figma.getNodeByIdAsync('4003:182');if(!dashboard||dashboard.name!=='Dusk / Payment intelligence / Dashboard')throw Error('Open src2cart: expected dashboard 4003:182 is missing');page=dashboard.parent;await figma.setCurrentPageAsync(page);
 lib=await figma.getNodeByIdAsync('4007:38');if(!lib)throw Error('Dusk design-system frame is missing');
 variables=Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map(v=>[v.name,v]));textStyles=await figma.getLocalTextStylesAsync();
 const fontMap=new Map();for(const t of lib.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fontMap.set(JSON.stringify(s.fontName),s.fontName);await Promise.all([...fontMap.values()].map(f=>figma.loadFontAsync(f)));await Promise.all(['Regular','Medium'].map(style=>figma.loadFontAsync({family:'Geist',style})));
 before=snapshot(dashboard);
 const existing=page.children.find(n=>n.name==='Dusk / Ask Dusk / Marek investigation');if(existing){if(existing.id==='4019:2890'){root=existing;if(root.findOne(n=>n.name==='Ask Dusk / Persistent composer'))stage=5;else if(existing.findAll().length!==4)throw Error('Incomplete Ask Dusk frame requires inspection');}else throw Error('Existing Ask Dusk frame '+existing.id+'; refusing to duplicate or overwrite it.');}
 report('Ready: dashboard verified; local Dusk tokens, Geist, buttons and badges available.');
}
async function shell(){
 const x=dashboard.x+dashboard.width+160,y=dashboard.y;
 if(page.children.some(n=>n!==dashboard&&n!==root&&n.x<x+1440&&n.x+n.width>x&&n.y<y+1400&&n.y+n.height>y))throw Error('The space immediately right of the dashboard is occupied');
 if(root){removed.push(...root.findAll().map(n=>n.id));for(const child of [...root.children])child.remove();changed.push(root.id);}else root=frame(page,'Dusk / Ask Dusk / Marek investigation',1440,'VERTICAL',0);root.x=x;root.y=y;root.fills=[paint('background')];root.clipsContent=true;
 const header=row(root,'Ask Dusk / Persistent header',1440,16,80);space(header,'paddingLeft',32);space(header,'paddingRight',32);header.fills=[paint('surface')];
 const brand=(await figma.getNodeByIdAsync('4007:40')).clone();header.appendChild(brand);remember(brand);
 txt(header,'Identity','Dusk',24,'Medium');txt(header,'Workspace identity','/   Ask Dusk',16,'Medium','muted');const spacer=frame(header,'Flexible header space',100);spacer.layoutSizingHorizontal='FILL';
 txt(header,'Scope','Vega Dynamics  ·  Last 7 days',12,'Regular','muted');
 const back=button(header,'Back to dashboard',184);await back.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dashboard.id,navigation:'NAVIGATE',transition:null,preserveScrollPosition:true}]}]);
 divider(root,1440);body=frame(root,'Ask Dusk / Message center',960,'VERTICAL',24,0);root.counterAxisAlignItems='CENTER';space(body,'paddingTop',32);space(body,'paddingBottom',32);
 const q=frame(body,'Message / User',960,'VERTICAL',8);txt(q,'User identity','YOU',12,'Medium','muted');txt(q,'Question','What happened in the D. Marek payment chain?',24,'Medium');
 answer=frame(body,'Message / Dusk structured answer',960,'VERTICAL',16);stage=1;report('Shell complete. Dashboard unchanged.');
}
async function summary(){
 const by=row(answer,'Answer / Attribution',960);icon(by,'sparkles','accent',20);txt(by,'Answer identity','Dusk',14,'Medium');txt(by,'Evidence timestamp','Based on linked activity through Tue 22:07',12,'Regular','muted');
 txt(answer,'Answer / Conclusion','Dormant access led to two personal transfers\nand a withdrawal later that day.',24,'Medium','text',960);
 txt(answer,'Answer / Summary','Three linked events connect unusual access to Critical accounts, an unregistered beneficiary and a withdrawal from a new device and geography.',16,'Regular','muted',900);
 const finding=row(answer,'Artifact / Finding FND-1042',960,12,48);badge(finding,'Fraudulent','fraud');txt(finding,'Finding confidence','91% finding confidence',14,'Medium');txt(finding,'Finding link','FND-1042  ·  3 linked events',12,'Regular','muted');icon(finding,'arrow-up-right');
 const target=dashboard.findOne(n=>n.name.includes('Findings / Row 1'));if(target)await finding.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'URL',url:'https://www.figma.com/design/ZyQUty3B29ozTpl26B6mvm/src2cart?node-id='+target.id.replace(':','-')}]}]);
 divider(answer,960);stage=2;report('Structured conclusion and finding confidence complete.');
}
async function evidence(){
 const h=row(answer,'Evidence / Heading',960);txt(h,'Evidence title','Evidence trail',16,'Medium');txt(h,'Evidence coverage','Tuesday  ·  3 linked events',12,'Regular','muted');
 const timeline=frame(answer,'Artifact / Marek payment flow',960,'VERTICAL',0);timeline.fills=[paint('surface')];timeline.strokes=[paint('border')];round(timeline,12);
 const events=[['09:12','key-round','Dormant authority reactivated','14 Critical accounts accessed · 12× normal activity'],['09:40','arrow-up-right','Two transfers to a personal beneficiary','Unregistered external account · outside normal payroll activity'],['22:07','landmark','Funds withdrawn','New device and geography · funds have already left the account']];
 for(const [time,key,title,detail]of events){const r=row(timeline,'Event / Tue '+time,960,16,76);space(r,'paddingLeft',24);space(r,'paddingRight',24);txt(r,'Event timestamp',time,14,'Medium','muted',56);icon(r,key,'muted',20);const c=frame(r,'Event / Details',768,'VERTICAL',4);txt(c,'Event / Title',title,14,'Medium');txt(c,'Event / Evidence',detail,12,'Regular','muted');icon(r,'chevron-right');if(time!=='22:07')divider(timeline,960);}
 const artifacts=row(answer,'Related artifacts / Links',960,8);for(const [label,w]of [['D. Marek · Actor',168],['14 Critical accounts',184],['Payment flow · 3 events',220],['INV-204 · Investigating',228]])button(artifacts,label,w);
 stage=3;report('Evidence trail and related artifact controls complete.');
}
async function reasoning(){
 const pair=row(answer,'Answer / Context and uncertainty',960,24);pair.counterAxisAlignItems='MIN';
 const why=frame(pair,'Answer / Why it matters',468,'VERTICAL',8);txt(why,'Section title','Why it matters',16,'Medium');txt(why,'Business impact','Marek is on day 9 of a 30-day notice period. Authority granted six months ago became active against high-value payroll accounts outside his normal access pattern.',14,'Regular','muted',452);
 const uncertain=frame(pair,'Answer / Uncertainty',468,'VERTICAL',8);txt(uncertain,'Section title','What remains uncertain',16,'Medium');txt(uncertain,'Attribution limitation','The chain supports the finding, but does not establish who personally performed each action. Confirm session ownership and the beneficiary relationship.',14,'Regular','muted',452);
 divider(answer,960);const next=frame(answer,'Answer / Recommended next steps',960,'VERTICAL',12);txt(next,'Next steps heading','Continue the investigation',16,'Medium');
 const actions=row(next,'Next steps / Actions',960,8);button(actions,'Open INV-204',164,true);button(actions,'Review payment chain',204);button(actions,'Inspect account access',216);
 txt(next,'Next steps / Guidance','Review session evidence and dormant approvals in INV-204 before deciding on access restrictions.',12,'Regular','muted',940);
 stage=4;report('Impact, uncertainty and recommended next steps complete.');
}
async function composer(){
 divider(root,1440);const footer=frame(root,'Ask Dusk / Persistent composer',960,'VERTICAL',12,0);space(footer,'paddingTop',24);space(footer,'paddingBottom',24);
 txt(footer,'Suggestions / Helper','Explore findings, activity, accounts and actors',12,'Regular','muted');const chips=row(footer,'Suggestions / Questions',960,8);button(chips,'Why is risk elevated?',200);button(chips,'What changed during notice?',260);button(chips,'Find unusual beneficiaries',244);
 const input=row(footer,'Composer / Empty prompt',960,12,64);space(input,'paddingLeft',16);space(input,'paddingRight',12);round(input,12);input.fills=[paint('inset')];input.strokes=[paint('border')];
 icon(input,'sparkles','accent',20);txt(input,'Composer / Placeholder','Ask about your payment environment…',16,'Regular','muted',828);const submit=row(input,'Composer / Send disabled',36,0,36);submit.primaryAxisAlignItems='CENTER';submit.fills=[paint('raised')];round(submit,8);icon(submit,'arrow-up','quiet');
 const help=row(footer,'Composer / Keyboard help',960);txt(help,'Composer / Hint','Enter to send  ·  Shift + Enter for a new line',12,'Regular','muted');
 stage=5;report('Ask Dusk complete. Ready for visual verification.');figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([root]);
}
function report(message){
 const preserved=snapshot(dashboard)===before;
 const audit={message,stage,rootId:root?root.id:null,dashboardPreserved:preserved,frame:root?{x:root.x,y:root.y,width:root.width,height:root.height}:null,createdNodeIds:[...new Set(created)],mutatedNodeIds:[...new Set(changed)],removedPartialNodeIds:removed,fontMismatches:root?root.findAllWithCriteria({types:['TEXT']}).filter(n=>n.fontName.family!=='Geist').map(n=>n.id):[]};
 if(!preserved)throw Error('Dashboard preservation check failed');
 figma.ui.postMessage({type:'report',audit});
}
async function finalize(){
 if(stage!==5||root.id!=='4019:2890')throw Error('Expected completed Ask Dusk frame missing');
 root.opacity=1;changed.push(root.id);
 for(const n of root.findAllWithCriteria({types:['TEXT']})){
  const size=n.fontSize,weight=n.fontName.style;const style=textStyles.find(s=>s.name==='Dusk / '+size+' / '+weight);
  if(style)await n.setTextStyleIdAsync(style.id);
  if(n.name==='Answer / Conclusion'||n.name==='Answer / Summary'||n.name==='Business impact'||n.name==='Attribution limitation'||n.name==='Next steps / Guidance')n.textAutoResize='HEIGHT';
  changed.push(n.id);
 }
 const targets={'Button / D. Marek · Actor':'4008:1851','Button / 14 Critical accounts':'4008:1148','Button / INV-204 · Investigating':'4008:2659','Button / Open INV-204':'4008:2659','Button / Inspect account access':'4008:1148'};
 const flow=root.findOne(n=>n.name==='Artifact / Marek payment flow');
 targets['Button / Payment flow · 3 events']=flow.id;targets['Button / Review payment chain']=flow.id;
 for(const [name,id]of Object.entries(targets)){const n=root.findOne(n=>n.name===name);if(n){await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'URL',url:'https://www.figma.com/design/ZyQUty3B29ozTpl26B6mvm/src2cart?node-id='+id.replace(':','-')}]}]);changed.push(n.id);}}
 report('Finalized typography and linked artifacts. Dashboard preserved.');
 const audit={rootId:root.id,dashboardPreserved:snapshot(dashboard)===before,frame:root.absoluteBoundingBox,createdNodeIds:[root.id,...root.findAll().map(n=>n.id)],mutatedNodeIds:[...new Set(changed)],dashboardMutatedNodeIds:[],removedPartialNodeIds:['4019:2891','4019:2892','4019:2893','4019:2894'],fonts:[...new Set(root.findAllWithCriteria({types:['TEXT']}).map(n=>n.fontName.family))],links:targets};
 const png=await root.exportAsync({format:'PNG',constraint:{type:'SCALE',value:1}});
 figma.ui.postMessage({type:'export',png:Array.from(png),audit});
 figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([root]);
}
figma.showUI('<html><body style="font:13px system-ui;padding:12px"><h3>Ask Dusk · Local builder</h3><p>No network access. Existing dashboard is read-only.</p><button id="next">Build next section</button> <button id="finalize">Finalize and export</button> <button id="focus">View frame</button> <button id="close">Close</button><pre id="status"></pre><div id="downloads"></div><textarea aria-label="Ask Dusk audit" id="report" style="width:100%;height:210px" readonly></textarea><script>for(const id of ["next","finalize","focus","close"])document.getElementById(id).onclick=()=>parent.postMessage({pluginMessage:{type:id}},"*");onmessage=e=>{const m=e.data.pluginMessage;if(m.type==="export"){document.getElementById("report").value=JSON.stringify(m.audit);for(const [name,data,type]of [["Ask-Dusk.png",new Uint8Array(m.png),"image/png"],["ask-dusk-audit.json",JSON.stringify(m.audit,null,2),"application/json"]]){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.textContent="Save "+name;a.style.marginRight="20px";document.getElementById("downloads").appendChild(a);}}else if(m.type==="report"){document.getElementById("report").value=JSON.stringify(m.audit);document.getElementById("status").textContent=m.audit.message;document.getElementById("next").disabled=m.audit.stage>=5;}else document.getElementById("status").textContent=m.error;};</script></body></html>',{width:600,height:420,title:'Ask Dusk local builder'});
let busy=true;
figma.ui.onmessage=async m=>{if(m.type==='close'){figma.closePlugin();return;}if(m.type==='focus'&&root){figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([root]);return;}if(!['next','finalize'].includes(m.type)||busy)return;busy=true;try{if(m.type==='finalize')await finalize();else await [shell,summary,evidence,reasoning,composer][stage]();}catch(e){figma.ui.postMessage({type:'error',error:e.message});}finally{busy=false;}};
 init().then(()=>{busy=false;}).catch(e=>figma.ui.postMessage({type:'error',error:e.message}));
