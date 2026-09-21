/* Native Figma Plugin API. No network calls or rasterized UI. */
async function main() {
  const root = await figma.getNodeByIdAsync('4003:182');
  if (!root || root.name !== 'Dusk / Payment intelligence / Dashboard') {
    throw new Error('Open the supplied src2cart file and its existing Dusk dashboard frame.');
  }
  const page = root.parent;
  await figma.setCurrentPageAsync(page);
  const available = await figma.listAvailableFontsAsync();
  const styles = ['Regular', 'Medium', 'Semi Bold', 'Bold'];
  for (const style of styles) {
    if (!available.some(f => f.fontName.family === 'Inter' && f.fontName.style === style)) {
      throw new Error('Required Inter font style is unavailable: ' + style);
    }
  }
  await Promise.all(styles.map(style => figma.loadFontAsync({ family: 'Inter', style })));
  const existingTexts = root.findAllWithCriteria({ types: ['TEXT'] });
  const loaded = new Set();
  for (const t of existingTexts) {
    for (const s of t.getStyledTextSegments(['fontName'])) {
      const key = JSON.stringify(s.fontName);
      if (!loaded.has(key)) { await figma.loadFontAsync(s.fontName); loaded.add(key); }
    }
  }
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collection = collections.find(c => c.name === 'Dusk');
  if (!collection) throw new Error('The existing Dusk variable collection was not found.');
  const vars = Object.fromEntries((await figma.variables.getLocalVariablesAsync())
    .filter(v => v.variableCollectionId === collection.id).map(v => [v.name, v]));
  const rgb = hex => ({ r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 });
  for (const [key, hex] of [['accent-soft', '#24321D'], ['chart-strong', '#8DA798'], ['chart-quiet', '#577568']]) {
    if (!vars['color/' + key]) {
      const v = figma.variables.createVariable('color/' + key, collection, 'COLOR');
      v.scopes = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL'];
      v.setValueForMode(collection.defaultModeId, rgb(hex));
      vars[v.name] = v;
    }
  }
  const paint = key => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', vars['color/' + key]);
  const changed = new Set();
  const made = [];
  const textStyles = {};
  const localStyles = await figma.getLocalTextStylesAsync();
  for (const [role, size, style] of [['Section', 18, 'Semi Bold'], ['Body', 14, 'Regular'], ['Label', 14, 'Medium'], ['Metadata', 12, 'Regular'], ['Caption', 11, 'Regular']]) {
    const name = 'Dusk / ' + role;
    let s = localStyles.find(x => x.name === name);
    if (!s) { s = figma.createTextStyle(); s.name = name; }
    s.fontName = { family: 'Inter', style }; s.fontSize = size;
    s.lineHeight = { unit: 'PIXELS', value: Math.round(size * 1.45) };
    textStyles[size + '/' + style] = s;
  }
  function space(n, key, value) {
    n[key] = value;
    if (vars['space/' + value]) n.setBoundVariable(key, vars['space/' + value]);
  }
  function frame(parent, name, width, dir = 'VERTICAL', card = false, gap = 16, pad = 0) {
    const n = figma.createFrame(); n.name = name; n.layoutMode = dir;
    parent.appendChild(n); n.resize(width, 1);
    n.layoutSizingHorizontal = 'FIXED'; n.layoutSizingVertical = 'HUG';
    n.fills = card ? [paint('surface')] : []; n.clipsContent = false;
    space(n, 'itemSpacing', gap);
    for (const key of ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']) space(n, key, pad);
    if (card) {
      n.strokes = [paint('border')]; n.strokeWeight = 1; n.cornerRadius = 12;
      for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) n.setBoundVariable(k, vars['radius/12']);
    }
    made.push(n.id); changed.add(parent.id); return n;
  }
  function text(parent, name, content, size = 14, weight = 'Regular', color = 'text', width = 0) {
    const n = figma.createText(); n.name = name;
    n.fontName = { family: 'Inter', style: weight }; n.characters = content;
    n.fontSize = size; n.lineHeight = { unit: 'PIXELS', value: Math.round(size * 1.45) };
    n.fills = [paint(color)]; parent.appendChild(n);
    if (width) { n.resize(width, 1); n.layoutSizingHorizontal = 'FIXED'; n.textAutoResize = 'HEIGHT'; }
    else n.textAutoResize = 'WIDTH_AND_HEIGHT';
    made.push(n.id); changed.add(parent.id); return n;
  }
  function get(name) {
    const n = root.findOne(x => x.name === name);
    if (!n) throw new Error('Missing dashboard layer: ' + name);
    return n;
  }
  function replace(name, width, dir = 'VERTICAL', card = true, gap = 16, pad = 24) {
    const old = get(name), parent = old.parent, index = parent.children.indexOf(old);
    const n = frame(parent, name, width, dir, card, gap, pad);
    parent.insertChild(index, n); old.remove(); return n;
  }
  function heading(parent, name, title, subtitle, width) {
    const h = frame(parent, name + ' / Heading group', width, 'VERTICAL', false, 4);
    text(h, name + ' / Heading', title, 18, 'Semi Bold');
    if (subtitle) text(h, name + ' / Scope', subtitle, 12, 'Regular', 'muted', width);
    return h;
  }
  function surface(parent, name, width, dir = 'VERTICAL', gap = 8, pad = 12) {
    const n = frame(parent, name, width, dir, false, gap, pad);
    n.fills = [paint('background')]; n.cornerRadius = 8; return n;
  }
  function bar(parent, name, width, fillWidth, color) {
    const track = frame(parent, name + ' / Track', width, 'HORIZONTAL', false, 0);
    track.resize(width, 4); track.layoutSizingVertical = 'FIXED';
    track.fills = [paint('border')]; track.cornerRadius = 2;
    if (fillWidth > 0) {
      const r = figma.createRectangle(); r.name = name + ' / Event count';
      track.appendChild(r); r.resize(fillWidth, 4); r.cornerRadius = 2; r.fills = [paint(color)]; made.push(r.id);
    }
  }
  async function button(parent, name, label, primary = false) {
    const source = await figma.getNodeByIdAsync(primary ? '4003:116' : '4003:119');
    if (!source || source.type !== 'COMPONENT') {
      const n = surface(parent, name, primary ? 168 : 208, 'HORIZONTAL', 8, 12);
      n.fills = [paint(primary ? 'accent' : 'border')];
      text(n, name + ' / Label', label, 12, 'Semi Bold', primary ? 'background' : 'text');
      return n;
    }
    const n = source.createInstance(); parent.appendChild(n); n.name = name;
    n.setProperties({ 'Label#2:0': label, 'Has Icon End#4:64': false, 'Has Icon Start#4:128': false });
    n.fills = [paint(primary ? 'accent' : 'border')]; n.strokes = []; n.cornerRadius = 8;
    const children = n.findAll();
    let index = 0;
    for (const c of children) {
      c.name = name + ' / ' + (c.type === 'TEXT' ? 'Label' : c.type === 'INSTANCE' ? 'Optional icon' : 'Icon path ' + (++index));
      if (c.type === 'TEXT') { c.fills = [paint(primary ? 'background' : 'text')]; c.fontSize = 12; }
      made.push(c.id);
    }
    made.push(n.id); changed.add(parent.id); return n;
  }

  // Normalize existing text after the MCP resize issue. Preserve fixed wrapping widths.
  for (const t of existingTexts) { if (t.textAutoResize === 'NONE' && t.height < 3) t.textAutoResize = 'HEIGHT'; changed.add(t.id); }
  const nav = get('Navigation / Dashboard / Selected'); nav.fills = [paint('accent-soft')]; changed.add(nav.id);
  const navLabel = get('Navigation / Dashboard / Label'); navLabel.fills = [paint('accent')]; changed.add(navLabel.id);
  const title = get('Dashboard / Title'); title.fontSize = 32; title.lineHeight = { unit: 'PIXELS', value: 40 }; title.textAutoResize = 'WIDTH_AND_HEIGHT'; changed.add(title.id);
  const header = get('Shell / Global header');
  const previousAsk = root.findOne(n => n.name === 'Ask Dusk / Submit');
  if (previousAsk) previousAsk.remove();
  const ask = await button(header, 'Ask Dusk / Submit', 'Ask Dusk', true);
  header.insertChild(2, ask);
  const prompt = get('Ask Dusk / Global prompt'); prompt.resize(600, prompt.height); changed.add(prompt.id);
  const context = get('Workspace / Organization and data context'); context.layoutSizingHorizontal = 'FILL'; changed.add(context.id);

  const exposure = replace('Value tiers / Card', 352);
  heading(exposure, 'Value tiers', 'Activity by value tier', '5 supplied events · 7 account records', 304);
  for (const [tier, events, accounts] of [['Critical', 4, 3], ['High-Value', 1, 2], ['Elevated', 0, 1], ['Routine', 0, 1]]) {
    const row = frame(exposure, 'Value tiers / ' + tier, 304, 'VERTICAL', false, 8);
    const labels = frame(row, 'Value tiers / ' + tier + ' / Labels', 304, 'HORIZONTAL', false, 8);
    text(labels, 'Value tiers / ' + tier + ' / Tier', tier, 13, 'Medium', 'text', 118);
    const count = text(labels, 'Value tiers / ' + tier + ' / Counts', events + ' events · ' + accounts + ' accts', 12, 'Regular', 'muted', 178);
    count.textAlignHorizontal = 'RIGHT';
    bar(row, 'Value tiers / ' + tier + ' / Distribution', 304, events / 5 * 304, tier === 'Critical' ? 'chart-strong' : 'chart-quiet');
  }
  text(exposure, 'Value tiers / Verdict detail', 'Critical: 3 fraudulent, 1 legitimate.\nHigh-Value: 1 suspicious.', 11, 'Regular', 'muted', 304);
  text(exposure, 'Value tiers / Amount availability', 'Payment amounts are not supplied.', 11, 'Regular', 'muted', 304);

  const accounts = replace('Critical accounts / Card', 816);
  heading(accounts, 'Critical accounts', 'Critical accounts at risk', 'Ranked by the supplied account risk score', 768);
  const cols = [284, 48, 172, 192];
  const tableHead = frame(accounts, 'Critical accounts / Column headers', 768, 'HORIZONTAL', false, 16, 12);
  ['ACCOUNT', 'RISK', 'EXPOSURE', 'OBSERVED ACTIVITY'].forEach((s, i) => text(tableHead, 'Critical accounts / Column / ' + s, s, 10, 'Medium', 'muted', cols[i]));
  const accountData = [
    ['Settlement API Credentials', '93', 'Exposed key\nSecrets / keys', 'No events in sample', 'muted'],
    ['FY24 Comp & Equity Payroll', '87', '2 external collaborators\nPII / financial / HR', '1 fraudulent event\n1 legitimate event', 'text'],
    ['Payroll Master — EU', '72', 'Internal access\nPII / financial', '2 fraudulent events\nTransfer / withdrawal', 'fraud']
  ];
  for (const [name, score, access, activity, color] of accountData) {
    const row = surface(accounts, 'Critical account / ' + name, 768, 'HORIZONTAL', 16, 12);
    row.counterAxisAlignItems = 'CENTER';
    text(row, 'Critical account / ' + name + ' / Account', name, 14, 'Medium', 'text', cols[0]);
    text(row, 'Critical account / ' + name + ' / Risk score', score, 20, 'Medium', 'text', cols[1]);
    text(row, 'Critical account / ' + name + ' / Exposure', access, 12, 'Regular', 'muted', cols[2]);
    text(row, 'Critical account / ' + name + ' / Activity', activity, 12, 'Regular', color, cols[3]);
  }
  text(accounts, 'Critical accounts / Risk definition', 'Critical describes potential harm, not a verdict. Complete access-population counts are not supplied.', 11, 'Regular', 'muted', 768);
  exposure.layoutSizingVertical = 'FILL';

  const flow = replace('Flow intelligence / Card', 1184);
  heading(flow, 'Flow intelligence', 'Follow the activity behind the findings', 'Actor groups → account categories → observed events · Supplied event subset', 1136);
  const flows = [
    ['Employees', 'D. Marek · C. Rivas', 'Critical payroll', 'Comp & Equity · Payroll Master — EU', 'Access / queue · Transfer · Approve', '2 fraudulent · 1 legitimate', 'text'],
    ['External', 'j.doe.personal@gmail', 'Critical payroll', 'Payroll Master — EU', 'Withdraw · New device / new geography', '1 fraudulent', 'fraud'],
    ['AI agent', 'agent-treasury', 'High-Value reserves', 'Board Reserve — Q3', 'View / move · Off-hours / off-baseline', '1 suspicious', 'warning']
  ];
  for (const [group, actor, category, account, action, verdict, color] of flows) {
    const row = surface(flow, 'Flow / ' + group, 1136, 'HORIZONTAL', 16, 12);
    row.counterAxisAlignItems = 'CENTER';
    const a = frame(row, 'Flow / ' + group + ' / Actor group', 212, 'VERTICAL', false, 4);
    text(a, 'Flow / ' + group + ' / Group label', group, 14, 'Medium');
    text(a, 'Flow / ' + group + ' / Actors', actor, 12, 'Regular', 'muted', 212);
    text(row, 'Flow / ' + group + ' / Actor to account connector', '→', 16, 'Regular', 'muted', 16);
    const b = frame(row, 'Flow / ' + group + ' / Account category', 272, 'VERTICAL', false, 4);
    text(b, 'Flow / ' + group + ' / Category label', category, 14, 'Medium');
    text(b, 'Flow / ' + group + ' / Accounts', account, 12, 'Regular', 'muted', 272);
    text(row, 'Flow / ' + group + ' / Account to event connector', '→', 16, 'Regular', 'muted', 16);
    const c = frame(row, 'Flow / ' + group + ' / Financial events', 532, 'VERTICAL', false, 4);
    text(c, 'Flow / ' + group + ' / Actions and signals', action, 13, 'Medium', 'text', 532);
    text(c, 'Flow / ' + group + ' / Event verdicts', verdict, 12, 'Medium', color, 532);
  }
  text(flow, 'Flow intelligence / Service account coverage', 'Service account svc-settle-03 has no event-to-account links in the supplied sample.', 11, 'Regular', 'muted', 1136);

  const actors = replace('Anomalous actors / Card', 584);
  heading(actors, 'Anomalous actors', 'Anomalous actors', 'Context and supplied risk scores · Verdicts apply to events', 536);
  const actorRows = [
    ['D. Marek', 'Employee · Finance', '88', 'On notice\nDormant → active'],
    ['j.doe.personal@gmail', 'External · Not in payee master', '81', 'Restricted transfer\nNew device / geography'],
    ['svc-settle-03', 'Service · Nightly settlement', '64', 'Scope drift'],
    ['agent-treasury', 'AI · Treasury copilot', '58', 'Off-baseline\ncounterparty']
  ];
  for (const [name, type, score, signal] of actorRows) {
    const row = frame(actors, 'Actor / ' + name, 536, 'HORIZONTAL', false, 16);
    row.counterAxisAlignItems = 'CENTER';
    const identity = frame(row, 'Actor / ' + name + ' / Identity', 252, 'VERTICAL', false, 4);
    text(identity, 'Actor / ' + name + ' / Name', name, 14, 'Medium', 'text', 252);
    text(identity, 'Actor / ' + name + ' / Type and role', type, 11, 'Regular', 'muted', 252);
    text(row, 'Actor / ' + name + ' / Risk score', score, 20, 'Medium', 'text', 40);
    text(row, 'Actor / ' + name + ' / Signals', signal, 12, 'Regular', 'muted', 212);
  }
  text(actors, 'Anomalous actors / Baseline note', 'C. Rivas is the in-baseline reference actor (risk 12).', 11, 'Regular', 'muted', 536);

  const automation = replace('Automation exposure / Card', 584);
  heading(automation, 'Automation exposure', 'Automation exposure', 'Service accounts and AI agents in the supplied sample', 536);
  const metrics = frame(automation, 'Automation exposure / Summary metrics', 536, 'HORIZONTAL', false, 24);
  for (const [name, value, label] of [['Actors', '2', 'automated actors'], ['AI event', '1', 'suspicious AI event']]) {
    const m = frame(metrics, 'Automation exposure / ' + name, 256, 'VERTICAL', false, 4);
    text(m, 'Automation exposure / ' + name + ' / Value', value, 28, 'Medium', name === 'AI event' ? 'warning' : 'text');
    text(m, 'Automation exposure / ' + name + ' / Label', label, 12, 'Regular', 'muted');
  }
  const history = surface(automation, 'Automation exposure / History unavailable', 536, 'VERTICAL', 8, 16);
  text(history, 'Automation exposure / History / Title', 'Adoption vs fraud exposure over time', 14, 'Medium', 'text', 504);
  text(history, 'Automation exposure / History / Empty-state title', 'Historical data unavailable', 13, 'Medium', 'muted', 504);
  text(history, 'Automation exposure / History / Explanation', 'The exercise supplies one AI event and no time series. A trend or adoption rate cannot be calculated.', 12, 'Regular', 'muted', 504);
  text(automation, 'Automation exposure / Evidence summary', 'Service: scope drift, no event supplied.\nAI: off-baseline counterparty, 1 suspicious event.', 12, 'Regular', 'muted', 536);
  await button(automation, 'Automation exposure / Review actors', 'Review automated actors');
  actors.layoutSizingVertical = 'FILL';

  const signals = replace('Recent activity / Card', 584);
  heading(signals, 'Recent activity', 'Recent activity', 'Latest events in the exercise sample', 536);
  const activity = [
    ['Wed 03:20', 'agent-treasury · View / move', 'Off-hours / off-baseline', 'Suspicious', 'warning'],
    ['Tue 22:07', 'Personal account · Withdrawal', 'New device / new geography', 'Fraudulent', 'fraud'],
    ['Tue 09:40', 'D. Marek · Transfer to personal', 'External target / restricted', 'Fraudulent', 'fraud']
  ];
  for (const [time, title, reason, verdict, color] of activity) {
    const row = frame(signals, 'Activity / ' + time, 536, 'HORIZONTAL', false, 16);
    row.counterAxisAlignItems = 'CENTER';
    text(row, 'Activity / ' + time + ' / Timestamp', time, 11, 'Medium', 'muted', 72);
    const description = frame(row, 'Activity / ' + time + ' / Event summary', 344, 'VERTICAL', false, 4);
    text(description, 'Activity / ' + time + ' / Action', title, 13, 'Medium', 'text', 344);
    text(description, 'Activity / ' + time + ' / Reason', reason, 11, 'Regular', 'muted', 344);
    text(row, 'Activity / ' + time + ' / Verdict', verdict, 11, 'Medium', color, 88);
  }
  text(signals, 'Recent activity / All events link', 'View all 5 events ↗', 12, 'Semi Bold', 'accent');

  const cases = replace('Investigations / Card', 584);
  heading(cases, 'Investigations', 'Investigations', 'Group related findings into an auditable case', 536);
  const empty = surface(cases, 'Investigations / Empty state', 536, 'VERTICAL', 12, 16);
  text(empty, 'Investigations / Empty state / Title', 'Start with the Marek finding', 18, 'Medium', 'text', 504);
  text(empty, 'Investigations / Empty state / Description', 'Bring the payment chain, access history and related actors together. Record what was found, done and why.', 14, 'Regular', 'muted', 504);
  await button(empty, 'Investigations / Start investigation', 'Start investigation', true);
  text(cases, 'Investigations / Data availability', 'No case records or investigation history were provided.', 11, 'Regular', 'muted', 536);
  signals.layoutSizingVertical = 'FILL';

  const footer = replace('Data provenance / Footer', 1184, 'VERTICAL', false, 4, 0);
  text(footer, 'Data provenance / Source', 'SOURCE  ·  Dusk exercise — Vega Dynamics scenario and appendix. Synthetic data.', 11, 'Regular', 'muted', 1184);
  text(footer, 'Data provenance / Scope and limits', 'The incident narrative covers 14 accessed accounts; the appendix contains 7 accounts and 5 events. No amounts, historical series or case records are supplied.', 11, 'Regular', 'muted', 1184);

  // Bind the type scale after content and widths have been established.
  for (const t of root.findAllWithCriteria({ types: ['TEXT'] })) {
    if (t.fontName !== figma.mixed) {
      const s = textStyles[t.fontSize + '/' + t.fontName.style];
      if (s) { await t.setTextStyleIdAsync(s.id); changed.add(t.id); }
    }
  }
  // Audit every descendant, including imported control internals.
  const descendants = root.findAll();
  const generic = /^(Frame|Text|Rectangle|Vector|Ellipse|Group|Line|Instance|Component)(\s+\d+)?$/i;
  const unnamed = descendants.filter(n => !n.name.trim() || generic.test(n.name));
  const collapsedText = descendants.filter(n => n.type === 'TEXT' && n.visible && (n.width < 2 || n.height < 2));
  const overflow = descendants.filter(n => n.parent && n.parent.type === 'FRAME' && n.visible && n.layoutPositioning !== 'ABSOLUTE' && (n.x < -1 || n.x + n.width > n.parent.width + 1));
  figma.currentPage.selection = [root]; figma.viewport.scrollAndZoomIntoView([root]);
  const result = { frameId: root.id, layers: descendants.length, unnamedLayers: unnamed.map(n => n.name), collapsedText: collapsedText.map(n => n.name), horizontalOverflow: overflow.map(n => n.name), createdNodeIds: made, mutatedNodeIds: Array.from(changed) };
  console.log('DUSK_DASHBOARD_AUDIT', result);
  if (unnamed.length || collapsedText.length || overflow.length) {
    figma.closePlugin('Dashboard built. Inspect audit: ' + unnamed.length + ' unnamed, ' + collapsedText.length + ' collapsed text, ' + overflow.length + ' overflow.');
  } else {
    figma.closePlugin('Dashboard complete · ' + descendants.length + ' named layers · layout audit passed.');
  }
}
main().catch(error => { console.error(error); figma.closePlugin('Dusk dashboard: ' + error.message); });
