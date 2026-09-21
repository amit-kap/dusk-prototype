// Reparent existing layers only. Preserve live content, geometry, and component instances.
async function main(){
 const root=await figma.getNodeByIdAsync('4003:182');
 if(!root||root.name!=='Dusk / Payment intelligence / Dashboard')throw Error('Expected dashboard missing');
 const ids={left:'4004:12',right:'4004:13',brand:'4007:39',nav:'4004:14',actions:'4007:42',main:'4004:15',ask:'4007:43',spacer:'4009:2831'};
 const nodes={};
 for(const [key,id]of Object.entries(ids)){
  const n=await figma.getNodeByIdAsync(id);
  if(!n||n.type!=='FRAME')throw Error('Required frame missing: '+key);
  let p=n;while(p&&p!==root)p=p.parent;if(!p)throw Error('Frame outside dashboard: '+key);
  nodes[key]=n;
 }
 const {left,right,brand,nav,actions,main,ask,spacer}=nodes;
 const original=root.children.length===2&&left.children.length===2&&left.children.includes(brand)&&left.children.includes(actions)&&right.children.length===2&&right.children.includes(nav)&&right.children.includes(main);
 const updated=root.children.length===2&&left.children.length===2&&left.children.includes(brand)&&left.children.includes(nav)&&right.children.length===2&&right.children.includes(actions)&&right.children.includes(main);
 if(!original&&!updated)throw Error('Dashboard hierarchy changed; inspect before regrouping');
 const visible=n=>{let p=n;while(p&&p!==root.parent){if('visible'in p&&!p.visible)return false;p=p.parent;}return true;};
 const all=[root,...root.findAll()];
 const before=new Map(all.filter(visible).map(n=>[n.id,{name:n.name,bounds:n.absoluteBoundingBox}]));
 const fontMap=new Map();
 for(const n of all)if(n.type==='TEXT')for(const s of n.getStyledTextSegments(['fontName']))fontMap.set(JSON.stringify(s.fontName),s.fontName);
 await Promise.all([...fontMap.values()].map(f=>figma.loadFontAsync(f)));
 const rootBounds={...root.absoluteBoundingBox};
 const leftWidth=brand.width,rightWidth=main.width;
 const verticalGap=original?root.itemSpacing:left.itemSpacing;
 const horizontalGap=original?right.itemSpacing:root.itemSpacing;
 const leftHeight=brand.height+verticalGap+nav.height;
 const rightHeight=actions.height+verticalGap+main.height;

 root.layoutSizingVertical='FIXED';
 left.layoutSizingHorizontal='FIXED';left.layoutSizingVertical='FIXED';
 right.layoutSizingHorizontal='FIXED';right.layoutSizingVertical='FIXED';
 left.layoutMode='VERTICAL';right.layoutMode='VERTICAL';
 left.resize(leftWidth,leftHeight);right.resize(rightWidth,rightHeight);
 right.insertChild(0,actions);left.appendChild(nav);
 left.insertChild(0,brand);right.insertChild(1,main);
 root.layoutMode='HORIZONTAL';root.itemSpacing=horizontalGap;
 root.primaryAxisAlignItems='MIN';root.counterAxisAlignItems='MIN';
 for(const n of [left,right]){
  n.itemSpacing=verticalGap;n.primaryAxisAlignItems='MIN';n.counterAxisAlignItems='MIN';
  n.fills=[];n.strokes=[];n.effects=[];n.clipsContent=false;
  n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';
 }
 left.name='Navigation / Column';right.name='Dashboard / Workspace';
 actions.name='Dashboard / Actions';ask.name='Ask Dusk / Dashboard input';spacer.name='Dashboard / Flexible action space';
 nav.fills=[];nav.strokes=[];nav.effects=[];
 root.resize(rootBounds.width,rootBounds.height);root.layoutSizingHorizontal='FIXED';root.layoutSizingVertical='HUG';

 const after=[root,...root.findAll()];
 const removed=all.filter(n=>!after.some(a=>a.id===n.id)).map(n=>n.id);
 const created=after.filter(n=>!before.has(n.id)&&visible(n)).map(n=>n.id);
 const moved=[];
 for(const n of after.filter(visible)){
  if(n===left||n===right)continue;
  const prior=before.get(n.id),b=n.absoluteBoundingBox;
  if(!prior||!prior.bounds||!b)continue;
  const delta=Object.fromEntries(['x','y','width','height'].map(k=>[k,b[k]-prior.bounds[k]]));
  if(Object.values(delta).some(v=>Math.abs(v)>.1))moved.push({id:n.id,name:n.name,delta});
 }
 const badNames=after.filter(n=>!n.name.trim()||/^(Frame|Text|Rectangle|Vector|Ellipse|Group|Instance) \d+$/.test(n.name)).map(n=>({id:n.id,name:n.name}));
 const describe=n=>({id:n.id,name:n.name,layout:n.layoutMode,bounds:n.absoluteBoundingBox,children:n.children.map(c=>({id:c.id,name:c.name}))});
 const report={status:!removed.length&&!created.length&&!moved.length&&!badNames.length?'PASS':'REVIEW',root:describe(root),left:describe(left),right:describe(right),createdNodeIds:created,removedNodeIds:removed,mutatedNodeIds:[root.id,...Object.values(ids)],unexpectedGeometryChanges:moved,badNames,visibleLayerCount:after.filter(visible).length,navAppearance:{fills:nav.fills.length,strokes:nav.strokes.length,effects:nav.effects.length}};
 root.expanded=true;left.expanded=true;right.expanded=true;brand.expanded=false;nav.expanded=false;actions.expanded=false;main.expanded=false;
 figma.currentPage.selection=[left,right];
 figma.viewport.zoom=.6;figma.viewport.center={x:rootBounds.x+rootBounds.width/2,y:rootBounds.y+430};
 figma.showUI('<html><body style="font:12px system-ui;margin:16px"><h3>Dashboard columns: '+report.status+'</h3><textarea aria-label="Column audit report" readonly style="box-sizing:border-box;width:100%;height:330px">'+JSON.stringify(report,null,2).replaceAll('&','&amp;').replaceAll('<','&lt;')+'</textarea><button id="close" style="margin-top:12px">Close audit</button><script>document.getElementById("close").onclick=()=>parent.postMessage({pluginMessage:{type:"close"}},"*");</script></body></html>',{width:640,height:450,title:'Dashboard column verification'});
 figma.ui.onmessage=m=>{if(m.type==='close')figma.closePlugin('Dashboard columns updated · '+report.status);};
}
