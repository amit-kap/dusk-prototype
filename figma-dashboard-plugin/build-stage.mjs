import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const stage = process.argv[2];
if (!stage || !/^[a-z0-9-]+$/.test(stage)) throw new Error('Pass a stage name.');
const icons = ['layout-dashboard','shield-alert','folder-search','landmark','users','bot','settings-2','arrow-up','sparkles','chevron-right','chevron-down','circle-help','ellipsis','circle-dot','key-round','calendar-days','network','workflow','activity','search','sunset','external-link','circle-check','circle-alert','arrow-up-right','arrow-right','shield-check','user-round','building-2','sliders-horizontal','arrow-down','clock-3','circle-x','check','triangle-alert','briefcase-business','link','file-text','refresh-cw'];
const svg = {};
for (const name of icons) {
  let iconPath = `/Users/amitka/Personal/Projects/shadcn-comp-lib/node_modules/lucide-react/dist/esm/icons/${name}.mjs`;
  let mod = await import(iconPath);
  if (!mod.__iconData) {
    const alias = fs.readFileSync(iconPath,'utf8').match(/export \{ default \} from '\.\/(.+?)'/);
    if (!alias) throw new Error('Unrecognized Lucide source: '+name);
    mod = await import(path.join(path.dirname(iconPath),alias[1]));
  }
  svg[name] = mod.__iconData.node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k])=>k!=='key').map(([k,v])=>`${k}="${v}"`).join(' ')}/>`).join('');
}
const avatar = fs.readFileSync(path.join(dir, '../assets/profile-carla-rivas.png')).toString('base64');
const code = `const ICONS=${JSON.stringify(svg)};\nconst AVATAR=${JSON.stringify(avatar)};\n` + fs.readFileSync(path.join(dir,'common.js'),'utf8') + '\n' + fs.readFileSync(path.join(dir,'stages',stage+'.js'),'utf8') + '\nmain().catch(error => {console.error(error); figma.closePlugin("Dusk update failed: " + error.message);});\n';
fs.writeFileSync(path.join(dir,'code.js'),code);
console.log('Prepared stage: '+stage);
