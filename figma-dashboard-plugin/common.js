// Runs in the native Figma development plugin. No MCP or network calls.
let root,page,lib,vars,font,styles;
const made = [], changed = [];
const C = {background:'#0C0F0E',surface:'#141917',inset:'#101411',raised:'#1D2520',text:'#F1F5F2',muted:'#A3AEA7',quiet:'#718078',border:'#2C3831',accent:'#B7F76B','accent-soft':'#253622',fraud:'#FF8B87','fraud-soft':'#382322',warning:'#E9BB73','warning-soft':'#352D20',legitimate:'#74CDA9','legitimate-soft':'#1D332A',chart:'#B7F76B','chart-quiet':'#536B5E'};
const rgb = hex => ({r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255});
async function setup() {
  root=await figma.getNodeByIdAsync('4003:182');
  if(!root || root.name!=='Dusk / Payment intelligence / Dashboard') throw Error('Expected Dusk dashboard missing');
  page=root.parent; await figma.setCurrentPageAsync(page);
  const fonts=await figma.listAvailableFontsAsync();
  font=fonts.some(f=>f.fontName.family==='Geist'&&f.fontName.style==='Regular')?'Geist':'Inter';
  styles={};
  for(const [key,candidates] of Object.entries({Regular:['Regular'],Medium:['Medium'],Semibold:['SemiBold','Semi Bold','Semibold'],Bold:['Bold']})) {
    const found=fonts.find(f=>f.fontName.family===font&&candidates.includes(f.fontName.style));
    if(!found) throw Error('Missing '+font+' '+key);
    styles[key]=found.fontName;
  }
  await Promise.all(Object.values(styles).map(x=>figma.loadFontAsync(x)));
  const oldFonts=new Map();
  for(const t of root.findAllWithCriteria({types:['TEXT']})) for(const s of t.getStyledTextSegments(['fontName'])) oldFonts.set(JSON.stringify(s.fontName),s.fontName);
  await Promise.all([...oldFonts.values()].map(f=>figma.loadFontAsync(f)));
  let coll=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name==='Dusk');
  if(!coll) throw Error('Existing Dusk tokens missing');
  vars=Object.fromEntries((await figma.variables.getLocalVariablesAsync()).filter(v=>v.variableCollectionId===coll.id).map(v=>[v.name,v]));
  for(const [name,value] of Object.entries(C)) {
    let v=vars['color/'+name];
    if(!v) {v=figma.variables.createVariable('color/'+name,coll,'COLOR');vars[v.name]=v;}
    v.scopes=['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];v.setValueForMode(coll.defaultModeId,rgb(value));v.setVariableCodeSyntax('WEB','var(--'+({text:'foreground',surface:'card',accent:'primary',muted:'muted-foreground',fraud:'destructive'}[name]||name)+')');
  }
  for(const value of [0,4,8,12,16,24,32,40,48,64]) if(!vars['space/'+value]) {let v=figma.variables.createVariable('space/'+value,coll,'FLOAT');v.scopes=['GAP'];v.setValueForMode(coll.defaultModeId,value);v.setVariableCodeSyntax('WEB','var(--space-'+value+')');vars[v.name]=v;}
  for(const value of [8,12,16]) if(!vars['radius/'+value]) {let v=figma.variables.createVariable('radius/'+value,coll,'FLOAT');v.scopes=['CORNER_RADIUS'];v.setValueForMode(coll.defaultModeId,value);v.setVariableCodeSyntax('WEB','var(--radius-'+value+')');vars[v.name]=v;}
  lib=page.children.find(n=>n.name==='Dusk / Components / shadcn');
  if(!lib) {lib=F(page,'Dusk / Components / shadcn',1040,'VERTICAL',24,24);lib.x=root.x+root.width+240;lib.y=root.y;lib.fills=[paint('background')];}
}
const paint = key => figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(C[key])},'color',vars['color/'+key]);
function spacing(n,p,v){n[p]=v;if(vars['space/'+v])n.setBoundVariable(p,vars['space/'+v]);}
function radius(n,v){n.cornerRadius=v;for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])if(vars['radius/'+v])n.setBoundVariable(k,vars['radius/'+v]);}
function F(parent,name,w,dir='VERTICAL',gap=0,pad=0,h=null){let n=figma.createFrame();parent.appendChild(n);n.name=name;n.layoutMode=dir;n.resize(w,h||1);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical=h?'FIXED':'HUG';n.fills=[];n.clipsContent=false;spacing(n,'itemSpacing',gap);for(const p of ['paddingLeft','paddingRight','paddingTop','paddingBottom'])spacing(n,p,pad);made.push(n.id);return n;}
function T(parent,name,value,size=14,weight='Regular',color='text',width=0){let n=figma.createText();parent.appendChild(n);n.name=name;n.fontName=styles[weight];n.characters=value;n.fontSize=size;n.lineHeight={unit:'PIXELS',value:({11:16,12:16,14:20,16:24,18:28,20:28,24:32,30:36,36:40,48:52,60:64}[size]||Math.round(size*1.4))};n.fills=[paint(color)];if(width){n.resize(width,1);n.textAutoResize='HEIGHT';}else n.textAutoResize='WIDTH_AND_HEIGHT';made.push(n.id);return n;}
function get(name){const n=root.findOne(n=>n.name===name);if(!n)throw Error('Missing '+name);return n;}
function clear(n){for(const c of [...n.children])c.remove();changed.push(n.id);}
function row(parent,name,w,gap=8,h=null){const n=F(parent,name,w,'HORIZONTAL',gap,0,h);n.counterAxisAlignItems='CENTER';return n;}
function line(parent,name,w){const n=figma.createRectangle();parent.appendChild(n);n.name=name;n.resize(w,1);n.fills=[paint('border')];made.push(n.id);return n;}
function icon(parent,name,key,size=20,color='muted'){
 const n=figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${C[color]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICONS[key]}</svg>`);
 parent.appendChild(n);n.name=name+' / Lucide / '+key;n.findAll().forEach((v,i)=>{v.name=name+' / '+key+' / Path '+(i+1);if('strokes'in v&&Array.isArray(v.strokes))v.strokes=v.strokes.map(p=>p.type==='SOLID'?figma.variables.setBoundVariableForPaint(p,'color',vars['color/'+color]):p);if('fills'in v&&Array.isArray(v.fills))v.fills=v.fills.map(p=>p.type==='SOLID'?figma.variables.setBoundVariableForPaint(p,'color',vars['color/'+color]):p);});made.push(n.id);return n;
}
function componentize(n,name,description){const c=figma.createComponentFromNode(n);c.name=name;c.description=description;made.push(c.id);return c;}
function labelProp(c,node,key='Label'){const p=c.addComponentProperty(key,'TEXT',node.characters);node.componentPropertyReferences={characters:p};return p;}
function instance(c,parent,name,properties={}){const n=c.createInstance();parent.appendChild(n);n.name=name;if(Object.keys(properties).length)n.setProperties(properties);made.push(n.id);return n;}
function Button(parent,name,label,key=null,variant='outline',w=0){
 const cname='Dusk / Button / '+variant+' / '+(key||'Label');
 let c=lib.findOne(x=>x.type==='COMPONENT'&&x.name===cname);
 if(!c){const f=row(lib,cname,150,8,36);spacing(f,'paddingLeft',12);spacing(f,'paddingRight',12);radius(f,8);f.primaryAxisAlignItems='CENTER';f.fills=variant==='primary'?[paint('accent')]:variant==='ghost'?[]:[paint('inset')];f.strokes=variant==='outline'?[paint('border')]:[];if(key)icon(f,'Button / Icon',key,16,variant==='primary'?'background':'muted');T(f,'Button / Label',label,14,'Medium',variant==='primary'?'background':'text');c=componentize(f,cname,'Maps to shadcn Button: variant='+variant+', size=lg.');labelProp(c,c.findOne(x=>x.type==='TEXT'));}
 const p=Object.keys(c.componentPropertyDefinitions).find(k=>k.startsWith('Label#'));const n=instance(c,parent,name,{[p]:label});
 const oldIcon=n.findOne(x=>x.type==='FRAME'&&x.name.includes('/ Lucide /'));
 if(key&&oldIcon&& !oldIcon.name.endsWith(key)){/* Icon differences use distinct named source components below. */}
 n.resize(w||Math.max(80,label.length*7+24+(key?24:0)),36);return n;
}
function ib(parent,name,key,color='muted',bg=null,size=32){const n=row(parent,name,size,0,size);n.primaryAxisAlignItems='CENTER';if(bg)n.fills=[paint(bg)];radius(n,8);icon(n,name,key,16,color);return n;}
function Badge(parent,name,label,tone='muted',dot=true){const cname='Dusk / Badge / '+tone;let c=lib.findOne(x=>x.type==='COMPONENT'&&x.name===cname);if(!c){const f=row(lib,cname,110,4,24);spacing(f,'paddingLeft',8);spacing(f,'paddingRight',8);radius(f,8);f.fills=[paint(tone==='muted'?'raised':tone+'-soft')];if(dot){const d=figma.createEllipse();f.appendChild(d);d.name='Badge / Status dot';d.resize(4,4);d.fills=[paint(tone)];}T(f,'Badge / Label',label,12,'Medium',tone==='muted'?'muted':tone);f.layoutSizingHorizontal='HUG';c=componentize(f,cname,'Maps to shadcn Badge with a semantic color token and text label.');labelProp(c,c.findOne(n=>n.type==='TEXT'));}const p=Object.keys(c.componentPropertyDefinitions).find(k=>k.startsWith('Label#'));return instance(c,parent,name,{[p]:label});}
function header(parent,title,w,action='ellipsis'){let c=lib.findOne(n=>n.type==='COMPONENT'&&n.name==='Dusk / CardHeader');if(!c){const f=row(lib,'Dusk / CardHeader',400,8,32);const t=T(f,'CardHeader / Title','Widget title',16,'Medium','text',300);t.layoutSizingHorizontal='FILL';ib(f,'CardHeader / Menu','ellipsis');c=componentize(f,'Dusk / CardHeader','Shared shadcn CardHeader and CardTitle. All dashboard widgets use this exact instance.');labelProp(c,c.findOne(x=>x.name==='CardHeader / Title'),'Title');}const p=Object.keys(c.componentPropertyDefinitions).find(k=>k.startsWith('Title#'));const n=instance(c,parent,title+' / CardHeader',{[p]:title});n.resize(w,32);return n;}
function card(parent,name,w,h=null){const n=F(parent,name,w,'VERTICAL',16,24,h);n.fills=[paint('surface')];n.strokes=[paint('border')];radius(n,12);return n;}
function footer(parent,name,w,label='View all',count=''){const n=row(parent,name,w,8,32);const t=T(n,name+' / Count',count,12,'Regular','muted',w-144);t.layoutSizingHorizontal='FILL';const action=row(n,name+' / Action',136,8,32);action.primaryAxisAlignItems='MAX';T(action,name+' / Label',label,12,'Medium','text');icon(action,name,'arrow-right',16);return n;}
function finish(message,focus=root){lib.expanded=false;figma.currentPage.selection=[focus];figma.viewport.scrollAndZoomIntoView([focus]);const bad=root.findAll().filter(n=>!n.name.trim()||/^(Frame|Text|Rectangle|Vector|Ellipse|Group|Instance) \d+$/.test(n.name));console.log('DUSK_STAGE',JSON.stringify({message,rootId:root.id,font,created:made,changed,unnamed:bad.map(n=>n.id),size:[root.width,root.height]}));figma.closePlugin(message+' · '+font+' · '+bad.length+' unnamed layers');}
function replaceExact(name,w){const old=get(name),p=old.parent,i=p.children.indexOf(old);const n=card(p,name,w);p.insertChild(i,n);old.remove();return n;}
function mountWidget(n){
 const parent=n.parent,index=parent.children.indexOf(n),w=n.width,name=n.name;
 const body=F(lib,'Dusk / Widget content / '+name,w-48,'VERTICAL',16);
 const head=n.children[0];for(const child of [...n.children].slice(1))body.appendChild(child);
 const content=componentize(body,'Dusk / Widget content / '+name,'Product-specific widget content, inserted into shared Card through a nested component swap.');
 let shell=lib.findOne(x=>x.type==='COMPONENT'&&x.name==='Dusk / Card');
 if(!shell){const f=card(lib,'Dusk / Card',400);const h=header(f,'Widget',352);h.layoutSizingHorizontal='FILL';const b=instance(content,f,'Card / Content');b.resize(352,b.height);b.layoutSizingHorizontal='FILL';shell=componentize(f,'Dusk / Card','Maps to shadcn Card, CardHeader, CardContent and CardFooter. Shared padding, border, radius and typography across every dashboard widget.');}
 const inst=instance(shell,parent,name);parent.insertChild(index,inst);inst.resize(w,inst.height);inst.layoutSizingVertical='HUG';
 const h=inst.children[0];const p=Object.keys(h.componentProperties).find(k=>k.startsWith('Title#'));const oldp=Object.keys(head.componentProperties).find(k=>k.startsWith('Title#'));h.setProperties({[p]:head.componentProperties[oldp].value});
 const slot=inst.children[1];slot.swapComponent(content);slot.layoutSizingHorizontal='FILL';slot.layoutSizingVertical='HUG';n.remove();return inst;
}
function chartSvg(parent,name,svg,w,h){const n=figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>`);parent.appendChild(n);n.name=name;n.findAll().forEach((c,i)=>c.name=name+' / Segment '+(i+1));made.push(n.id);return n;}
function table(parent,key,width,columns,rows){
 const head=row(parent,key+' / Column headers',width,16,24);
 columns.forEach(c=>T(head,key+' / Column / '+c.label,c.label,12,'Medium','muted',c.w));
 const list=F(parent,key+' / Rows',width,'VERTICAL',0);
 let source=null;
 rows.forEach((data,index)=>{
  if(!source){
   const r=row(lib,'Dusk / TableRow / '+key,width,16,56);
   columns.forEach((col,i)=>{const cell=F(r,'Cell / '+i,col.w,'VERTICAL',0);const d=data[i];if(d.badge){Badge(cell,'Cell / '+i+' / Badge',d.text,d.tone||'muted');if(d.sub!==undefined)T(cell,'Cell / '+i+' / Secondary',d.sub,12,'Regular','muted',col.w);}else{T(cell,'Cell / '+i+' / Primary',d.text||'',14,i===0?'Medium':'Regular',d.tone||'text',col.w);if(d.sub!==undefined)T(cell,'Cell / '+i+' / Secondary',d.sub,12,'Regular','muted',col.w);if(d.icon)icon(cell,'Cell / '+i,d.icon,16,'muted');}});
   source=componentize(r,'Dusk / TableRow / '+key,'Shared table row for '+key+'. Maps to shadcn TableRow/TableCell. Entire row opens the corresponding detail.');
   for(const t of source.findAllWithCriteria({types:['TEXT']}))if(!t.name.includes('Badge / Label'))labelProp(source,t,t.name.replaceAll(' / ',' '));
  }
  const n=instance(source,list,key+' / Row '+(index+1)+' / '+data[0].text);
  data.forEach((d,i)=>{
   const props={};for(const [pk,pv]of Object.entries(n.componentProperties)){if(pk.startsWith('Cell '+i+' Primary#'))props[pk]=d.text||'';if(pk.startsWith('Cell '+i+' Secondary#'))props[pk]=d.sub||'';}if(Object.keys(props).length)n.setProperties(props);
   if(d.badge){const b=n.findOne(x=>x.name==='Cell / '+i+' / Badge');const tmp=F(lib,'Badge / Temporary source',120);const target=Badge(tmp,'Badge / Template',d.text,d.tone||'muted');b.swapComponent(lib.findOne(x=>x.type==='COMPONENT'&&x.name==='Dusk / Badge / '+(d.tone||'muted')));const bp=Object.keys(b.componentProperties).find(k=>k.startsWith('Label#'));b.setProperties({[bp]:d.text});tmp.remove();}
   else {const t=n.findOne(x=>x.name==='Cell / '+i+' / Primary');if(t)t.fills=[paint(d.tone||'text')];}
  });
  if(index<rows.length-1)line(list,key+' / Divider '+(index+1),width);
 });return list;
}
