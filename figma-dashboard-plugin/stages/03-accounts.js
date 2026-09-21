async function main(){
 await setup();
 const exposure=get('Dashboard / Account exposure');exposure.resize(1304,exposure.height);spacing(exposure,'itemSpacing',16);
 const tiers=replaceExact('Value tiers / Card',320);header(tiers,'Account value',272);
 const tabs=row(tiers,'Account value / Metric tabs',272,4,32);tabs.fills=[paint('inset')];radius(tabs,8);for(const [label,active]of [['Activity',true],['Accounts',false]]){const tab=row(tabs,'Account value / '+label+' tab',134,0,28);tab.primaryAxisAlignItems='CENTER';if(active){tab.fills=[paint('raised')];radius(tab,8);}T(tab,'Account value / '+label+' label',label,12,'Medium',active?'text':'muted');}
 const viz=F(tiers,'Account value / Activity distribution',272,'VERTICAL',0,0,160);
 const circumference=2*Math.PI*61;const svg=`<circle cx="136" cy="80" r="61" fill="none" stroke="#2C3831" stroke-width="16"/><circle cx="136" cy="80" r="61" fill="none" stroke="#B7F76B" stroke-width="16" stroke-dasharray="${circumference*5/7-5} ${circumference}" transform="rotate(-90 136 80)"/><circle cx="136" cy="80" r="61" fill="none" stroke="#72956E" stroke-width="16" stroke-dasharray="${circumference*2/7-5} ${circumference}" stroke-dashoffset="${-circumference*5/7}" transform="rotate(-90 136 80)"/>`;
 chartSvg(viz,'Account value / Events donut',svg,272,160);const center=F(viz,'Account value / Total',100,'VERTICAL',0,0,60);center.layoutPositioning='ABSOLUTE';center.x=86;center.y=50;center.counterAxisAlignItems='CENTER';T(center,'Account value / Event count','7',36,'Medium');T(center,'Account value / Unit','events',12,'Regular','muted');
 for(const [label,events,accounts,color]of [['Critical',5,3,'accent'],['High value',2,2,'chart-quiet'],['Elevated',0,1,'quiet'],['Routine',0,1,'border']]){const r=row(tiers,'Account value / '+label,272,8,24);const dot=figma.createEllipse();r.appendChild(dot);dot.name='Account value / '+label+' / Legend';dot.resize(6,6);dot.fills=[paint(color)];T(r,'Account value / '+label+' / Label',label,14,'Regular','text',98);T(r,'Account value / '+label+' / Count',events+' events',12,'Regular','muted',62);const ac=T(r,'Account value / '+label+' / Accounts',accounts+' '+(accounts===1?'account':'accounts'),12,'Regular','muted',82);ac.textAlignHorizontal='RIGHT';}
 const tierInst=mountWidget(tiers);
 const accounts=replaceExact('Critical accounts / Card',968);header(accounts,'Accounts at risk',920);
 table(accounts,'Accounts',920,[{label:'Account',w:328},{label:'Value',w:120},{label:'Access exposure',w:248},{label:'Risk score',w:96},{label:'',w:64}],[
 [{text:'Settlement API Credentials',sub:'Secrets and API keys · 000'},{text:'Critical',badge:true},{text:'Exposed credential',sub:'Service account access'},{text:'93 · High',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
 [{text:'FY24 Comp & Equity Payroll',sub:'PII, financial and HR · 641'},{text:'Critical',badge:true},{text:'2 external collaborators',sub:'Payroll and compensation'},{text:'87 · High',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
 [{text:'Payroll Master — EU',sub:'PII and financial · 642'},{text:'Critical',badge:true},{text:'Internal access',sub:'External transfer detected'},{text:'72 · High',badge:true,tone:'fraud'},{text:'',icon:'chevron-right'}],
 [{text:'Board Reserve — Q3',sub:'Financial and strategy · 658'},{text:'High value',badge:true},{text:'6 actors',sub:'Includes treasury agent'},{text:'61 · Elevated',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}],
 [{text:'Vendor Payments 2024',sub:'PII and legal · 646'},{text:'High value',badge:true},{text:'3 external collaborators',sub:'Vendor payment access'},{text:'55 · Elevated',badge:true,tone:'warning'},{text:'',icon:'chevron-right'}]
 ]);
 footer(accounts,'Accounts / Footer',920,'View all accounts','Showing 5 of 7 accounts · Highest risk first');
 const acInst=mountWidget(accounts);tierInst.resize(320,Math.max(tierInst.height,acInst.height));tierInst.layoutSizingVertical='FIXED';
 finish('Account value and risk table clarified',exposure);
}
