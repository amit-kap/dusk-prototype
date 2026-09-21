import fs from 'node:fs';
const base = new URL('./', import.meta.url);
// Reuse the exact bundled Lucide SVG sources. No downloads or MCP requests.
const icons = fs.readFileSync(new URL('code.js', base), 'utf8').split('\n')[0];
if (!icons.startsWith('const ICONS=')) throw new Error('Bundled Lucide sources missing');
fs.writeFileSync(new URL('ask-dusk.js', base), icons + '\n' + fs.readFileSync(new URL('ask-dusk-source.js', base), 'utf8'));
console.log('Built local Ask Dusk plugin; network access remains disabled.');
