async function main(){
 await setup();
 const priority=get('Dashboard / Priority overview');priority.resize(1304,priority.height);spacing(priority,'itemSpacing',16);
 const risk=replaceExact('Risk posture / Card',320);header(risk,'Risk posture',272);
 const gauge=F(risk,'Risk posture / Score visualization',272,'VERTICAL',0,0,196);
 let arcs='';for(let i=0;i<46;i++){const a=(-220+i*260/45)*Math.PI/180;const x1=136+100*Math.cos(a),y1=120+100*Math.sin(a),x2=136+85*Math.cos(a),y2=120+85*Math.sin(a);const tone=i<38?(i<23?'#74CDA9':i<34?'#E9BB73':'#FF8B87'):'#2C3831';arcs+=`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${tone}" stroke-width="3" stroke-linecap="round"/>`;}
 chartSvg(gauge,'Risk posture / Segmented gauge',arcs,272,196);
 const center=F(gauge,'Risk posture / Score',180,'VERTICAL',4,0,104);center.layoutPositioning='ABSOLUTE';center.x=46;center.y=63;center.counterAxisAlignItems='CENTER';T(center,'Risk posture / Score value','82',60,'Medium');T(center,'Risk posture / Scale','Risk score / 100',12,'Regular','muted');
 const status=row(risk,'Risk posture / Level and change',272,8,24);status.primaryAxisAlignItems='CENTER';Badge(status,'Risk posture / High risk','High risk','fraud');T(status,'Risk posture / Day change','↑ 8 since yesterday',12,'Regular','muted');
 line(risk,'Risk posture / Divider',272);
 const metrics=row(risk,'Risk posture / Drivers',272,16,56);
 for(const [value,label] of [['4','Findings to review'],['3','Critical accounts']]){const m=F(metrics,'Risk posture / '+label,128,'VERTICAL',4);T(m,'Risk posture / '+label+' / Value',value,24,'Medium');T(m,'Risk posture / '+label+' / Label',label,12,'Regular','muted');}
 footer(risk,'Risk posture / Footer',272,'View posture');
 const riskInstance=mountWidget(risk);
 const findings=replaceExact('Priority findings / Card',968);header(findings,'Priority findings',920);
 table(findings,'Findings',920,[{label:'Finding',w:384},{label:'Actor',w:168},{label:'Verdict',w:120},{label:'Confidence',w:96},{label:'',w:88}],[
  [{text:'Transfers to an unregistered personal account',sub:'FND-1042 · 3 linked events · Tue 09:12'}, {text:'D. Marek',sub:'Employee · Finance'}, {text:'Fraudulent',badge:true,tone:'fraud'}, {text:'91%'}, {text:'',icon:'chevron-right'}],
  [{text:'Treasury activity outside its baseline',sub:'FND-1043 · Board Reserve · Wed 03:20'}, {text:'agent-treasury',sub:'AI agent'}, {text:'Suspicious',badge:true,tone:'warning'}, {text:'—'}, {text:'',icon:'chevron-right'}],
  [{text:'Settlement credential used beyond scope',sub:'FND-1041 · Settlement API · Mon 21:14'}, {text:'svc-settle-03',sub:'Service account'}, {text:'Suspicious',badge:true,tone:'warning'}, {text:'88%'}, {text:'',icon:'chevron-right'}],
  [{text:'Vendor bank details changed before payout',sub:'FND-1039 · Vendor Payments · Mon 11:36'}, {text:'L. Chen',sub:'External collaborator'}, {text:'Suspicious',badge:true,tone:'warning'}, {text:'84%'}, {text:'',icon:'chevron-right'}],
  [{text:'Payroll approval matches established activity',sub:'FND-1038 · Comp & Equity · Mon 14:02'}, {text:'C. Rivas',sub:'Employee · Finance'}, {text:'Legitimate',badge:true,tone:'legitimate'}, {text:'98%'}, {text:'',icon:'chevron-right'}]
 ]);
 footer(findings,'Findings / Footer',920,'View all findings','4 require review · 1 cleared');
 const findingInstance=mountWidget(findings);
 riskInstance.resize(320,Math.max(riskInstance.height,findingInstance.height));riskInstance.layoutSizingVertical='FIXED';
 finish('Risk posture and five-row findings updated',priority);
}
