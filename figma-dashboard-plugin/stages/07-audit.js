async function main(){
 await setup();
 const cardShell=lib.findOne(n=>n.type==='COMPONENT'&&n.name==='Dusk / Card');cardShell.strokesIncludedInLayout=false;
 for(const n of root.findAllWithCriteria({types:['INSTANCE']}))if(n.name.endsWith('/ Card'))n.strokesIncludedInLayout=false;
 const accountRow=lib.findOne(n=>n.type==='COMPONENT'&&n.name==='Dusk / TableRow / Accounts');accountRow.children[3].resize(104,accountRow.children[3].height);accountRow.children[4].resize(56,accountRow.children[4].height);
 const accountHead=lib.findOne(n=>n.name==='Accounts / Column headers');accountHead.children[3].resize(104,accountHead.children[3].height);accountHead.children[4].resize(56,accountHead.children[4].height);
 const org=root.findOne(n=>n.name==='Workspace / Organization switcher');if(org){const p=org.parent,i=p.children.indexOf(org);org.remove();const spacer=F(p,'Shell / Flexible header space',184,'HORIZONTAL',0,0,48);p.insertChild(i,spacer);}
 const findings=get('Priority findings / Card');const fh=findings.children[0];const title=Object.keys(fh.componentProperties).find(k=>k.startsWith('Title#'));fh.setProperties({[title]:'Findings'});
 const cols={Findings:['Finding','Actor','Verdict','Confidence','Open finding'],Accounts:['Account','Value tier','Access exposure','Risk score','Open account'],'Activity paths':['Actor group','Account category','Observed activity','Event verdicts','Open activity'],Actors:['Actor','Risk signal','Risk score','Open actor'],Signals:['Detected','Signal','Update type','Open signal'],Investigations:['Investigation','Owner','Status','Open case']};
 for(const [key,names]of Object.entries(cols)){
   const c=lib.findOne(n=>n.type==='COMPONENT'&&n.name==='Dusk / TableRow / '+key);if(!c)continue;
   c.children.forEach((cell,i)=>{cell.name=key+' / '+names[i];[...cell.children].forEach(n=>{if(n.type==='TEXT'&&!n.characters){n.remove();return;}if(n.type==='TEXT')n.name=key+' / '+names[i]+' / '+(n.name.includes('Secondary')||n.name.endsWith('/ Context')?'Context':'Value');else if(n.type==='INSTANCE')n.name=key+' / '+names[i]+' / Badge';});});
 }
 for(const n of root.findAllWithCriteria({types:['TEXT']})) if(n.name.endsWith('/ Column /'))n.name=n.name+' Row action';
 const local=await figma.getLocalTextStylesAsync();const textStyleMap={};
 const allTexts=[...root.findAllWithCriteria({types:['TEXT']}),...lib.findAllWithCriteria({types:['TEXT']})];
 for(const t of allTexts){if(t.fontName===figma.mixed)continue;const name='Dusk / '+t.fontSize+' / '+t.fontName.style;let s=textStyleMap[name]||local.find(s=>s.name===name);if(!s){s=figma.createTextStyle();s.name=name;s.fontName=t.fontName;s.fontSize=t.fontSize;s.lineHeight=t.lineHeight;}textStyleMap[name]=s;await t.setTextStyleIdAsync(s.id);}
 for(const name of ['Dashboard / Priority overview','Dashboard / Account exposure','Dashboard / Actor and automation exposure','Dashboard / Activity and investigations']){const r=get(name);const h=Math.max(...r.children.map(n=>n.height));r.children.forEach(n=>{n.resize(n.width,h);n.layoutSizingVertical='FIXED';});}
 const visible=n=>{let p=n;while(p&&p!==page){if('visible'in p&&!p.visible)return false;p=p.parent;}return true;};
 const nodes=root.findAll().filter(visible);const texts=nodes.filter(n=>n.type==='TEXT');
 const badNames=nodes.filter(n=>!n.name.trim()||/^(Frame|Text|Rectangle|Vector|Ellipse|Group|Instance) \d+$/.test(n.name)).map(n=>({id:n.id,name:n.name}));
 const overflow=[];
 for(const n of nodes){if(!['TEXT','FRAME','INSTANCE'].includes(n.type)||n.name.includes('/ Lucide /')||n.name.includes('/ Path ')||n.name.includes('/ Segment ')||n.layoutPositioning==='ABSOLUTE')continue;const p=n.parent;if(!p||p===page||!('width'in p)||p.type==='GROUP'||n.rotation)continue;if(n.x<-.5||n.y<-.5||n.x+n.width>p.width+.5||n.y+n.height>p.height+.5)overflow.push({id:n.id,name:n.name,parent:p.name,bounds:[n.x,n.y,n.width,n.height],parentSize:[p.width,p.height]});}
 const banned=texts.filter(n=>/exercise|supplied|synthetic|not provided|sample|no case records|historical data unavailable/i.test(n.characters)).map(n=>n.characters);
 const wrongFonts=texts.filter(n=>n.fontName===figma.mixed||n.fontName.family!==font).map(n=>({id:n.id,name:n.name,font:n.fontName}));
 root.exportSettings=[{format:'PNG',constraint:{type:'SCALE',value:1},suffix:'-revised'}];
 lib.expanded=false;root.expanded=false;figma.currentPage.selection=[root];figma.viewport.scrollAndZoomIntoView([root]);
 const report={rootId:root.id,size:[root.width,root.height],font,visibleLayers:nodes.length,widgets:root.findAllWithCriteria({types:['INSTANCE']}).filter(n=>n.name.endsWith('/ Card')).map(n=>({name:n.name,id:n.id,width:n.width,height:n.height})),badNames,overflow,banned,wrongFonts,styles:Object.keys(textStyleMap),componentCount:lib.findAllWithCriteria({types:['COMPONENT']}).length};
 console.log('DUSK_FINAL_AUDIT',JSON.stringify(report));
 figma.showUI('<html><body style="font:12px system-ui;margin:16px"><h3>Dashboard layout audit</h3><textarea aria-label="Audit report" readonly style="box-sizing:border-box;width:100%;height:280px">'+JSON.stringify(report,null,2).replaceAll('&','&amp;').replaceAll('<','&lt;')+'</textarea><button id="close" style="margin-top:12px">Close audit</button><script>document.getElementById("close").onclick=()=>parent.postMessage({pluginMessage:{type:"close"}},"*");</script></body></html>',{width:600,height:400,title:'Dusk dashboard audit'});
 figma.ui.onmessage=m=>{if(m.type==='close')figma.closePlugin('Dashboard audit complete');};
}
