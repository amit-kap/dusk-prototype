async function main(){
 await setup();const pair=get('Dashboard / Activity and investigations');pair.resize(1304,pair.height);spacing(pair,'itemSpacing',16);
 const activity=replaceExact('Recent activity / Card',644);header(activity,'Latest signals',596);
 table(activity,'Signals',596,[{label:'Detected',w:80},{label:'Signal',w:332},{label:'Update',w:112},{label:'',w:24}],[
 [{text:'Wed',sub:'03:20'},{text:'Treasury activity flagged',sub:'FND-1043 · agent-treasury'},{text:'New finding',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
 [{text:'Tue',sub:'22:07'},{text:'New device linked to personal withdrawal',sub:'FND-1042 · Payroll Master EU'},{text:'Evidence',badge:true},{text:'',icon:'chevron-right'}],
 [{text:'Tue',sub:'09:40'},{text:'Unregistered beneficiary detected',sub:'FND-1042 · D. Marek'},{text:'Evidence',badge:true},{text:'',icon:'chevron-right'}],
 [{text:'Tue',sub:'09:12'},{text:'Dormant approval rights reactivated',sub:'FND-1042 · 14 Critical accounts'},{text:'New finding',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
 [{text:'Mon',sub:'21:14'},{text:'Settlement scope drift detected',sub:'FND-1041 · svc-settle-03'},{text:'New finding',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}]
 ]);footer(activity,'Signals / Footer',596,'View all signals','Latest 5 updates');mountWidget(activity);
 const cases=replaceExact('Investigations / Card',644);header(cases,'Investigations',596);
 table(cases,'Investigations',596,[{label:'Investigation',w:272},{label:'Owner',w:100},{label:'Status',w:152},{label:'',w:24}],[
 [{text:'Marek payment chain',sub:'INV-204 · 3 events · Critical'},{text:'Carla Rivas',sub:'Updated 22:12'},{text:'Investigating',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
 [{text:'Treasury counterparty review',sub:'INV-205 · 1 event · High'},{text:'Noam Levi',sub:'Updated 03:34'},{text:'Triage',badge:true},{text:'',icon:'chevron-right'}],
 [{text:'Settlement credential exposure',sub:'INV-203 · 1 event · High'},{text:'Carla Rivas',sub:'Updated Mon'},{text:'Investigating',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
 [{text:'Vendor beneficiary change',sub:'INV-202 · 1 event · High'},{text:'Maya Cohen',sub:'Updated Mon'},{text:'In review',badge:true},{text:'',icon:'chevron-right'}],
 [{text:'Payroll approval verification',sub:'INV-201 · 1 event · Normal'},{text:'Noam Levi',sub:'Closed Mon'},{text:'Closed',badge:true,tone:'legitimate'},{text:'',icon:'chevron-right'}]
 ]);footer(cases,'Investigations / Footer',596,'View all cases','4 active · 1 closed');mountWidget(cases);
 const provenance=root.findOne(n=>n.name==='Data provenance / Footer');if(provenance)provenance.remove();const intro=root.findOne(n=>n.name==='Dashboard / Page introduction');if(intro)intro.remove();
 for(const n of root.findAllWithCriteria({types:['INSTANCE']}))if(n.name==='Widget / CardHeader')n.name=n.parent.name+' / Header';
 finish('Signals and investigations populated; UI notes removed',pair);
}
