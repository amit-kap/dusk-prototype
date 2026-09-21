async function main(){
  const root=await figma.getNodeByIdAsync('4003:182');
  if(!root || root.name!=='Dusk / Payment intelligence / Dashboard')throw Error('Expected dashboard not found');
  const nav=root.findOne(n=>n.name==='Navigation / Primary');
  if(!nav)throw Error('Navigation / Primary not found');
  nav.fills=[];
  nav.strokes=[];
  nav.effects=[];
  if(nav.fills.length || nav.strokes.length)throw Error('Navigation appearance did not update');
  console.log('DUSK_FLOATING_NAV',JSON.stringify({id:nav.id,name:nav.name,fills:nav.fills,strokes:nav.strokes,effects:nav.effects}));
  figma.currentPage.selection=[nav];
  figma.viewport.scrollAndZoomIntoView([nav]);
  figma.closePlugin('Navigation / Primary · no background or border');
}
