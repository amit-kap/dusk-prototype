// Ask Dusk text-led response correction.
// Authorized local Figma development plugin. No fetch, credentials, or network calls.

const IDS = {
  root: '4019:2890',
  dashboard: '4003:182',
  navigation: '4019:3153',
  workspace: '4019:3150',
  actions: '4019:3151',
  viewport: '4019:3152',
  body: '4019:2917',
  userRow: '4019:2918',
  response: '4019:2921',
  composerDock: '4019:3088',
  library: '4007:38',
  duskMark: '4007:40',
  buttonOutline: '4025:1454',
  buttonGhost: '4025:1458',
  badgeFraud: '4008:268',
  dialog: '4025:1493',
  textarea: '4025:1505',
  sendDisabled: '4025:1507',
  accessDetail: '4025:1518',
  transferDetail: '4025:1530',
  withdrawalDetail: '4025:1542',
  marekDetail: '4025:1554',
  accountsDetail: '4025:1566',
  beneficiaryDetail: '4025:1578',
  assessmentDetail: '4025:1590',
  safeguardDetail: '4025:1602',
};

const COMPONENT_NAMES = {
  link: 'Dusk / Ask Dusk text / Button / link',
  attribution: 'Dusk / Ask Dusk text / MessageHeader / attribution',
  prose: 'Dusk / Ask Dusk text / Bubble / ghost / prose',
  background: 'Dusk / Ask Dusk text / MessageContent / linked background',
  flowStep: 'Dusk / Ask Dusk text / FlowStep / source event',
  flow: 'Dusk / Ask Dusk text / MessageContent / compact event flow',
  event: 'Dusk / Ask Dusk text / EventParagraph / recorded event',
  chronology: 'Dusk / Ask Dusk text / MessageContent / event chronology',
  interpretation: 'Dusk / Ask Dusk text / MessageContent / Dusk interpretation',
  nextAction: 'Dusk / Ask Dusk text / MessageContent / next action',
  composerInput: 'Dusk / Ask Dusk text / InputGroup / blank composer',
  composer: 'Dusk / Ask Dusk text / MessageContent / composer dock',
  answer: 'Dusk / Ask Dusk text / Message / align=start / answer',
};

const SOURCE_MAP = {
  [COMPONENT_NAMES.link]: 'shadcn button.tsx: Button variant=link, size=default; nested Lucide arrow-right.',
  [COMPONENT_NAMES.attribution]: 'shadcn message.tsx: MessageHeader inside Message align=start.',
  [COMPONENT_NAMES.prose]: 'shadcn message.tsx MessageContent plus bubble.tsx Bubble variant=ghost and BubbleContent.',
  [COMPONENT_NAMES.background]: 'shadcn MessageContent containing ghost prose and compact Button link instances.',
  [COMPONENT_NAMES.flowStep]: 'Reusable source-event step with editable time, event, entity, and source label.',
  [COMPONENT_NAMES.flow]: 'shadcn MessageContent containing four compact FlowStep instances; evidence is chronological, not a card grid.',
  [COMPONENT_NAMES.event]: 'Reusable MessageContent event paragraph with explicit fact, entity/account, causal meaning, and detail links.',
  [COMPONENT_NAMES.chronology]: 'shadcn MessageContent containing three EventParagraph instances.',
  [COMPONENT_NAMES.interpretation]: 'shadcn MessageContent with existing Dusk Badge instance; interpretation and uncertainty remain separate from events.',
  [COMPONENT_NAMES.nextAction]: 'shadcn MessageContent with existing Button outline instance; proposes a scoped investigation action.',
  [COMPONENT_NAMES.composerInput]: 'shadcn InputGroup containing existing Textarea and disabled InputGroupButton component instances.',
  [COMPONENT_NAMES.composer]: 'shadcn MessageContent with suggested-question Button instances above a blank InputGroup.',
  [COMPONENT_NAMES.answer]: 'shadcn Message align=start and MessageContent composed entirely from response-block component instances.',
};

const DETAIL_COPY = {
  access: {
    Category: 'Source event · Access and queue',
    Title: 'Dormant authority used for payroll activity',
    Record: 'Tuesday 09:12 · D. Marek authority → FY24 Comp & Equity Payroll',
    Detail: 'Marek’s authority was used to access 14 Critical finance accounts and queue payments in 20 minutes, at 12× normal activity, with an off baseline counterparty.',
    Context: 'The event appendix maps this step to FY24 Comp & Equity Payroll, ledger class 641, for access ×14 and queue. Ledger class 641 is not an account ID, and the appendix is not a complete list of all 14 accounts.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario pp. 5–6; event appendix p. 7. The event identifies the account activity, not who controlled the session.',
  },
  transfer: {
    Category: 'Source event · Transfer',
    Title: 'Two transfers reached a personal beneficiary',
    Record: 'Tuesday 09:40 · D. Marek → Payroll Master — EU',
    Detail: 'Two transfers were routed from Payroll Master — EU to the external actor j.doe.personal@gmail. The personal destination was absent from the payee master and marked as a restricted external target.',
    Context: 'The event appendix maps the account to ledger class 642. This follows the 09:12 access and queue activity and moves the chain outside the registered payee set.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario p. 6; event appendix p. 7. Amounts, beneficiary ownership, and intent are not established.',
  },
  withdrawal: {
    Category: 'Source event · Withdrawal',
    Title: 'Transferred funds were withdrawn',
    Record: 'Tuesday 22:07 · j.doe.personal → Payroll Master — EU',
    Detail: 'The external transfer was confirmed and the funds were withdrawn using an unrecognized device in a new geography.',
    Context: 'The appendix records j.doe.personal → Payroll Master — EU with action withdraw. This completes the same day sequence from dormant authority to an external personal beneficiary and withdrawal.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario p. 6; event appendix p. 7. Device identity, geography, session operator, and intent remain unverified. The funds have already been withdrawn.',
  },
  marek: {
    Category: 'Source actor context',
    Title: 'D. Marek',
    Record: 'Finance analyst · Day 9 of a 30 day notice period',
    Detail: 'Broad approval over finance disbursement accounts was granted six months earlier for quarter close and was never revoked.',
    Context: 'Normal behavior rarely touched compensation or payroll. Tuesday activity reached 14 Critical finance accounts in 20 minutes at 12× normal volume.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario pp. 5–6. The activity is associated with Marek’s authority; it does not prove Marek personally operated the session.',
  },
  accounts: {
    Category: 'Source account context',
    Title: '14 Critical finance accounts',
    Record: 'Tuesday 09:12 · Access and payment queue activity',
    Detail: 'The activity crossed into compensation and payroll outside Marek’s normal behavior. The appendix names FY24 Comp & Equity Payroll and Payroll Master — EU as examples.',
    Context: 'Those accounts are ledger classes 641 and 642. The appendix does not enumerate the full population of 14 accessed accounts.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario p. 6; event appendix p. 7. Confirm the full account list and current approval scope before restricting access.',
  },
  beneficiary: {
    Category: 'Source beneficiary context',
    Title: 'External personal beneficiary',
    Record: 'j.doe.personal@gmail · Two transfers Tuesday 09:40',
    Detail: 'The personal destination was external, absent from the payee master, and shown as a restricted target. The funds were withdrawn at 22:07.',
    Context: 'Withdrawal activity used an unrecognized device and a new geography.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario p. 6; event appendix p. 7. Ownership of the beneficiary and its relationship to Marek remain unverified.',
  },
  assessment: {
    Category: 'Dusk interpretation',
    Title: 'Payment diversion pattern',
    Record: 'Fraudulent · 91% confidence · FND-1042',
    Detail: 'Dormant authority, off baseline payroll activity, an unregistered personal beneficiary, and same day withdrawal support the payment diversion finding.',
    Context: 'Fraudulent and 91% confidence are supplied in the source scenario. FND-1042 is the related Dusk dashboard fixture ID used to organize the finding.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario pp. 5–6. Verify session control, beneficiary ownership, approval scope, and the full affected account list. The finding is not proof of Marek’s identity or intent.',
  },
  safeguard: {
    Category: 'Proposed action · Review required',
    Title: 'Limit the reactivated authority while verifying control',
    Record: 'Scope: reactivated finance disbursement approval authority',
    Detail: 'Consider a temporary restriction of the reactivated authority while approval scope, session control, and beneficiary ownership are verified.',
    Context: 'Route legitimate payroll work to a verified approver. Keep any restriction limited to the reactivated scope and confirm affected accounts first.',
    Limits: 'No access change is performed here. The funds have already been withdrawn, so this action addresses further access and transfers.',
  },
  priorAuthority: {
    Category: 'Source context · Prior authority',
    Title: 'Finance disbursement rights remained active',
    Record: 'Granted six months earlier · Quarter close',
    Detail: 'Broad approval over finance disbursement accounts was approved for quarter close and was never revoked.',
    Context: 'D. Marek was on day 9 of a 30 day notice period. Normal activity rarely touched compensation or payroll accounts.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, scenario pp. 5–6; event appendix p. 7. This establishes authority and context, not the identity of the session operator.',
  },
  compAccount: {
    Category: 'Source account detail · Ledger class 641',
    Title: 'FY24 Comp & Equity Payroll',
    Record: 'Critical · PII, financial, and HR data · Risk 87',
    Detail: 'The source lists two external exposures for this account. The event appendix maps D. Marek to access ×14 and queue activity at 09:12.',
    Context: 'Ledger class 641 is a classification code, not an account ID. This named account is one example within the 14 Critical accounts accessed.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, account detail p. 6; event appendix p. 7. The appendix does not identify all 14 accounts.',
  },
  payrollAccount: {
    Category: 'Source account detail · Ledger class 642',
    Title: 'Payroll Master — EU',
    Record: 'Critical · PII and financial data · Internal · Risk 72',
    Detail: 'The event appendix maps the 09:40 transfer to this account and the personal destination, followed by the 22:07 withdrawal record.',
    Context: 'Ledger class 642 is a classification code, not an account ID. The personal transfer target is separately identified as external and restricted.',
    Limits: 'Source: Dusk UI & UX Lead Exercise, account detail p. 6; event appendix p. 7. Transfer amounts are not provided.',
  },
  investigation: {
    Category: 'Dashboard fixture · Existing investigation',
    Title: 'Marek payment chain',
    Record: 'INV-204 · Investigating · Owner Carla Rivas',
    Detail: 'Use the existing investigation to verify approval scope, session control, beneficiary ownership, and the complete affected account list.',
    Context: 'Related dashboard fixture: finding FND-1042. The investigation is the working space for evidence, notes, ownership, actions, and outcome.',
    Limits: 'INV-204, Carla Rivas, Investigating, and FND-1042 are design fixture fields from DASHBOARD-REVIEW.md, not facts from the exercise PDF.',
  },
};

const UI = `
<!doctype html>
<html>
<body style="margin:0;padding:14px;background:#111512;color:#eef5ef;font:13px/1.45 system-ui">
  <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
    <div><strong>Ask Dusk · text response</strong><div style="color:#9ba89f">Local, staged, network disabled</div></div>
    <button id="close">Close</button>
  </div>
  <div style="display:flex;gap:8px;margin:14px 0">
    <button id="prepare">Prepare components</button>
    <button id="apply" disabled>Apply response</button>
    <button id="verify">Verify / export</button>
  </div>
  <div id="status" style="min-height:38px;padding:10px;border:1px solid #2b382f;border-radius:8px;background:#161d18">Initializing…</div>
  <pre id="summary" style="white-space:pre-wrap;max-height:150px;overflow:auto;color:#b8c4bc"></pre>
  <div id="files" style="display:flex;flex-wrap:wrap;gap:12px"></div>
  <script>
    const send = type => parent.postMessage({pluginMessage:{type}}, '*');
    for (const id of ['prepare','apply','verify','close']) document.getElementById(id).onclick = () => send(id);
    function download(name, data, type) {
      const a = document.createElement('a');
      a.download = name;
      a.href = URL.createObjectURL(new Blob([data], {type}));
      a.textContent = 'Save ' + name;
      document.getElementById('files').appendChild(a);
    }
    onmessage = event => {
      const message = event.data.pluginMessage || {};
      if (message.status) document.getElementById('status').textContent = message.status;
      if (message.summary) document.getElementById('summary').textContent = message.summary;
      if (message.state) {
        document.getElementById('prepare').disabled = !!message.state.busy;
        document.getElementById('apply').disabled = !!message.state.busy || !message.state.prepared;
        document.getElementById('verify').disabled = !!message.state.busy;
      }
      if (message.audit) {
        document.getElementById('files').innerHTML = '';
        download('ask-dusk-text-response-audit.json', JSON.stringify(message.audit, null, 2), 'application/json');
        if (message.framePng) download('Ask-Dusk-text-response.png', new Uint8Array(message.framePng), 'image/png');
        if (message.answerPng) download('Ask-Dusk-text-answer-full.png', new Uint8Array(message.answerPng), 'image/png');
      }
    };
  </script>
</body>
</html>`;

figma.showUI(UI, { width: 680, height: 410, title: 'Ask Dusk · text response correction' });

let page;
let root;
let dashboard;
let navigation;
let workspace;
let actions;
let viewport;
let body;
let userRow;
let response;
let composerDock;
let library;
let variables = {};
let textStyles = [];
let prepared = false;
let applied = false;
let busy = true;
let baseline = {};
let components = {};
let destinations = {};
const createdNodeIds = [];
const mutatedNodeIds = [];
const removedNodeIds = [];
const linkLedger = [];

const unique = values => [...new Set(values.filter(Boolean))];

function recordCreated(node) {
  createdNodeIds.push(node.id);
  if ('findAll' in node) createdNodeIds.push(...node.findAll(() => true).map(child => child.id));
  return node;
}

function recordMutated(node) {
  mutatedNodeIds.push(node.id);
  return node;
}

function snapshot(node) {
  return JSON.stringify([node, ...node.findAll(() => true)].map(item => ({
    id: item.id,
    parentId: item.parent && item.parent.id,
    name: item.name,
    type: item.type,
    visible: 'visible' in item ? item.visible : undefined,
    bounds: item.absoluteBoundingBox,
    text: item.type === 'TEXT' ? item.characters : undefined,
    fills: 'fills' in item ? item.fills : undefined,
    strokes: 'strokes' in item ? item.strokes : undefined,
    reactions: 'reactions' in item ? item.reactions : undefined,
  })));
}

function required(node, label) {
  if (!node) throw new Error('Missing required node: ' + label);
  return node;
}

function paint(name) {
  const variable = required(variables['color/' + name], 'color/' + name);
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'color',
    variable,
  );
}

function bindSpace(node, property, value) {
  node[property] = value;
  const variable = variables['space/' + value];
  if (variable) node.setBoundVariable(property, variable);
}

function bindRadius(node, value) {
  node.cornerRadius = value;
  const variable = variables['radius/' + value];
  if (!variable) return;
  for (const property of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) {
    node.setBoundVariable(property, variable);
  }
}

function setupAuto(node, width, direction = 'VERTICAL', gap = 0, padding = 0, fixedHeight = null) {
  node.resize(width, fixedHeight == null ? Math.max(1, node.height) : fixedHeight);
  node.layoutMode = direction;
  node.layoutSizingHorizontal = 'FIXED';
  node.layoutSizingVertical = fixedHeight == null ? 'HUG' : 'FIXED';
  node.primaryAxisSizingMode = direction === 'VERTICAL'
    ? (fixedHeight == null ? 'AUTO' : 'FIXED')
    : 'FIXED';
  node.counterAxisSizingMode = direction === 'VERTICAL'
    ? 'FIXED'
    : (fixedHeight == null ? 'AUTO' : 'FIXED');
  node.fills = [];
  node.clipsContent = false;
  bindSpace(node, 'itemSpacing', gap);
  for (const property of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
    bindSpace(node, property, padding);
  }
  return node;
}

function makeFrame(parent, name, width, direction = 'VERTICAL', gap = 0, padding = 0, fixedHeight = null) {
  const frame = figma.createFrame();
  parent.appendChild(frame);
  frame.name = name;
  setupAuto(frame, width, direction, gap, padding, fixedHeight);
  recordCreated(frame);
  return frame;
}

function placeComponent(component) {
  const current = library.children.filter(node => node.type === 'COMPONENT' && node !== component);
  const bottom = current.reduce((max, node) => Math.max(max, node.y + node.height), 0);
  component.x = 2400;
  component.y = bottom + 96;
}

function makeComponent(name, width, direction = 'VERTICAL', gap = 0, padding = 0, fixedHeight = null) {
  const component = figma.createComponent();
  library.appendChild(component);
  component.name = name;
  component.description = SOURCE_MAP[name] || 'Dusk Ask Dusk response component.';
  setupAuto(component, width, direction, gap, padding, fixedHeight);
  placeComponent(component);
  recordCreated(component);
  return component;
}

async function addText(parent, name, value, width, size = 14, weight = 'Regular', color = 'text', propertyName = null) {
  await figma.loadFontAsync({ family: 'Geist', style: weight });
  const text = figma.createText();
  parent.appendChild(text);
  text.name = name;
  text.fontName = { family: 'Geist', style: weight };
  const style = textStyles.find(candidate => candidate.name === `Dusk / ${size} / ${weight}`);
  if (style) await text.setTextStyleIdAsync(style.id);
  text.fontSize = size;
  text.lineHeight = { unit: 'PIXELS', value: size === 16 ? 24 : size === 12 ? 16 : 20 };
  text.fills = [paint(color)];
  text.resize(width, 20);
  text.textAutoResize = 'HEIGHT';
  text.layoutSizingHorizontal = 'FIXED';
  text.layoutSizingVertical = 'HUG';
  text.characters = value;
  if (propertyName) {
    let owner = parent;
    while (owner && owner.type !== 'COMPONENT') owner = owner.parent;
    if (!owner) throw new Error('Editable text must be inside a component: ' + name);
    const key = owner.addComponentProperty(propertyName, 'TEXT', value);
    text.componentPropertyReferences = { characters: key };
  }
  recordCreated(text);
  return text;
}

function addArrow(parent, color = 'muted', size = 16) {
  const arrow = figma.createNodeFromSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#A3AEA7" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  );
  parent.appendChild(arrow);
  arrow.name = 'Lucide / arrow-right';
  arrow.resize(size, size);
  for (const node of arrow.findAll(() => true)) {
    if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length) node.strokes = [paint(color)];
  }
  recordCreated(arrow);
  return arrow;
}

function propKey(instance, baseName) {
  return Object.keys(instance.componentProperties).find(key => key.split('#')[0] === baseName);
}

function override(instance, values) {
  const properties = {};
  for (const [baseName, value] of Object.entries(values)) {
    const key = propKey(instance, baseName);
    if (!key) throw new Error(`Property ${baseName} missing on ${instance.name}`);
    properties[key] = value;
  }
  instance.setProperties(properties);
  recordMutated(instance);
  return instance;
}

function makeInstance(component, parent, name, width = null) {
  const instance = component.createInstance();
  parent.appendChild(instance);
  instance.name = name || component.name;
  if (width != null) instance.resize(width, instance.height);
  instance.layoutSizingHorizontal = 'FIXED';
  const hugsHeight = component.layoutMode === 'VERTICAL' && component.primaryAxisSizingMode === 'AUTO'
    || component.layoutMode === 'HORIZONTAL' && component.counterAxisSizingMode === 'AUTO';
  instance.layoutSizingVertical = hugsHeight ? 'HUG' : 'FIXED';
  recordCreated(instance);
  return instance;
}

function expose(instance) {
  if (Object.keys(instance.componentProperties).length) {
    instance.isExposedInstance = true;
    recordMutated(instance);
  }
  return instance;
}

async function linkNode(node, destinationId, role, navigation = 'OVERLAY') {
  required(await figma.getNodeByIdAsync(destinationId), 'link destination ' + destinationId);
  await node.setReactionsAsync([{
    trigger: { type: 'ON_CLICK' },
    actions: [{
      type: 'NODE',
      destinationId,
      navigation,
      transition: null,
      resetScrollPosition: false,
    }],
  }]);
  recordMutated(node);
  linkLedger.push({ nodeId: node.id, nodeName: node.name, role, destinationId, navigation });
  return node;
}

function exactComponent(name) {
  const matches = library.children.filter(node => node.type === 'COMPONENT' && node.name === name);
  if (matches.length > 1) throw new Error('Duplicate component name requires inspection: ' + name);
  return matches[0] || null;
}

async function getOrCreate(name, builder) {
  const alias = Object.keys(COMPONENT_NAMES).find(key => COMPONENT_NAMES[key] === name);
  const existing = exactComponent(name);
  if (existing) {
    components[name] = existing;
    if (alias) components[alias] = existing;
    return existing;
  }
  const created = await builder();
  components[name] = created;
  if (alias) components[alias] = created;
  return created;
}

async function existingComponent(id, label) {
  const component = required(await figma.getNodeByIdAsync(id), label);
  if (component.type !== 'COMPONENT') throw new Error(label + ' must be a component');
  return component;
}

function findDetailInstance(frame) {
  return frame.findOne(node => node.type === 'INSTANCE' && node.name.startsWith('Dialog /'))
    || frame.findOne(node => node.type === 'INSTANCE');
}

async function createDetailFrame(key, title, copy, index) {
  const existing = page.children.find(node => node.name === title);
  if (existing) {
    destinations[key] = existing.id;
    return existing;
  }
  const detailFrames = page.children.filter(node => node.name.startsWith('Ask Dusk / Detail /'));
  const bottom = detailFrames.reduce((max, node) => Math.max(max, node.y + node.height), root.y + root.height);
  const frame = figma.createFrame();
  page.appendChild(frame);
  frame.name = title;
  setupAuto(frame, 620, 'VERTICAL', 0, 0);
  frame.x = root.x + root.width + 200 + (index % 2) * 700;
  frame.y = bottom + 80 + Math.floor(index / 2) * 640;
  frame.fills = [];
  frame.clipsContent = false;
  const dialog = makeInstance(components.dialog, frame, 'Dialog / ' + key, 620);
  override(dialog, copy);
  dialog.layoutSizingVertical = 'HUG';
  frame.layoutSizingVertical = 'HUG';
  recordCreated(frame);
  destinations[key] = frame.id;
  return frame;
}

async function updateDetailFrame(frameId, copy) {
  const frame = required(await figma.getNodeByIdAsync(frameId), 'detail frame ' + frameId);
  const instance = required(findDetailInstance(frame), 'Dialog instance in ' + frameId);
  override(instance, copy);
  instance.layoutSizingVertical = 'HUG';
  frame.layoutSizingVertical = 'HUG';
  recordMutated(frame);
  return frame;
}

async function stabilizeComponents() {
  const localComponents = [...new Map(Object.values(components).filter(node => node && node.type === 'COMPONENT').map(node => [node.id, node])).values()];
  for (let pass = 0; pass < 3; pass += 1) {
    for (const component of localComponents) {
      for (const instance of component.findAllWithCriteria({ types: ['INSTANCE'] })) {
        const main = await instance.getMainComponentAsync();
        if (!main) continue;
        const hugsHeight = main.layoutMode === 'VERTICAL' && main.primaryAxisSizingMode === 'AUTO'
          || main.layoutMode === 'HORIZONTAL' && main.counterAxisSizingMode === 'AUTO';
        instance.layoutSizingVertical = hugsHeight ? 'HUG' : 'FIXED';
        recordMutated(instance);
      }
    }
  }
}

async function buildLinkComponent() {
  const component = makeComponent(COMPONENT_NAMES.link, 248, 'HORIZONTAL', 4, 0, 24);
  component.primaryAxisAlignItems = 'MIN';
  component.counterAxisAlignItems = 'CENTER';
  const label = await addText(component, 'Label', 'View source event', 224, 14, 'Medium', 'accent', 'Label');
  label.layoutSizingHorizontal = 'FILL';
  addArrow(component, 'accent', 16);
  return component;
}

async function buildAttributionComponent() {
  const component = makeComponent(COMPONENT_NAMES.attribution, 1120, 'HORIZONTAL', 8, 0, 20);
  component.counterAxisAlignItems = 'CENTER';
  const mark = required(await figma.getNodeByIdAsync(IDS.duskMark), 'Dusk mark').clone();
  component.appendChild(mark);
  mark.name = 'Dusk / Mark';
  mark.resize(16, 16);
  recordCreated(mark);
  await addText(component, 'Name', 'Dusk', 72, 14, 'Medium', 'text', 'Name');
  return component;
}

async function buildProseComponent() {
  const component = makeComponent(COMPONENT_NAMES.prose, 1120, 'VERTICAL', 0, 0);
  await addText(component, 'Body', 'Response text', 1120, 16, 'Regular', 'text', 'Body');
  return component;
}

async function makeLink(parent, label, destinationId, role, width = 248) {
  const instance = expose(makeInstance(components.link, parent, 'Button / link / ' + label, Math.max(248, width)));
  override(instance, { Label: label });
  await linkNode(instance, destinationId, role);
  return instance;
}

async function buildBackgroundComponent() {
  const component = makeComponent(COMPONENT_NAMES.background, 1120, 'VERTICAL', 12, 0);
  const prose = expose(makeInstance(components.prose, component, 'Bubble / ghost / Background', 1120));
  override(prose, {
    Body: 'The authority came from a quarter-close project six months earlier and was never revoked. Marek was on day 9 of a 30-day notice period and rarely touched compensation or payroll in normal work. The old grant left a route into these accounts after the original project had ended.',
  });
  const links = makeFrame(component, 'Reference links', 1120, 'HORIZONTAL', 16, 0);
  links.counterAxisAlignItems = 'CENTER';
  await makeLink(links, 'Prior authority', destinations.priorAuthority, 'background prior authority', 180);
  await makeLink(links, 'D. Marek', destinations.marek, 'background actor', 160);
  await makeLink(links, 'FY24 Comp & Equity Payroll', destinations.compAccount, 'background account', 248);
  await makeLink(links, 'Payroll Master — EU', destinations.payrollAccount, 'background account', 220);
  return component;
}

async function buildFlowStepComponent() {
  const component = makeComponent(COMPONENT_NAMES.flowStep, 250, 'VERTICAL', 4, 0);
  await addText(component, 'Time', '09:12', 250, 12, 'Medium', 'muted', 'Time');
  await addText(component, 'Event', 'Access and queue', 250, 14, 'Medium', 'text', 'Event');
  await addText(component, 'Entity', 'D. Marek authority → FY24 Comp & Equity Payroll', 250, 12, 'Regular', 'muted', 'Entity');
  const source = expose(makeInstance(components.link, component, 'Button / link / Source', 248));
  override(source, { Label: 'View source event' });
  return component;
}

async function configureFlowStep(parent, values, destinationId, role) {
  const step = expose(makeInstance(components.flowStep, parent, 'FlowStep / ' + values.Event, 250));
  override(step, values);
  await linkNode(step, destinationId, role + ' step');
  const source = required(step.findOne(node => node.type === 'INSTANCE' && node.name === 'Button / link / Source'), 'flow source link');
  await linkNode(source, destinationId, role + ' source');
  return step;
}

async function buildFlowComponent() {
  const component = makeComponent(COMPONENT_NAMES.flow, 1120, 'VERTICAL', 12, 0);
  const heading = makeFrame(component, 'MessageHeader / Event flow', 1120, 'HORIZONTAL', 16, 0, 20);
  heading.counterAxisAlignItems = 'CENTER';
  await addText(heading, 'Title', 'Event flow', 760, 14, 'Medium', 'text');
  await addText(heading, 'Source label', 'Recorded source sequence', 344, 12, 'Regular', 'muted');
  const row = makeFrame(component, 'Event flow / Four steps', 1120, 'HORIZONTAL', 8, 0);
  row.counterAxisAlignItems = 'CENTER';
  const data = [
    [{ Time: '6 months earlier', Event: 'Broad rights remained active', Entity: 'Finance disbursement accounts', Label: 'View authority' }, destinations.priorAuthority, 'prior authority'],
    [{ Time: 'Tuesday 09:12', Event: 'Access and queue', Entity: 'D. Marek authority → FY24 Comp & Equity Payroll', Label: 'View access event' }, destinations.access, '09:12 access event'],
    [{ Time: 'Tuesday 09:40', Event: 'Two external transfers', Entity: 'D. Marek → Payroll Master — EU', Label: 'View transfer event' }, destinations.transfer, '09:40 transfer event'],
    [{ Time: 'Tuesday 22:07', Event: 'Funds withdrawn', Entity: 'Personal beneficiary → Payroll Master — EU', Label: 'View withdrawal event' }, destinations.withdrawal, '22:07 withdrawal event'],
  ];
  for (let index = 0; index < data.length; index += 1) {
    const [values, destinationId, role] = data[index];
    const label = values.Label;
    delete values.Label;
    const step = await configureFlowStep(row, values, destinationId, role);
    override(step.findOne(node => node.type === 'INSTANCE' && node.name === 'Button / link / Source'), { Label: label });
    if (index < data.length - 1) addArrow(row, 'quiet', 16);
  }
  return component;
}

async function buildEventComponent() {
  const component = makeComponent(COMPONENT_NAMES.event, 1120, 'HORIZONTAL', 16, 0);
  component.counterAxisAlignItems = 'MIN';
  await addText(component, 'Time', '09:12', 96, 14, 'Medium', 'muted', 'Time');
  const content = makeFrame(component, 'Event content', 1008, 'VERTICAL', 4, 0);
  await addText(content, 'Title', 'Event title', 1008, 16, 'Medium', 'text', 'Title');
  await addText(content, 'Fact', 'Recorded event fact.', 1008, 16, 'Regular', 'text', 'Fact');
  await addText(content, 'Why', 'Why it matters: causal meaning.', 1008, 14, 'Regular', 'muted', 'Why');
  const links = makeFrame(content, 'Event links', 1008, 'HORIZONTAL', 16, 0);
  const source = expose(makeInstance(components.link, links, 'Button / link / Source event', 208));
  override(source, { Label: 'View source event' });
  const context = expose(makeInstance(components.link, links, 'Button / link / Account detail', 232));
  override(context, { Label: 'View account detail' });
  return component;
}

async function configureEvent(parent, values, sourceDestination, contextDestination, role) {
  const event = expose(makeInstance(components.event, parent, 'EventParagraph / ' + values.Time, 1120));
  override(event, {
    Time: values.Time,
    Title: values.Title,
    Fact: values.Fact,
    Why: values.Why,
  });
  const source = required(event.findOne(node => node.type === 'INSTANCE' && node.name === 'Button / link / Source event'), 'event source link');
  const context = required(event.findOne(node => node.type === 'INSTANCE' && node.name === 'Button / link / Account detail'), 'event context link');
  override(source, { Label: values.SourceLabel });
  override(context, { Label: values.ContextLabel });
  await linkNode(source, sourceDestination, role + ' source');
  await linkNode(context, contextDestination, role + ' account');
  return event;
}

async function addDivider(parent, width) {
  const divider = figma.createRectangle();
  parent.appendChild(divider);
  divider.name = 'Divider';
  divider.resize(width, 1);
  divider.fills = [paint('border')];
  recordCreated(divider);
  return divider;
}

async function buildChronologyComponent() {
  const component = makeComponent(COMPONENT_NAMES.chronology, 1120, 'VERTICAL', 16, 0);
  await addText(component, 'Heading', 'Recorded events', 1120, 16, 'Medium', 'text', 'Heading');
  const events = [
    [{
      Time: '09:12',
      Title: 'Dormant approval rights were used to access payroll accounts',
      Fact: 'Activity attributed to D. Marek reached 14 Critical finance accounts and queued payments in 20 minutes, at 12× normal volume. The access record names FY24 Comp & Equity Payroll and an unusual counterparty.',
      Why: 'The previously dormant rights were now being used for activity outside Marek’s normal payroll access.',
      SourceLabel: 'Open 09:12 event',
      ContextLabel: 'Open FY24 Comp & Equity Payroll',
    }, destinations.access, destinations.compAccount, '09:12 event paragraph'],
    [{
      Time: '09:40',
      Title: 'Two transfers reached an unregistered personal beneficiary',
      Fact: 'Two payments were routed from Payroll Master — EU to a personal account absent from the payee master. The event records an external, restricted target.',
      Why: 'This is where unusual access became a transfer of funds outside the registered payee set.',
      SourceLabel: 'Open 09:40 event',
      ContextLabel: 'Open Payroll Master — EU',
    }, destinations.transfer, destinations.payrollAccount, '09:40 event paragraph'],
    [{
      Time: '22:07',
      Title: 'The transferred funds were withdrawn later the same day',
      Fact: 'The external transfer was confirmed and drawn down using an unrecognized device in a new geography. The withdrawal record links the personal beneficiary to Payroll Master — EU.',
      Why: 'The funds had left the payment chain by that evening; a hold on those completed transfers would be too late.',
      SourceLabel: 'Open 22:07 event',
      ContextLabel: 'Open Payroll Master — EU',
    }, destinations.withdrawal, destinations.payrollAccount, '22:07 event paragraph'],
  ];
  for (let index = 0; index < events.length; index += 1) {
    const [values, sourceDestination, contextDestination, role] = events[index];
    await configureEvent(component, values, sourceDestination, contextDestination, role);
    if (index < events.length - 1) await addDivider(component, 1120);
  }
  return component;
}

async function buildInterpretationComponent() {
  const component = makeComponent(COMPONENT_NAMES.interpretation, 1120, 'VERTICAL', 8, 16);
  component.fills = [paint('inset')];
  bindRadius(component, 12);
  const header = makeFrame(component, 'Interpretation header', 1088, 'HORIZONTAL', 8, 0, 24);
  header.counterAxisAlignItems = 'CENTER';
  await addText(header, 'Heading', 'Dusk interpretation', 164, 14, 'Medium', 'text', 'Heading');
  const badge = expose(makeInstance(components.badge, header, 'Badge / Fraudulent'));
  override(badge, { Label: 'Fraudulent' });
  await addText(header, 'Confidence', '91% confidence', 120, 12, 'Regular', 'muted', 'Confidence');
  await addText(component, 'Assessment', 'The unused approval grant, unusual payroll activity, unregistered beneficiary and same-day withdrawal support a payment diversion finding. The 91% confidence applies to that activity pattern.', 1088, 14, 'Regular', 'text', 'Assessment');
  await addText(component, 'Uncertainty', 'The records do not establish that Marek personally controlled the sessions or intended the transfers. Session control, beneficiary ownership and the complete list of 14 affected accounts remain unverified.', 1088, 14, 'Regular', 'muted', 'Uncertainty');
  await makeLink(component, 'Open finding detail', destinations.assessment, 'Dusk interpretation detail', 208);
  return component;
}

async function buildNextActionComponent() {
  const component = makeComponent(COMPONENT_NAMES.nextAction, 1120, 'VERTICAL', 8, 0);
  await addText(component, 'Heading', 'What to do next', 1120, 16, 'Medium', 'text', 'Heading');
  await addText(component, 'Action', 'Continue in INV-204. Verify the affected accounts, active approval scope, session control and beneficiary ownership. Consider temporarily restricting the reactivated authority, with legitimate payroll routed to a verified approver.', 1120, 14, 'Regular', 'text', 'Action');
  await addText(component, 'Scope', 'Because these funds have already been withdrawn, the proposed restriction is meant to prevent further activity.', 1120, 14, 'Regular', 'muted', 'Scope');
  const controls = makeFrame(component, 'Next action controls', 1120, 'HORIZONTAL', 16, 0);
  const open = expose(makeInstance(components.buttonOutline, controls, 'Button / Open INV-204', 180));
  override(open, { Label: 'Open INV-204' });
  await linkNode(open, destinations.investigation, 'open existing investigation');
  await makeLink(controls, 'Review safeguard scope', destinations.safeguard, 'review proposed safeguard', 232);
  return component;
}

async function buildComposerInputComponent() {
  const component = makeComponent(COMPONENT_NAMES.composerInput, 1120, 'HORIZONTAL', 12, 12, 56);
  bindSpace(component, 'paddingTop', 8);
  bindSpace(component, 'paddingBottom', 8);
  component.counterAxisAlignItems = 'CENTER';
  component.fills = [paint('inset')];
  component.strokes = [paint('border')];
  component.strokeWeight = 1;
  bindRadius(component, 8);
  const textarea = expose(makeInstance(components.textarea, component, 'Textarea / Blank', 1048));
  override(textarea, { Placeholder: 'Ask a follow-up…' });
  textarea.layoutSizingHorizontal = 'FIXED';
  textarea.layoutSizingVertical = 'FIXED';
  textarea.resize(1048, 40);
  const send = expose(makeInstance(components.sendDisabled, component, 'InputGroupButton / Send / Disabled', 32));
  send.resize(32, 32);
  send.layoutSizingVertical = 'FIXED';
  return component;
}

async function suggestionButton(parent, label, destinationId, role, width) {
  const button = expose(makeInstance(components.buttonOutline, parent, 'Button / Suggested question / ' + label, width));
  override(button, { Label: label });
  await linkNode(button, destinationId, role);
  return button;
}

async function buildComposerComponent() {
  const component = makeComponent(COMPONENT_NAMES.composer, 1120, 'VERTICAL', 12, 0);
  await addText(component, 'Helper', 'Suggested questions', 1120, 12, 'Regular', 'muted', 'Helper');
  const suggestions = makeFrame(component, 'Suggested questions', 1120, 'HORIZONTAL', 8, 0, 32);
  suggestions.counterAxisAlignItems = 'CENTER';
  await suggestionButton(suggestions, 'Which accounts were affected?', destinations.accounts, 'suggested question accounts', 276);
  await suggestionButton(suggestions, 'Who controlled the session?', destinations.assessment, 'suggested question uncertainty', 252);
  await suggestionButton(suggestions, 'Who owns the beneficiary?', destinations.beneficiary, 'suggested question beneficiary', 256);
  expose(makeInstance(components.composerInput, component, 'InputGroup / Blank composer', 1120));
  return component;
}

async function buildAnswerComponent() {
  const component = makeComponent(COMPONENT_NAMES.answer, 1120, 'VERTICAL', 24, 0);
  component.fills = [paint('background')];
  expose(makeInstance(components.attribution, component, 'MessageHeader / Dusk', 1120));
  const direct = expose(makeInstance(components.prose, component, 'Bubble / ghost / Direct answer', 1120));
  override(direct, {
    Body: 'D. Marek’s dormant approval authority was used to access 14 Critical finance accounts, queue payments and route two transfers to a personal beneficiary outside the payee master. By 22:07 on Tuesday, the funds had been withdrawn using an unrecognized device in a new geography.',
  });
  expose(makeInstance(components.background, component, 'MessageContent / Linked background', 1120));
  expose(makeInstance(components.flow, component, 'MessageContent / Compact event flow', 1120));
  expose(makeInstance(components.chronology, component, 'MessageContent / Recorded events', 1120));
  expose(makeInstance(components.interpretation, component, 'MessageContent / Dusk interpretation', 1120));
  expose(makeInstance(components.nextAction, component, 'MessageContent / What to do next', 1120));
  return component;
}

function hydrateDestinations() {
  destinations = {
    access: IDS.accessDetail,
    transfer: IDS.transferDetail,
    withdrawal: IDS.withdrawalDetail,
    marek: IDS.marekDetail,
    accounts: IDS.accountsDetail,
    beneficiary: IDS.beneficiaryDetail,
    assessment: IDS.assessmentDetail,
    safeguard: IDS.safeguardDetail,
  };
  const named = {
    priorAuthority: 'Ask Dusk / Detail / Prior authority',
    compAccount: 'Ask Dusk / Detail / FY24 Comp & Equity Payroll',
    payrollAccount: 'Ask Dusk / Detail / Payroll Master — EU',
    investigation: 'Ask Dusk / Detail / INV-204',
  };
  for (const [key, name] of Object.entries(named)) {
    const node = page.children.find(child => child.name === name);
    if (node) destinations[key] = node.id;
  }
}

async function prepareComponents() {
  hydrateDestinations();
  components.buttonOutline = await existingComponent(IDS.buttonOutline, 'Dusk outline button');
  components.buttonGhost = await existingComponent(IDS.buttonGhost, 'Dusk ghost button');
  components.badge = await existingComponent(IDS.badgeFraud, 'Dusk fraud badge');
  components.dialog = await existingComponent(IDS.dialog, 'Dusk detail dialog');
  components.textarea = await existingComponent(IDS.textarea, 'Dusk empty textarea');
  components.sendDisabled = await existingComponent(IDS.sendDisabled, 'Dusk disabled send button');

  await getOrCreate(COMPONENT_NAMES.link, buildLinkComponent);
  await getOrCreate(COMPONENT_NAMES.attribution, buildAttributionComponent);
  await getOrCreate(COMPONENT_NAMES.prose, buildProseComponent);

  await createDetailFrame('priorAuthority', 'Ask Dusk / Detail / Prior authority', DETAIL_COPY.priorAuthority, 0);
  await createDetailFrame('compAccount', 'Ask Dusk / Detail / FY24 Comp & Equity Payroll', DETAIL_COPY.compAccount, 1);
  await createDetailFrame('payrollAccount', 'Ask Dusk / Detail / Payroll Master — EU', DETAIL_COPY.payrollAccount, 2);
  await createDetailFrame('investigation', 'Ask Dusk / Detail / INV-204', DETAIL_COPY.investigation, 3);

  await getOrCreate(COMPONENT_NAMES.background, buildBackgroundComponent);
  await getOrCreate(COMPONENT_NAMES.flowStep, buildFlowStepComponent);
  await getOrCreate(COMPONENT_NAMES.flow, buildFlowComponent);
  await getOrCreate(COMPONENT_NAMES.event, buildEventComponent);
  await getOrCreate(COMPONENT_NAMES.chronology, buildChronologyComponent);
  await getOrCreate(COMPONENT_NAMES.interpretation, buildInterpretationComponent);
  await getOrCreate(COMPONENT_NAMES.nextAction, buildNextActionComponent);
  await getOrCreate(COMPONENT_NAMES.composerInput, buildComposerInputComponent);
  await getOrCreate(COMPONENT_NAMES.composer, buildComposerComponent);
  await getOrCreate(COMPONENT_NAMES.answer, buildAnswerComponent);
  await stabilizeComponents();

  prepared = Object.values(COMPONENT_NAMES).every(name => !!exactComponent(name));
  if (!prepared) throw new Error('Prepare stopped before every required component existed. Inspect exact component names before retrying.');
  figma.commitUndo();
  const preparedAnswer = components.answer || components[COMPONENT_NAMES.answer];
  figma.currentPage.selection = [preparedAnswer];
  figma.viewport.scrollAndZoomIntoView([preparedAnswer]);
  postState(
    'Components prepared. The existing response is unchanged.',
    `${Object.values(COMPONENT_NAMES).length} response components ready\nPrepared answer main: ${preparedAnswer.id}\n${Object.keys(destinations).length} specific detail destinations ready\nApply response is now enabled.`,
  );
}

async function applyResponse() {
  if (!prepared) throw new Error('Run Prepare components first in this plugin session.');
  // Let compact source links size to their editable labels, avoiding wrapped
  // text inside a fixed-height button when account names are longer.
  for (const name of Object.values(COMPONENT_NAMES)) {
    const component = exactComponent(name);
    for (const instance of component.findAllWithCriteria({ types: ['INSTANCE'] })) {
      if (!instance.name.startsWith('Button / link /')) continue;
      const label = instance.findOne(node => node.type === 'TEXT' && node.name === 'Label');
      if (!label) continue;
      label.textAutoResize = 'WIDTH_AND_HEIGHT';
      label.layoutSizingHorizontal = 'HUG';
      instance.primaryAxisSizingMode = 'AUTO';
      instance.layoutSizingHorizontal = 'HUG';
      recordMutated(instance);
      recordMutated(label);
    }
  }
  const interpretation = exactComponent(COMPONENT_NAMES.interpretation);
  const verdictBadge = interpretation.findOne(node => node.type === 'INSTANCE' && node.name === 'Badge / Fraudulent');
  verdictBadge.resize(96, 24);
  recordMutated(verdictBadge);
  const answerMainComponent = exactComponent(COMPONENT_NAMES.answer);
  answerMainComponent.fills = [paint('background')];
  recordMutated(answerMainComponent);
  hydrateDestinations();
  if (!destinations.priorAuthority || !destinations.compAccount || !destinations.payrollAccount || !destinations.investigation) {
    throw new Error('Prepared detail destinations are missing. Run Prepare components again.');
  }

  await updateDetailFrame(IDS.accessDetail, DETAIL_COPY.access);
  await updateDetailFrame(IDS.transferDetail, DETAIL_COPY.transfer);
  await updateDetailFrame(IDS.withdrawalDetail, DETAIL_COPY.withdrawal);
  await updateDetailFrame(IDS.marekDetail, DETAIL_COPY.marek);
  await updateDetailFrame(IDS.accountsDetail, DETAIL_COPY.accounts);
  await updateDetailFrame(IDS.beneficiaryDetail, DETAIL_COPY.beneficiary);
  await updateDetailFrame(IDS.assessmentDetail, DETAIL_COPY.assessment);
  await updateDetailFrame(IDS.safeguardDetail, DETAIL_COPY.safeguard);

  let answerInstance = response.children[0];
  const currentAnswerMain = answerInstance && answerInstance.type === 'INSTANCE' ? await answerInstance.getMainComponentAsync() : null;
  if (!currentAnswerMain || currentAnswerMain.name !== COMPONENT_NAMES.answer) {
    for (const child of [...response.children]) {
      removedNodeIds.push(child.id, ...child.findAll(() => true).map(node => node.id));
      child.remove();
    }
    answerInstance = makeInstance(components[COMPONENT_NAMES.answer], response, 'MessageContent / Payment-chain text answer', 1120);
  }
  answerInstance.layoutSizingVertical = 'HUG';
  response.layoutSizingVertical = 'HUG';
  recordMutated(response);

  let composerInstance = composerDock.children[0];
  const currentComposerMain = composerInstance && composerInstance.type === 'INSTANCE' ? await composerInstance.getMainComponentAsync() : null;
  if (!currentComposerMain || currentComposerMain.name !== COMPONENT_NAMES.composer) {
    for (const child of [...composerDock.children]) {
      removedNodeIds.push(child.id, ...child.findAll(() => true).map(node => node.id));
      child.remove();
    }
    composerInstance = makeInstance(components[COMPONENT_NAMES.composer], composerDock, 'Composer / Suggested questions and blank input', 1120);
  }
  composerInstance.layoutSizingVertical = 'HUG';
  setupAuto(composerDock, 1120, 'VERTICAL', 0, 0, 144);
  bindSpace(composerDock, 'paddingTop', 12);
  composerDock.fills = [paint('background')];
  recordMutated(composerDock);

  setupAuto(body, 1120, 'VERTICAL', 24, 0);
  bindSpace(body, 'paddingTop', 8);
  bindSpace(body, 'paddingBottom', 24);
  body.layoutSizingVertical = 'HUG';
  recordMutated(body);

  viewport.resize(1304, 816);
  viewport.layoutSizingVertical = 'FIXED';
  viewport.counterAxisAlignItems = 'CENTER';
  viewport.clipsContent = true;
  viewport.overflowDirection = 'VERTICAL';
  recordMutated(viewport);

  workspace.resize(1304, 1008);
  workspace.layoutSizingVertical = 'FIXED';
  recordMutated(workspace);
  root.resize(1440, 1040);
  root.layoutSizingVertical = 'FIXED';
  recordMutated(root);

  applied = true;
  figma.commitUndo();
  postState(
    'Text-led response applied in place. Use Verify / export for the full audit and PNGs.',
    `Answer height: ${Math.round(answerInstance.height)} px\nViewport: ${viewport.width} × ${viewport.height}\nComposer: y ${composerDock.y}, height ${composerDock.height}\nDashboard, navigation, user message, and back control snapshots remain available for verification.`,
  );
}

async function componentAudit() {
  const result = [];
  const all = {
    ButtonOutline: components.buttonOutline,
    BadgeFraud: components.badge,
    Dialog: components.dialog,
    Textarea: components.textarea,
    SendDisabled: components.sendDisabled,
  };
  for (const name of Object.values(COMPONENT_NAMES)) all[name] = exactComponent(name);
  for (const [role, component] of Object.entries(all)) {
    if (!component) continue;
    result.push({
      role,
      id: component.id,
      name: component.name,
      description: component.description,
      source: SOURCE_MAP[component.name] || 'Existing Dusk component mapped from local shadcn source.',
      properties: component.componentPropertyDefinitions,
      width: component.width,
      height: component.height,
    });
  }
  return result;
}

async function verifyAndExport() {
  hydrateDestinations();
  const answerInstance = response.children.length === 1 && response.children[0].type === 'INSTANCE'
    ? response.children[0]
    : null;
  const answerMain = answerInstance ? await answerInstance.getMainComponentAsync() : null;
  const expectedAnswer = exactComponent(COMPONENT_NAMES.answer);
  const allText = workspace.findAllWithCriteria({ types: ['TEXT'] });
  const answerText = answerInstance ? answerInstance.findAllWithCriteria({ types: ['TEXT'] }) : [];
  const renderedInstances = answerInstance ? answerInstance.findAllWithCriteria({ types: ['INSTANCE'] }) : [];
  const renderedInstanceMap = [];
  for (const instance of renderedInstances) {
    const main = await instance.getMainComponentAsync();
    renderedInstanceMap.push({ id: instance.id, name: instance.name, mainComponentId: main && main.id, mainComponentName: main && main.name });
  }
  const clickables = workspace.findAll(node => 'reactions' in node && node.reactions.length);
  const renderedLinks = clickables.map(node => ({ id: node.id, name: node.name, reactions: node.reactions }));
  const missingDestinations = [];
  for (const [key, id] of Object.entries(destinations)) if (!await figma.getNodeByIdAsync(id)) missingDestinations.push(key);
  const geometryIssues = [];
  for (const text of allText) {
    const parent = text.parent;
    const box = text.absoluteBoundingBox;
    const parentBox = parent && 'absoluteBoundingBox' in parent ? parent.absoluteBoundingBox : null;
    if (!box || !parentBox) continue;
    if (box.x < parentBox.x - 1 || box.x + box.width > parentBox.x + parentBox.width + 1
      || box.y < parentBox.y - 1 || box.y + box.height > parentBox.y + parentBox.height + 1) {
      geometryIssues.push({ id: text.id, name: text.name, parentId: parent.id, parentName: parent.name, box, parentBox });
    }
  }
  const bannedCopy = allText.filter(text => /vega dynamics|^you$|hold the funds|ledger class (641|642) account id/i.test(text.characters));
  const audit = {
    status: 'Ask Dusk text response audit',
    fileKey: figma.fileKey,
    root: { id: root.id, name: root.name, bounds: root.absoluteBoundingBox },
    preserved: {
      dashboard: snapshot(dashboard) === baseline.dashboard,
      navigation: snapshot(navigation) === baseline.navigation,
      workspaceActionsAndBack: snapshot(actions) === baseline.actions,
      userMessage: snapshot(userRow) === baseline.userRow,
    },
    requiredGeometry: {
      root: { width: root.width, height: root.height },
      workspace: { width: workspace.width, height: workspace.height },
      viewport: { width: viewport.width, height: viewport.height, overflowDirection: viewport.overflowDirection, clipsContent: viewport.clipsContent },
      body: { width: body.width, height: body.height },
      response: { width: response.width, height: response.height },
      composerDock: { width: composerDock.width, height: composerDock.height, y: composerDock.y, bottom: composerDock.y + composerDock.height },
    },
    response: {
      singleAnswerInstance: !!answerInstance,
      answerInstanceId: answerInstance && answerInstance.id,
      answerMainComponentId: answerMain && answerMain.id,
      expectedAnswerMainComponentId: expectedAnswer && expectedAnswer.id,
      answerMainMatches: !!answerMain && !!expectedAnswer && answerMain.id === expectedAnswer.id,
      answerHeight: answerInstance && answerInstance.height,
      viewportHeight: viewport.height,
      scrollRequired: !!answerInstance && body.height > viewport.height,
      textCharacters: answerText.reduce((sum, text) => sum + text.characters.length, 0),
    },
    fonts: {
      expectedFamily: 'Geist',
      mismatches: allText.filter(text => text.fontName === figma.mixed || text.fontName.family !== 'Geist').map(text => ({ id: text.id, name: text.name, fontName: text.fontName })),
    },
    componentMap: await componentAudit(),
    renderedInstanceMap,
    destinations,
    linkLedger,
    renderedLinks,
    missingDestinations,
    geometryIssues,
    bannedCopy: bannedCopy.map(text => ({ id: text.id, name: text.name, text: text.characters })),
    createdNodeIds: unique([
      ...createdNodeIds,
      ...Object.values(COMPONENT_NAMES).flatMap(name => { const node = exactComponent(name); return node ? [node.id, ...node.findAll(() => true).map(child => child.id)] : []; }),
      ...await Promise.all(['priorAuthority', 'compAccount', 'payrollAccount', 'investigation'].filter(key => destinations[key]).map(async key => { const node = await figma.getNodeByIdAsync(destinations[key]); return [node.id, ...node.findAll(() => true).map(child => child.id)]; })).then(items => items.flat()),
      ...[answerInstance, composerDock.children[0]].filter(Boolean).flatMap(node => [node.id, ...node.findAll(() => true).map(child => child.id)]),
    ]),
    mutatedNodeIds: unique([...mutatedNodeIds, library.id]),
    removedNodeIds: unique(removedNodeIds),
    verificationChecks: {
      shellDimensions: root.width === 1440 && root.height === 1040 && workspace.width === 1304 && workspace.height === 1008,
      viewportAndDock: viewport.width === 1304 && viewport.height === 816 && composerDock.width === 1120 && composerDock.height === 144 && composerDock.y === 864,
      responseComponent: !!answerMain && !!expectedAnswer && answerMain.id === expectedAnswer.id,
      preservedSnapshots: snapshot(dashboard) === baseline.dashboard && snapshot(navigation) === baseline.navigation && snapshot(actions) === baseline.actions && snapshot(userRow) === baseline.userRow,
      specificDestinations: missingDestinations.length === 0,
      geistOnly: allText.every(text => text.fontName !== figma.mixed && text.fontName.family === 'Geist'),
      noBannedCopy: bannedCopy.length === 0,
      noTextGeometryIssues: geometryIssues.length === 0,
    },
  };
  const failures = Object.entries(audit.verificationChecks).filter(([, passed]) => !passed).map(([name]) => name);
  const framePng = await root.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1 } });
  const answerPng = answerMain
    ? await answerMain.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1 } })
    : null;
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.ui.postMessage({
    status: failures.length ? 'Verification found: ' + failures.join(', ') : 'Verification passed. Review both PNGs before approval.',
    summary: `Preserved: dashboard ${audit.preserved.dashboard}, navigation ${audit.preserved.navigation}, back ${audit.preserved.workspaceActionsAndBack}, user message ${audit.preserved.userMessage}\nAnswer instance: ${audit.response.answerMainMatches}\nComponents: ${audit.componentMap.length}\nRendered links: ${audit.renderedLinks.length}\nGeometry issues: ${audit.geometryIssues.length}\nFont mismatches: ${audit.fonts.mismatches.length}`,
    state: { busy: false, prepared, applied },
    audit,
    framePng: Array.from(framePng),
    answerPng: answerPng ? Array.from(answerPng) : null,
  });
}

function postState(status, summary = '') {
  figma.ui.postMessage({ status, summary, state: { busy, prepared, applied } });
}

async function initialize() {
  const nodes = await Promise.all([
    figma.getNodeByIdAsync(IDS.root),
    figma.getNodeByIdAsync(IDS.dashboard),
    figma.getNodeByIdAsync(IDS.navigation),
    figma.getNodeByIdAsync(IDS.workspace),
    figma.getNodeByIdAsync(IDS.actions),
    figma.getNodeByIdAsync(IDS.viewport),
    figma.getNodeByIdAsync(IDS.body),
    figma.getNodeByIdAsync(IDS.userRow),
    figma.getNodeByIdAsync(IDS.response),
    figma.getNodeByIdAsync(IDS.composerDock),
    figma.getNodeByIdAsync(IDS.library),
  ]);
  [root, dashboard, navigation, workspace, actions, viewport, body, userRow, response, composerDock, library] = nodes;
  required(root, 'Ask Dusk root');
  required(dashboard, 'dashboard');
  required(navigation, 'navigation');
  required(workspace, 'workspace');
  required(actions, 'workspace actions');
  required(viewport, 'message viewport');
  required(body, 'message content');
  required(userRow, 'user message');
  required(response, 'assistant response');
  required(composerDock, 'composer dock');
  required(library, 'Dusk component library');
  page = root.parent;
  await figma.setCurrentPageAsync(page);
  variables = Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map(variable => [variable.name, variable]));
  textStyles = await figma.getLocalTextStylesAsync();
  const fontMap = new Map();
  for (const scope of [root, library]) {
    for (const text of scope.findAllWithCriteria({ types: ['TEXT'] })) {
      for (const segment of text.getStyledTextSegments(['fontName'])) fontMap.set(JSON.stringify(segment.fontName), segment.fontName);
    }
  }
  fontMap.set('Geist Regular', { family: 'Geist', style: 'Regular' });
  fontMap.set('Geist Medium', { family: 'Geist', style: 'Medium' });
  await Promise.all([...fontMap.values()].map(font => figma.loadFontAsync(font)));
  baseline = {
    dashboard: snapshot(dashboard),
    navigation: snapshot(navigation),
    actions: snapshot(actions),
    userRow: snapshot(userRow),
  };
  hydrateDestinations();
  for (const [alias, name] of Object.entries(COMPONENT_NAMES)) {
    const component = exactComponent(name);
    if (component) {
      components[name] = component;
      components[alias] = component;
    }
  }
  prepared = Object.values(COMPONENT_NAMES).every(name => !!components[name])
    && ['priorAuthority', 'compAccount', 'payrollAccount', 'investigation'].every(key => !!destinations[key]);
  const currentAnswer = response.children.length === 1 && response.children[0].type === 'INSTANCE' ? response.children[0] : null;
  const currentMain = currentAnswer ? await currentAnswer.getMainComponentAsync() : null;
  applied = !!currentMain && currentMain.name === COMPONENT_NAMES.answer;
  busy = false;
  postState(
    'Ready. Initialization inspected the live file without changing document content.',
    `Root ${root.id}: ${root.width} × ${root.height}\nCurrent response child: ${currentAnswer ? currentAnswer.id : 'none'}\nPrepared components already present: ${prepared}\nText response already applied: ${applied}`,
  );
}

figma.ui.onmessage = async message => {
  if (message.type === 'close') {
    figma.closePlugin();
    return;
  }
  if (busy) return;
  busy = true;
  postState('Working…');
  try {
    if (message.type === 'prepare') await prepareComponents();
    else if (message.type === 'apply') await applyResponse();
    else if (message.type === 'verify') await verifyAndExport();
  } catch (error) {
    figma.ui.postMessage({
      status: String(error) + '\n' + (error && error.stack || ''),
      summary: 'The native development-plugin runtime may preserve edits made before an error. Inspect exact component names and the created-node ledger before retrying.',
      state: { busy: false, prepared, applied },
    });
  } finally {
    busy = false;
    figma.ui.postMessage({ state: { busy, prepared, applied } });
  }
};

initialize().catch(error => {
  busy = false;
  figma.ui.postMessage({
    status: error && (error.stack || error.message) || String(error),
    summary: 'Initialization is read-only. No document mutation was attempted.',
    state: { busy, prepared, applied },
  });
});
