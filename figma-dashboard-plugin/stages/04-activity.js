async function main(){
 await setup();
 // Explicit arcs avoid the SVG importer's dashed-circle rendering differences.
 const donut=lib.findOne(n=>n.name==='Account value / Events donut');
 if(donut){const parent=donut.parent,index=parent.children.indexOf(donut);const point=a=>[136+61*Math.cos(a*Math.PI/180),80+61*Math.sin(a*Math.PI/180)];let svg='';for(const [a,b,c]of [[-87,164.142857,'#B7F76B'],[170.142857,267,'#72956E']]){const p=point(a),q=point(b);svg+=`<path d="M${p[0]} ${p[1]} A61 61 0 ${b-a>180?1:0} 1 ${q[0]} ${q[1]}" fill="none" stroke="${c}" stroke-width="16"/>`;}const n=chartSvg(parent,'Account value / Events donut',svg,272,160);parent.insertChild(index,n);donut.remove();}
 const flow=replaceExact('Flow intelligence / Card',1304);header(flow,'Activity paths',1256);
 table(flow,'Activity paths',1256,[{label:'Actor group',w:240},{label:'Account category',w:320},{label:'Observed activity',w:320},{label:'Event verdicts',w:240},{label:'',w:72}],[
  [{text:'Employees',sub:'D. Marek · C. Rivas'},{text:'Critical payroll',sub:'Comp & Equity · Payroll Master EU'},{text:'3 events',sub:'Access, transfer and approval'},{text:'2 fraudulent',sub:'1 legitimate',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
  [{text:'External beneficiary',sub:'j.doe.personal@gmail'},{text:'Critical payroll',sub:'Payroll Master EU'},{text:'1 event',sub:'Withdrawal · New device and geography'},{text:'1 fraudulent',sub:'',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
  [{text:'AI agent',sub:'agent-treasury'},{text:'High value reserves',sub:'Board Reserve Q3'},{text:'1 event',sub:'View and move · Outside baseline'},{text:'1 suspicious',sub:'',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
  [{text:'Service account',sub:'svc-settle-03'},{text:'Critical credentials',sub:'Settlement API Credentials'},{text:'1 event',sub:'Credential use · Expanded scope'},{text:'1 suspicious',sub:'',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
  [{text:'External collaborator',sub:'L. Chen'},{text:'High value vendor payments',sub:'Vendor Payments 2024'},{text:'1 event',sub:'Beneficiary bank details changed'},{text:'1 suspicious',sub:'',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}]
 ]);
 footer(flow,'Activity paths / Footer',1256,'Explore activity','7 events across 5 paths');
 const inst=mountWidget(flow);finish('Activity paths rebuilt with clear columns',inst);
}
