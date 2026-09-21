async function main(){
 const root=await figma.getNodeByIdAsync('4003:182');
 if(!root||root.name!=='Dusk / Payment intelligence / Dashboard')throw Error('Expected dashboard missing');
 function inspect(n,depth){return {id:n.id,name:n.name,type:n.type,visible:n.visible,bounds:n.absoluteBoundingBox,layout:n.layoutMode,sizing:[n.layoutSizingHorizontal,n.layoutSizingVertical],gap:n.itemSpacing,padding:[n.paddingLeft,n.paddingRight,n.paddingTop,n.paddingBottom],children:depth&&n.children?n.children.map(c=>inspect(c,depth-1)):undefined};}
 const report=inspect(root,3);
 figma.showUI('<html><body style="font:12px system-ui;margin:16px"><h3>Current dashboard hierarchy</h3><textarea aria-label="Layout report" readonly style="width:100%;height:320px">'+JSON.stringify(report,null,2).replaceAll('&','&amp;').replaceAll('<','&lt;')+'</textarea><button id="close">Close inspection</button><script>document.getElementById("close").onclick=()=>parent.postMessage({pluginMessage:{type:"close"}},"*");</script></body></html>',{width:640,height:420,title:'Dashboard hierarchy inspection'});
 figma.ui.onmessage=m=>{if(m.type==='close')figma.closePlugin();};
}
