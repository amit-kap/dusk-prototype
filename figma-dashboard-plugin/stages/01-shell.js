async function main(){
 await setup();
 root.resize(1440,root.height);root.fills=[paint('background')];root.layoutMode='VERTICAL';root.layoutSizingVertical='HUG';spacing(root,'itemSpacing',16);for(const p of ['paddingLeft','paddingRight','paddingTop','paddingBottom'])spacing(root,p,16);
 const head=get('Shell / Global header');clear(head);head.resize(1408,64);head.layoutSizingHorizontal='FIXED';head.layoutSizingVertical='FIXED';spacing(head,'itemSpacing',16);head.counterAxisAlignItems='CENTER';
 const brand=F(head,'Brand / Dusk mark',88,'VERTICAL',0,0,64);brand.primaryAxisAlignItems='CENTER';brand.counterAxisAlignItems='CENTER';
 const mark=figma.createNodeFromSvg('<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path fill="#B7F76B" d="M4 20a14 14 0 0 1 28 0H4Zm0 4h28v3H4Zm5 7h18v3H9Z"/></svg>');brand.appendChild(mark);mark.name='Brand / Dusk horizon';mark.findAll().forEach((n,i)=>n.name='Brand / Horizon path '+(i+1));
 const bar=row(head,'Shell / Global actions',1304,16,64);
 const ask=row(bar,'Ask Dusk / Global input',944,12,48);ask.fills=[paint('surface')];ask.strokes=[paint('border')];radius(ask,12);spacing(ask,'paddingLeft',16);spacing(ask,'paddingRight',8);icon(ask,'Ask Dusk / Agent icon','sparkles',20,'accent');const text=T(ask,'Ask Dusk / Placeholder','Ask Dusk about findings, accounts, or activity…',14,'Regular','muted',700);text.layoutSizingHorizontal='FILL';T(ask,'Ask Dusk / Keyboard shortcut','⌘ K',12,'Regular','quiet');ib(ask,'Ask Dusk / Submit','arrow-up','background','accent');
 const scope=row(bar,'Workspace / Organization switcher',184,8,48);icon(scope,'Workspace','building-2',16);T(scope,'Workspace / Organization','Vega Dynamics',14,'Medium');icon(scope,'Workspace','chevron-down',16);
 Button(bar,'Dashboard / Time range','Last 7 days','calendar-days','outline',144);
 const workspace=get('Shell / Workspace');workspace.resize(1408,workspace.height);spacing(workspace,'itemSpacing',16);
 const nav=get('Navigation / Primary');clear(nav);nav.resize(88,832);nav.layoutSizingVertical='FIXED';nav.layoutSizingHorizontal='FIXED';nav.layoutMode='VERTICAL';spacing(nav,'itemSpacing',8);for(const p of ['paddingLeft','paddingRight','paddingTop','paddingBottom'])spacing(nav,p,8);nav.fills=[];nav.strokes=[];nav.effects=[];radius(nav,16);
 for(const [label,key] of [['Dashboard','layout-dashboard'],['Findings','shield-alert'],['Cases','folder-search'],['Accounts','landmark'],['Actors','users'],['Automations','bot']]){
  const f=F(lib,'Dusk / Nav item / '+label,72,'VERTICAL',4,8,64);f.counterAxisAlignItems='CENTER';f.primaryAxisAlignItems='CENTER';radius(f,8);f.fills=label==='Dashboard'?[paint('accent-soft')]:[];icon(f,'Navigation / '+label,key,20,label==='Dashboard'?'accent':'muted');T(f,'Navigation / '+label+' / Label',label,12,'Medium',label==='Dashboard'?'accent':'muted');const c=componentize(f,'Dusk / Nav item / '+label,'Floating sidebar navigation, icon above label. Destination: '+(label==='Cases'?'Investigations':label)+'.');instance(c,nav,'Navigation / '+label);
 }
 const gap=F(nav,'Navigation / Flexible spacer',72,'VERTICAL',0,0,244);gap.layoutSizingVertical='FILL';
 const settings=F(nav,'Navigation / Settings',72,'VERTICAL',4,8,64);settings.counterAxisAlignItems='CENTER';settings.primaryAxisAlignItems='CENTER';icon(settings,'Navigation / Settings','settings-2',20);T(settings,'Navigation / Settings / Label','Settings',12,'Medium','muted');
 const profile=F(nav,'Account / Carla Rivas',72,'VERTICAL',4,8,64);profile.counterAxisAlignItems='CENTER';profile.primaryAxisAlignItems='CENTER';const pic=figma.createEllipse();profile.appendChild(pic);pic.name='Account / Profile photo';pic.resize(32,32);pic.fills=[{type:'IMAGE',imageHash:figma.createImage(figma.base64Decode(AVATAR)).hash,scaleMode:'FILL'}];T(profile,'Account / Profile / Label','Carla',12,'Medium','muted');
 const intro=get('Dashboard / Page introduction');intro.visible=false;
 const main=get('Dashboard / Main content');main.resize(1304,main.height);main.layoutSizingHorizontal='FIXED';spacing(main,'itemSpacing',16);
 finish('Header and floating navigation updated',head);
}
