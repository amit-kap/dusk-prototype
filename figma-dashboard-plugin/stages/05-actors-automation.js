async function main(){
 await setup();
 const pair=get('Dashboard / Actor and automation exposure');pair.resize(1304,pair.height);spacing(pair,'itemSpacing',16);
 const actors=replaceExact('Anomalous actors / Card',644);header(actors,'Actors to review',596);
 table(actors,'Actors',596,[{label:'Actor',w:216},{label:'Risk signal',w:224},{label:'Risk',w:76},{label:'',w:32}],[
 [{text:'D. Marek',sub:'Employee · Finance'},{text:'Dormant privileges activated',sub:'Notice period · 12× normal volume'},{text:'88',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
 [{text:'j.doe.personal@gmail',sub:'External beneficiary'},{text:'Unregistered personal account',sub:'New device and geography'},{text:'81',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
 [{text:'L. Chen',sub:'External collaborator'},{text:'Vendor bank details changed',sub:'New beneficiary before payout'},{text:'76',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
 [{text:'svc-settle-03',sub:'Service account'},{text:'Settlement scope expanded',sub:'Credential used outside policy'},{text:'64',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
 [{text:'agent-treasury',sub:'AI agent'},{text:'Counterparty outside baseline',sub:'Activity outside normal hours'},{text:'58',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}]
 ]);footer(actors,'Actors / Footer',596,'View all actors','5 actors require review');const actorInst=mountWidget(actors);
 const automation=replaceExact('Automation exposure / Card',644);header(automation,'Automation exposure',596);
 const metrics=row(automation,'Automation / Metrics',596,32,68);
 const one=F(metrics,'Automation / Activity share',272,'VERTICAL',4);T(one,'Automation / Share value','29%',36,'Medium');T(one,'Automation / Share label','Automated share of activity',12,'Regular','muted');
 const two=F(metrics,'Automation / Flagged events',272,'VERTICAL',4);T(two,'Automation / Flagged count','2',36,'Medium','warning');T(two,'Automation / Flagged label','Flagged automated events',12,'Regular','muted');
 const chart=F(automation,'Automation / Seven week comparison',596,'VERTICAL',4);
 const top=row(chart,'Automation / Chart legend',596,16,24);T(top,'Automation / Trend period','7-week trend',12,'Medium','muted',160);for(const [label,tone]of [['Automated','accent'],['Flagged','warning']]){const item=row(top,'Automation / Legend '+label,128,8,20);const dot=figma.createEllipse();item.appendChild(dot);dot.name='Automation / '+label+' / Legend dot';dot.resize(6,6);dot.fills=[paint(tone)];T(item,'Automation / '+label+' / Legend label',label,12,'Regular','muted');}
 const plot=F(chart,'Automation / Plot',596,'VERTICAL',0,0,168);
 const points=values=>values.map((v,i)=>[40+i*86,148-v/40*128]);const auto=points([21,23,20,25,22,26,29]),flagged=points([3,4,5,3,10,12,29]);const path=ps=>ps.map((p,i)=>(i?'L':'M')+p[0]+','+p[1]).join(' ');
 let svg='';for(const y of [20,84,148])svg+=`<path d="M40 ${y}H572" stroke="#2C3831" stroke-width="1"/>`;
 svg+=`<path d="${path(auto)}L556 148H40Z" fill="#B7F76B" fill-opacity="0.045"/><path d="${path(auto)}" fill="none" stroke="#B7F76B" stroke-width="2.5" stroke-linejoin="round"/><path d="${path(flagged)}" fill="none" stroke="#E9BB73" stroke-width="2" stroke-linejoin="round"/>`;
 for(const [ps,col]of [[auto,'#B7F76B'],[flagged,'#E9BB73']]){const p=ps[ps.length-1];svg+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${col}" stroke="#141917" stroke-width="2"/>`;}
 chartSvg(plot,'Automation / Activity and flagged trend',svg,596,168);
 for(const [label,y]of [['40%',12],['20%',76],['0%',140]]){const t=T(plot,'Automation / Y axis '+label,label,12,'Regular','muted',32);t.layoutPositioning='ABSOLUTE';t.x=0;t.y=y;}
 const dates=row(chart,'Automation / X axis',596,0,16);for(const label of ['Jul 30','Aug 6','Aug 13','Aug 20','Aug 27','Sep 3','Sep 10']){const t=T(dates,'Automation / Week '+label,label,12,'Regular','muted',85);t.textAlignHorizontal='CENTER';}
 footer(automation,'Automation / Footer',596,'View automations','1 service account · 1 AI agent');const autoInst=mountWidget(automation);const height=Math.max(autoInst.height,actorInst.height);autoInst.resize(644,height);actorInst.resize(644,height);autoInst.layoutSizingVertical='FIXED';actorInst.layoutSizingVertical='FIXED';
 finish('Actor table and automation trend updated',pair);
}
