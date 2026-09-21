// Bounded native-plugin correction. No network or MCP requests.
let target, dash, library, vars, styles, before;
const created=[], mutated=[], removed=[];
const snapshot=n=>JSON.stringify([n,...n.findAll()].map(x=>({id:x.id,parent:x.parent.id,name:x.name,bounds:x.absoluteBoundingBox,text:x.type==='TEXT'?x.characters:null,fills:'fills'in x?x.fills:null})));
const track=n=>{created.push(n.id,...('findAll'in n?n.findAll().map(x=>x.id):[]));return n;};
const paint=k=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',vars['color/'+k]);
function gap(n,k,v){n[k]=v;if(vars['space/'+v])n.setBoundVariable(k,vars['space/'+v]);}
function box(parent,name,w,h,dir='VERTICAL'){const n=figma.createFrame();parent.appendChild(n);n.name=name;n.layoutMode=dir;n.resize(w,h);n.fills=[];n.clipsContent=false;return track(n);}
function remove(n){if(!n)return;removed.push(n.id,...('findAll'in n?n.findAll().map(x=>x.id):[]));n.remove();}
function get(name){const n=target.findOne(n=>n.name===name);if(!n)throw Error('Expected layer missing: '+name);return n;}
async function text(n,s,size=14,weight='Regular'){const f={family:'Geist',style:weight};await figma.loadFontAsync(f);n.fontName=f;const style=styles.find(t=>t.name==='Dusk / '+size+' / '+weight);if(style)await n.setTextStyleIdAsync(style.id);n.fontSize=size;n.lineHeight={unit:'PIXELS',value:size===16?24:size===12?16:20};n.characters=s;n.textAutoResize='HEIGHT';mutated.push(n.id);}
async function init(){
 dash=await figma.getNodeByIdAsync('4003:182');target=await figma.getNodeByIdAsync('4019:2890');library=await figma.getNodeByIdAsync('4007:38');
 if(!dash||!target||!library||target.parent!==dash.parent)throw Error('Expected Dusk frames are unavailable');await figma.setCurrentPageAsync(dash.parent);
 before=snapshot(dash);vars=Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map(v=>[v.name,v]));styles=await figma.getLocalTextStylesAsync();
 const fonts=new Map();for(const root of [dash,target,library])for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
 figma.ui.postMessage({status:'Ready',report:{dashboard:dash.id,askDusk:target.id,children:target.children.map(n=>({id:n.id,name:n.name})),navigationSource:'4004:12'}});
}
async function correct(){
 if(target.children.some(n=>n.name==='Ask Dusk / Workspace'))throw Error('Correction already applied; use Verify and export');
 const body=get('Ask Dusk / Message center'),footer=get('Ask Dusk / Persistent composer'),header=get('Ask Dusk / Persistent header'),back=get('Button / Back to dashboard');
 const oldIds=[target,...target.findAll()].map(n=>n.id);
 const workspace=box(target,'Ask Dusk / Workspace',1304,1008);workspace.counterAxisAlignItems='CENTER';
 const actions=box(workspace,'Ask Dusk / Workspace actions',1304,64,'HORIZONTAL');actions.counterAxisAlignItems='CENTER';actions.appendChild(back);back.fills=[];back.strokes=[];
 const viewport=box(workspace,'MessageScroller / Viewport',1304,792);viewport.counterAxisAlignItems='CENTER';viewport.clipsContent=true;viewport.overflowDirection='VERTICAL';viewport.appendChild(body);
 body.name='MessageScroller / Content';body.resize(960,body.height);body.layoutSizingVertical='HUG';gap(body,'paddingTop',16);gap(body,'paddingBottom',24);gap(body,'itemSpacing',24);
 workspace.appendChild(footer);footer.name='InputGroup / Composer dock';footer.resize(960,152);footer.layoutSizingVertical='FIXED';gap(footer,'paddingTop',8);gap(footer,'paddingBottom',8);gap(footer,'itemSpacing',12);
 remove(header);for(const n of [...target.children])if(n!==workspace)remove(n);
 const nav=(await figma.getNodeByIdAsync('4004:12')).clone();target.insertChild(0,nav);track(nav);nav.name='Navigation / Column';
 target.layoutMode='HORIZONTAL';target.resize(1440,1040);target.layoutSizingHorizontal='FIXED';target.layoutSizingVertical='FIXED';target.counterAxisAlignItems='MIN';gap(target,'itemSpacing',16);for(const k of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])gap(target,k,16);target.fills=dash.fills;target.opacity=1;
 nav.resize(88,1008);nav.layoutSizingVertical='FIXED';const primary=nav.children.find(n=>n.name==='Navigation / Primary');if(primary){primary.resize(88,928);primary.layoutSizingVertical='FIXED';const spacer=primary.findOne(n=>n.name==='Navigation / Flexible spacer');if(spacer)spacer.layoutSizingVertical='FILL';}
 remove(get('User identity'));remove(get('Answer / Summary'));remove(get('Evidence timestamp'));remove(get('Suggestions / Helper'));remove(get('Next steps / Guidance'));
 const question=get('Message / User');question.name='Message / align=end';question.counterAxisAlignItems='MAX';question.resize(960,40);question.layoutSizingVertical='HUG';
 const q=get('Question');await text(q,'What happened in the D. Marek payment chain?',14);q.resize(356,20);q.textAutoResize='HEIGHT';
 const bubble=box(question,'Bubble / secondary / BubbleContent',380,40);bubble.layoutSizingVertical='HUG';gap(bubble,'paddingLeft',12);gap(bubble,'paddingRight',12);gap(bubble,'paddingTop',8);gap(bubble,'paddingBottom',8);bubble.fills=[paint('raised')];bubble.cornerRadius=12;for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])bubble.setBoundVariable(k,vars['radius/12']);bubble.appendChild(q);
 // Reusable Figma counterpart of the inspected local shadcn Bubble primitive.
 const component=figma.createComponentFromNode(bubble);library.appendChild(component);component.name='Dusk / Bubble / secondary';component.description='Local shadcn bubble.tsx: Bubble variant=secondary, align=end; BubbleContent px-3 py-2 text-sm rounded-xl. Use within Message align=end.';const prop=component.addComponentProperty('Message','TEXT',q.characters);q.componentPropertyReferences={characters:prop};const instance=component.createInstance();question.appendChild(instance);instance.name='Bubble / secondary';track(component);track(instance);
 const response=get('Message / Dusk structured answer');response.name='Message / align=start / MessageContent';gap(response,'itemSpacing',16);
 await text(get('Answer / Conclusion'),'Dormant access led to two personal transfers and a withdrawal later that day.',16);get('Answer / Conclusion').resize(960,24);get('Answer / Conclusion').textAutoResize='HEIGHT';
 await text(get('Finding confidence'),'91% confidence',12,'Medium');
 const flow=get('Artifact / Marek payment flow');for(const r of flow.children.filter(n=>n.type==='FRAME')){r.resize(960,60);r.layoutSizingVertical='FIXED';}
 await text(get('Business impact'),'Day 9 of notice. Authority dormant for six months was used to access Critical payroll accounts outside Marek’s normal activity.',14);await text(get('Attribution limitation'),'The evidence links the activity, not the person behind each action. Verify session ownership and the beneficiary relationship.',14);
 await text(get('Next steps heading'),'Next steps',14,'Medium');await text(get('Composer / Placeholder'),'Ask Dusk…',14);get('Composer / Empty prompt').name='InputGroup / Textarea + inline-end Send';
 await text(get('Composer / Hint'),'Enter to send · Shift + Enter for a new line',12);mutated.push(...oldIds.filter(id=>!removed.includes(id)));
 // Preserve the destination rather than copying new navigation behavior into the dashboard.
 const dashboardNav=nav.findOne(n=>n.name==='Navigation / Dashboard');if(dashboardNav)await dashboardNav.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dash.id,navigation:'NAVIGATE',transition:null,preserveScrollPosition:true}]}]);
 await verify();
}
async function verify(){
 const all=[target,...target.findAll()];const texts=target.findAllWithCriteria({types:['TEXT']});const prohibited=texts.filter(n=>/vega dynamics|^you$/i.test(n.characters));
 const report={rootId:target.id,frame:target.absoluteBoundingBox,dashboardPreserved:snapshot(dash)===before,columns:target.children.map(n=>({id:n.id,name:n.name,x:n.x,y:n.y,width:n.width,height:n.height})),prohibitedText:prohibited.map(n=>n.id),fontMismatches:texts.filter(n=>n.fontName.family!=='Geist').map(n=>n.id),createdNodeIds:[...new Set(created)],mutatedNodeIds:[...new Set(mutated)],removedNodeIds:[...new Set(removed)],currentNodeIds:all.map(n=>n.id),components:target.findAllWithCriteria({types:['INSTANCE']}).map(n=>({id:n.id,name:n.name})),contentHeight:target.findOne(n=>n.name==='MessageScroller / Content')?.height,viewportHeight:target.findOne(n=>n.name==='MessageScroller / Viewport')?.height};
 if(!report.dashboardPreserved||prohibited.length)throw Error('Preservation or copy check failed');
 figma.ui.postMessage({status:'Corrected: two columns, retained navigation, shadcn chat anatomy, no repeated organization or YOU label.',report});const png=await target.exportAsync({format:'PNG',constraint:{type:'SCALE',value:1}});figma.ui.postMessage({png:Array.from(png),report});figma.currentPage.selection=[target];figma.viewport.scrollAndZoomIntoView([target]);
}
async function updateText(node,value){
 const fonts=new Map(node.getStyledTextSegments(['fontName']).map(s=>[JSON.stringify(s.fontName),s.fontName]));
 await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));node.characters=value;mutated.push(node.id);return node;
}
function svgIcon(name,path,size=16){
 const icon=figma.createNodeFromSvg('<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="'+path+'" stroke="#A3AEA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
 icon.name='Lucide / '+name;icon.resize(size,size);return track(icon);
}
async function fixComments(){
 for(const orphan of figma.currentPage.findAll(n=>n.name==='Lucide / arrow-left'&&!target.findOne(x=>x.id===n.id)))remove(orphan);
 let back=get('Button / Back to dashboard');
 if(back.type==='INSTANCE'){back=back.detachInstance();back.name='Button / Back to dashboard';mutated.push(back.id);}
 if(!back.findOne(n=>n.name==='Lucide / arrow-left'))back.insertChild(0,svgIcon('arrow-left','M19 12H5M12 19l-7-7 7-7'));
 const attribution=get('Answer / Attribution');
 for(const node of attribution.findAll(n=>n.name==='Lucide / sparkles'))remove(node);
 if(!attribution.findOne(n=>n.name==='Dusk / Mark')){const source=await figma.getNodeByIdAsync('4007:40');if(!source)throw Error('The approved Dusk brand mark is unavailable');const mark=source.clone();mark.name='Dusk / Mark';attribution.insertChild(0,mark);mark.resize(20,20);track(mark);}
 const finding=get('Artifact / Finding FND-1042');for(const node of finding.findAll(n=>n.name==='Lucide / arrow-up-right'))remove(node);
 await updateText(get('Evidence coverage'),'Tuesday');
 const flow=get('Artifact / Marek payment flow');for(const node of flow.findAll(n=>n.name==='Lucide / chevron-right'))remove(node);
 const oldMeta=get('Related artifacts / Links'), answer=oldMeta.parent, metaIndex=[...answer.children].indexOf(oldMeta);remove(oldMeta);
 const meta=figma.createFrame();answer.insertChild(metaIndex,meta);meta.name='Case context / Metadata';meta.layoutMode='HORIZONTAL';meta.resize(960,20);meta.layoutSizingHorizontal='FIXED';meta.layoutSizingVertical='HUG';meta.counterAxisAlignItems='CENTER';meta.fills=[];meta.clipsContent=false;gap(meta,'itemSpacing',20);track(meta);
 for(const label of ['Actor: D. Marek','Accounts: 14 critical','Payment flow: 3 events','Case: INV-204 · investigating']){const item=figma.createText();meta.appendChild(item);item.name='Case context / '+label;await text(item,label,12,'Medium');item.fills=[paint('muted')];track(item);}
 const context=get('Answer / Context and uncertainty');context.layoutMode='VERTICAL';context.resize(960,context.height);context.layoutSizingHorizontal='FIXED';context.layoutSizingVertical='HUG';context.counterAxisAlignItems='MIN';gap(context,'itemSpacing',16);mutated.push(context.id);
 for(const sectionName of ['Answer / Why it matters','Answer / Uncertainty']){const section=get(sectionName);section.resize(960,section.height);section.layoutSizingHorizontal='FIXED';section.layoutSizingVertical='HUG';for(const copy of section.findAllWithCriteria({types:['TEXT']})){copy.textAutoResize='HEIGHT';copy.resize(960,copy.height);copy.layoutSizingHorizontal='FIXED';mutated.push(copy.id);}mutated.push(section.id);}
 remove(get('Suggestions / Questions'));const dock=get('InputGroup / Composer dock'), viewport=get('MessageScroller / Viewport');dock.resize(960,104);dock.layoutSizingVertical='FIXED';viewport.resize(1304,840);viewport.layoutSizingVertical='FIXED';mutated.push(dock.id,viewport.id);
 const texts=target.findAllWithCriteria({types:['TEXT']});const checks={dashboardPreserved:snapshot(dash)===before,hasBackArrow:Boolean(back.findOne(n=>n.name==='Lucide / arrow-left')),usesDuskMark:Boolean(attribution.findOne(n=>n.name==='Dusk / Mark')),suggestionsRemoved:!target.findOne(n=>n.name==='Suggestions / Questions'),noAmbiguousEvidenceArrows:flow.findAll(n=>n.name==='Lucide / chevron-right').length===0,noDuplicateEventCount:get('Evidence coverage').characters==='Tuesday',contextIsFullWidth:context.layoutMode==='VERTICAL'&&get('Answer / Why it matters').width===960&&get('Answer / Uncertainty').width===960,noRepeatedOrganizationCopy:!texts.some(n=>/vega dynamics|^you$/i.test(n.characters))};
 if(Object.values(checks).some(v=>!v))throw Error('Comment-fix verification failed: '+JSON.stringify(checks));
 const report={rootId:target.id,checks,createdNodeIds:[...new Set(created)],mutatedNodeIds:[...new Set(mutated)],removedNodeIds:[...new Set(removed)]};const png=await target.exportAsync({format:'PNG',constraint:{type:'SCALE',value:1}});figma.ui.postMessage({status:'Applied the Ask Dusk comment fixes and verified the scoped frame.',report,png:Array.from(png)});figma.currentPage.selection=[target];figma.viewport.scrollAndZoomIntoView([target]);
}
async function setDeepLink(node,destinationId){
 await node.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'URL',url:'https://www.figma.com/design/ZyQUty3B29ozTpl26B6mvm/src2cart?node-id='+destinationId.replace(':','-')}]}]);mutated.push(node.id);
}
async function redesignResponse(){
 const response=get('Message / align=start / MessageContent'), flow=target.findOne(n=>n.name==='Evidence / Causal chain'||n.name==='Artifact / Marek payment flow');
 if(!flow)throw Error('The payment-chain structure is unavailable');
 const addText=async(parent,name,value,size=14,weight='Regular',color='foreground',width=null)=>{const n=figma.createText();parent.appendChild(n);n.name=name;await text(n,value,size,weight);n.fills=[paint(color)];if(width){n.resize(width,Math.max(20,n.height));n.textAutoResize='HEIGHT';n.layoutSizingHorizontal='FIXED';}return track(n);};
 const reset=(node,name,w,dir='VERTICAL')=>{for(const child of [...node.children])remove(child);node.name=name;node.layoutMode=dir;node.resize(w,32);node.layoutSizingHorizontal='FIXED';node.layoutSizingVertical='HUG';node.primaryAxisSizingMode='AUTO';node.counterAxisAlignItems='MIN';node.fills=[];node.strokes=[];node.clipsContent=false;gap(node,'itemSpacing',8);mutated.push(node.id);return node;};
 let decision=target.findOne(n=>n.name==='Answer / Decision');if(!decision){decision=figma.createFrame();response.insertChild(0,decision);track(decision);}
 let direct=target.findOne(n=>n.name==='Answer / Summary'||n.name==='Answer / Direct answer'||n.name==='Answer / Conclusion');if(!direct){direct=figma.createText();response.insertChild(Math.min(1,response.children.length),direct);track(direct);}
 reset(decision,'Answer / Decision',960);gap(decision,'paddingTop',24);gap(decision,'paddingRight',28);gap(decision,'paddingBottom',24);gap(decision,'paddingLeft',28);decision.fills=[paint('raised')];decision.cornerRadius=16;
 await addText(decision,'Decision / Eyebrow','RECOMMENDED ACTION',12,'Medium','accent',904);
 const decisionTitle=await addText(decision,'Decision / Title','Restrict D. Marek’s payroll access now',26,'Medium','foreground',904);decisionTitle.lineHeight={unit:'PIXELS',value:34};
 await addText(decision,'Decision / Action','Temporarily remove approver authority from 14 critical payroll accounts and open INV-204.',16,'Regular','foreground',904);
 await addText(decision,'Decision / Guardrail','This contains the risk while ownership of the session and beneficiary is verified. It is not a fraud determination.',14,'Regular','muted',904);
 decision.resize(960,184);decision.layoutSizingVertical='FIXED';decision.primaryAxisAlignItems='MIN';
 await updateText(direct,'The access, transfer, and cash-out events happened in sequence on Tuesday. That sequence is why Dusk recommends a temporary restriction.');direct.name='Answer / Summary';direct.resize(960,direct.height);direct.textAutoResize='HEIGHT';direct.fontSize=16;direct.lineHeight={unit:'PIXELS',value:24};mutated.push(direct.id);
 const finding=target.findOne(n=>n.name==='Assessment / Signal'||n.name==='Artifact / Finding FND-1042');if(!finding)throw Error('The assessment signal is unavailable');reset(finding,'Assessment / Signal',960,'HORIZONTAL');gap(finding,'paddingTop',12);gap(finding,'paddingRight',16);gap(finding,'paddingBottom',12);gap(finding,'paddingLeft',16);finding.fills=[paint('raised')];finding.cornerRadius=12;gap(finding,'itemSpacing',14);
 await addText(finding,'Assessment / Label','DUSK ASSESSMENT',12,'Medium','accent');await addText(finding,'Assessment / Value','High-risk diversion pattern',16,'Medium','foreground');await addText(finding,'Assessment / Confidence','91% confidence · 3 linked events',13,'Regular','muted');await setDeepLink(finding,'4008:2659');
 for(const divider of response.findAll(n=>n.name==='Divider'))remove(divider);
 await updateText(get('Evidence title'),'How the events connect');
 const events=[
  {name:'Event / Tue 09:12',time:'09:12',index:'01',title:'Dormant access resumed',detail:'Marek’s approver authority reactivated after six months and reached 14 critical payroll accounts.',impact:'Creates the unusual access condition.',destination:'4008:1148'},
  {name:'Event / Tue 09:40',time:'09:40',index:'02',title:'Funds left payroll',detail:'Two transfers moved to an unregistered personal account outside Marek’s normal activity.',impact:'Introduces a beneficiary connection.',destination:'4008:1851'},
  {name:'Event / Tue 22:07',time:'22:07',index:'03',title:'Funds converted to cash',detail:'The beneficiary withdrew the transferred funds later that day.',impact:'Reduces recovery and completes the path.',destination:'4008:2659'}
 ];
 const rows=events.map(e=>({event:e,node:flow.findOne(n=>n.name===e.name)}));if(rows.some(x=>!x.node))throw Error('One or more event cards are missing');
 for(const {node} of rows)flow.appendChild(node);
 for(const child of [...flow.children])if(!rows.some(x=>x.node===child))remove(child);
 flow.name='Evidence / Causal chain';flow.layoutMode='VERTICAL';flow.resize(960,32);flow.layoutSizingHorizontal='FIXED';flow.layoutSizingVertical='HUG';flow.primaryAxisSizingMode='AUTO';flow.counterAxisAlignItems='MIN';flow.fills=[];gap(flow,'itemSpacing',12);mutated.push(flow.id);
 const chainTitle=await addText(flow,'Causal chain / Definition','RECORDED EVENTS · EACH CARD LINKS TO ITS SOURCE',12,'Medium','muted',960);
 const chain=figma.createFrame();flow.appendChild(chain);chain.name='Causal chain / Cards';chain.layoutMode='HORIZONTAL';chain.resize(960,274);chain.layoutSizingHorizontal='FIXED';chain.layoutSizingVertical='FIXED';chain.counterAxisAlignItems='CENTER';chain.fills=[];chain.clipsContent=false;gap(chain,'itemSpacing',12);track(chain);
 for(let i=0;i<rows.length;i++){
  const {event,node}=rows[i];reset(node,event.name,296);gap(node,'paddingTop',18);gap(node,'paddingRight',18);gap(node,'paddingBottom',18);gap(node,'paddingLeft',18);node.fills=[paint('raised')];node.cornerRadius=14;await setDeepLink(node,event.destination);
  const top=figma.createFrame();node.appendChild(top);top.name='Event / Identifier';top.layoutMode='HORIZONTAL';top.resize(260,18);top.layoutSizingHorizontal='FIXED';top.layoutSizingVertical='FIXED';top.counterAxisAlignItems='CENTER';top.fills=[];gap(top,'itemSpacing',8);track(top);
  await addText(top,'Event / Number',event.index,12,'Medium','accent');await addText(top,'Event / Time',event.time+' · EVENT',12,'Medium','muted');
  const title=await addText(node,'Event / Title',event.title,18,'Medium','foreground',260);title.lineHeight={unit:'PIXELS',value:24};
  await addText(node,'Event / Fact',event.detail,14,'Regular','muted',260);
  await addText(node,'Event / Impact label','WHY IT CHANGES THE DECISION',12,'Medium','accent',260);
  await addText(node,'Event / Impact',event.impact,14,'Medium','foreground',260);
  const source=await addText(node,'Evidence / Open source','View event source ↗',13,'Medium','accent',260);await setDeepLink(source,event.destination);
  chain.appendChild(node);
  if(i<rows.length-1){const arrow=svgIcon('arrow-right','M5 12h14M13 6l6 6-6 6',20);chain.appendChild(arrow);arrow.name='Causal chain / Connection '+(i+1);}
 }
 const meta=response.findOne(n=>n.name==='Action scope / Metadata');if(meta)remove(meta);
 const assessment=response.findOne(n=>n.name==='Answer / Assessment'||n.name==='Assessment / Why act'), verification=response.findOne(n=>n.name==='Answer / Verification needed'||n.name==='Assessment / Verify');if(!assessment||!verification)throw Error('The assessment structure is unavailable');
 const context=assessment.parent;const anchor=context?.parent===response?context:assessment;
 let clarity=response.findOne(n=>n.name==='Assessment / Clarification');if(!clarity){clarity=figma.createFrame();response.insertChild(Math.max(0,[...response.children].indexOf(anchor)),clarity);track(clarity);}reset(clarity,'Assessment / Clarification',960,'HORIZONTAL');gap(clarity,'itemSpacing',16);clarity.counterAxisAlignItems='MIN';
 reset(assessment,'Assessment / Why act',472);gap(assessment,'paddingTop',18);gap(assessment,'paddingRight',20);gap(assessment,'paddingBottom',18);gap(assessment,'paddingLeft',20);assessment.fills=[paint('raised')];assessment.cornerRadius=14;await addText(assessment,'Assessment / Title','Why act now',16,'Medium','foreground',432);await addText(assessment,'Assessment / Copy','Unusual access enabled the transfer. The same-day withdrawal makes the funds harder to recover.',14,'Regular','muted',432);
 reset(verification,'Assessment / Verify',472);gap(verification,'paddingTop',18);gap(verification,'paddingRight',20);gap(verification,'paddingBottom',18);gap(verification,'paddingLeft',20);verification.fills=[paint('raised')];verification.cornerRadius=14;await addText(verification,'Verification / Title','Verify before escalation',16,'Medium','foreground',432);await addText(verification,'Verification / Copy','Confirm session ownership and the beneficiary relationship before expanding access restrictions or classifying fraud.',14,'Regular','muted',432);
 clarity.appendChild(assessment);clarity.appendChild(verification);if(context&&context!==response&&context.children.length===0)remove(context);
 await updateText(get('Next steps heading'),'Take action');await setDeepLink(get('Button / Open INV-204'),'4008:2659');await setDeepLink(get('Button / Review payment chain'),flow.id);await setDeepLink(get('Button / Inspect account access'),'4008:1148');
 const texts=target.findAllWithCriteria({types:['TEXT']});const cards=chain.children.filter(n=>n.name&&n.name.startsWith('Event / Tue'));
 const checks={dashboardPreserved:snapshot(dash)===before,decisionDominates:decision.height>=170&&decision.findOne(n=>n.name==='Decision / Title').fontSize===26,horizontalCausalChain:cards.length===3&&chain.layoutMode==='HORIZONTAL',eachEventHasFactImpactAndSource:cards.every(n=>n.findOne(x=>x.name==='Event / Fact')&&n.findOne(x=>x.name==='Event / Impact')&&n.findOne(x=>x.name==='Evidence / Open source')),factAndAssessmentSeparated:texts.some(n=>n.characters==='RECORDED EVENTS · EACH CARD LINKS TO ITS SOURCE')&&texts.some(n=>n.characters==='DUSK ASSESSMENT'),noSuggestions:!target.findOne(n=>n.name==='Suggestions / Questions')};
 if(Object.values(checks).some(v=>!v))throw Error('Second-pass redesign verification failed: '+JSON.stringify(checks));
 const report={rootId:target.id,checks,createdNodeIds:[...new Set(created)],mutatedNodeIds:[...new Set(mutated)],removedNodeIds:[...new Set(removed)]};const png=await target.exportAsync({format:'PNG',constraint:{type:'SCALE',value:1}});figma.ui.postMessage({status:'Recomposed Ask Dusk around a large decision and a causal event chain.',report,png:Array.from(png)});figma.currentPage.selection=[target];figma.viewport.scrollAndZoomIntoView([target]);
}
async function polishContrast(){
 const response=get('Message / align=start / MessageContent');
 await updateText(get('Decision / Eyebrow'),'WHAT HAPPENED');
 await updateText(get('Decision / Title'),'Three linked events occurred in the D. Marek payment chain');
 await updateText(get('Decision / Action'),'Dormant payroll authority resumed, funds moved to an unregistered personal account, then the beneficiary withdrew them the same day.');
 await updateText(get('Decision / Guardrail'),'The events and timing are confirmed. The actor behind each action is still being verified.');
 await updateText(get('Answer / Summary'),'The evidence chain below links directly to the underlying account, payment, and withdrawal records.');
 await updateText(get('Next steps heading'),'Safeguard');
 const white={type:'SOLID',color:{r:0.92,g:0.95,b:0.93}};
 const muted={type:'SOLID',color:{r:0.64,g:0.69,b:0.66}};
 const lime={type:'SOLID',color:{r:0.68,g:1,b:0.33}};
 const ids=[];
 for(const node of response.findAllWithCriteria({types:['TEXT']})){
   const n=node.name;
   const accent=/Eyebrow|Assessment \/ Label|Event \/ Number|Impact label|Open source/.test(n);
   const secondary=/Guardrail|Confidence|Event \/ Fact|Definition|Assessment \/ Copy|Verification \/ Copy|Event \/ Time/.test(n);
   node.fills=[accent?lime:secondary?muted:white];ids.push(node.id);
 }
 const decision=get('Answer / Decision');decision.strokes=[{type:'SOLID',color:{r:0.2,g:0.27,b:0.23},opacity:1}];decision.strokeWeight=1;ids.push(decision.id);
 const chain=get('Causal chain / Cards');chain.strokes=[{type:'SOLID',color:{r:0.16,g:0.22,b:0.19},opacity:1}];chain.strokeWeight=1;ids.push(chain.id);
 const report={rootId:target.id,contrast:'Corrected primary, muted, and accent text contrast',mutatedNodeIds:ids};
 const png=await target.exportAsync({format:'PNG',constraint:{type:'SCALE',value:1}});
 figma.ui.postMessage({status:'Applied accessible contrast to the decision, evidence, and action hierarchy.',report,png:Array.from(png)});
 figma.currentPage.selection=[target];figma.viewport.scrollAndZoomIntoView([target]);
}
figma.showUI('<body style="font:13px system-ui;padding:12px"><button id="correct">Apply scoped correction</button> <button id="comments">Redesign Ask Dusk</button> <button id="verify">Verify and export</button> <button id="close">Close</button><p id="status"></p><div id="files"></div><textarea id="report" aria-label="Correction audit" style="width:100%;height:200px"></textarea><script>for(const id of ["correct","comments","verify","close"])document.getElementById(id).onclick=()=>parent.postMessage({pluginMessage:id},"*");onmessage=e=>{const m=e.data.pluginMessage;if(m.status)document.getElementById("status").textContent=m.status;if(m.report)document.getElementById("report").value=JSON.stringify(m.report);if(m.png){document.getElementById("files").innerHTML="";for(const [name,data,type]of [["Ask-Dusk-corrected.png",new Uint8Array(m.png),"image/png"],["ask-dusk-corrected-audit.json",JSON.stringify(m.report,null,2),"application/json"]]){const a=document.createElement("a");a.download=name;a.href=URL.createObjectURL(new Blob([data],{type}));a.textContent="Save "+name;a.style.display="block";document.getElementById("files").appendChild(a);}}};</script>',{width:600,height:360,title:'Ask Dusk correction'});
let busy=true;figma.ui.onmessage=async m=>{if(m==='close'){figma.closePlugin();return;}if(busy)return;busy=true;try{await(m==='correct'?correct():m==='comments'?polishContrast():verify());}catch(e){figma.ui.postMessage({status:e.message});}finally{busy=false;}};
init().then(()=>busy=false).catch(e=>figma.ui.postMessage({status:e.message}));
