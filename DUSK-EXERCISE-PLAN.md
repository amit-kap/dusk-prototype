# Dusk UI / UX Lead Exercise

## 1. Exercise focus

Challenge 1 is the primary deliverable: design the payment-intelligence dashboard.

Challenges 2 and 3 should be understood and represented as lighter flows or wireframes:

- Challenge 2: taking action on a finding.
- Challenge 3: reconstructing an investigation and acting along the way.

The central story is:

> Dashboard posture → finding → supporting flow → investigation → action

## 2. Product model

### Flow

A connected sequence of financial activity:

- Actor
- Account or resource
- Action
- Time and context
- Verdict-related signals
- Outcome or movement of funds

The flow is the evidence trail. It describes what happened, not who is guilty.

### Finding

A system-generated interpretation of a flow. A finding contains or references its supporting flow and adds:

- Verdict: Legitimate, Suspicious, or Fraudulent
- Confidence
- Reasons for the verdict
- Priority and severity
- Recommended next action

The verdict applies to the activity pattern, not necessarily to the human actor behind the credentials.

Example:

> Finding: Potential fraudulent payment chain — Fraudulent — 0.91 confidence.

### Investigation

A user-created workspace for grouping findings that the analyst believes are related.

An investigation can contain:

- Multiple related findings
- Their supporting flows
- Connected actors and accounts
- Additional evidence
- Analyst notes and hypotheses
- Actions taken and their outcomes
- Owner, status, and audit history

Findings remain independent objects. An investigation is not a child of a finding; it is a container and working space around related findings.

```text
Financial events → Flow
                       ↓
                    Finding

Finding + Finding + Finding → Investigation / case
```

The important distinction is:

- Finding: “Something may be wrong.”
- Investigation: “We are actively working out what happened and what to do.”

## 3. Primary personas

### Head of Fraud

Needs a fast understanding of:

- Overall risk posture
- Business and financial exposure
- Whether the situation is improving or worsening
- The most important issues requiring attention

### Fraud analyst

Needs to:

- Review and prioritize findings
- Inspect the supporting flow and reasons
- Discover related actors, accounts, and events
- Group related findings into an investigation
- Take safe, proportionate action
- Leave a defensible record

## 4. Dashboard purpose

The dashboard is the user’s landing and entry point to the product. It has two main jobs:

1. **Show system value**

   Make clear what Dusk understands about the organization’s payment environment: risk posture, exposure, patterns, anomalies, and meaningful change.

2. **Create a clear action list**

   Tell the user what needs attention now, why it matters, and what they can do next.

The dashboard should provide multiple points of interest for deeper exploration without becoming an inventory of everything Dusk knows.

Principle:

> One coherent risk model, multiple depths of engagement.

## 5. Dashboard information hierarchy

The page should be organized from highest-value information at the top-left toward lower-priority exploration as the user scans from top-left to bottom-right.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Dusk · Dashboard                         [Ask Dusk anything...]       │
├───────────────────────────────┬──────────────────────────────────────┤
│ 1. RISK POSTURE                │ 2. PRIORITY FINDINGS                │
│    Score · trend · key drivers │    What needs attention now          │
│    “High — driven by payroll”  │    Finding cards · verdict · action  │
├───────────────────────────────┼──────────────────────────────────────┤
│ 3. EXPOSURE BREAKDOWN          │ 4. CRITICAL ACCOUNTS AT RISK         │
│    Routine / Elevated /        │    Account · tier · risk · exposure  │
│    High-Value / Critical       │    Related findings                  │
├───────────────────────────────┼──────────────────────────────────────┤
│ 5. ANOMALOUS ACTORS            │ 6. AUTOMATION EXPOSURE               │
│    Dormant · off-baseline ·    │    Automated / AI activity            │
│    over-entitled actors        │    Adoption · scope drift · risk     │
├───────────────────────────────┼──────────────────────────────────────┤
│ 7. RECENT RISK SIGNALS         │ 8. OPEN INVESTIGATIONS               │
│    New findings · authority    │    Case · owner · priority · status   │
│    changes · new beneficiaries │                                      │
└───────────────────────────────┴──────────────────────────────────────┘
```

## 6. Dashboard widget inventory

### 1. Risk Posture

- Overall risk score
- Trend versus the previous period
- Short explanation of the main drivers
- Last updated timestamp

Example: “High — driven by Critical payroll exposure and anomalous access.”

### 2. Priority Findings

- Top unresolved findings
- Verdict and confidence
- Severity or priority
- Short reason
- Recommended next action

This is the primary action widget and the main entry point into the system.

### 3. Exposure Breakdown

- Routine, Elevated, High-Value, and Critical accounts
- Account count and/or exposed value per tier
- Change over time

### 4. Critical Accounts at Risk

- Account name
- Value tier
- Account risk score
- Exposure and access population
- Related findings

“Critical” means the account could cause disproportionate harm if misused because of its value, sensitivity, exposure, and business impact. It does not mean the account is currently compromised.

### 5. Anomalous Actors

- Actor name and type
- Context: employee, external, service, or AI agent
- Risk score
- Signals such as dormant → active, off-baseline behavior, scope drift, or new geography
- Related findings

### 6. Automation Exposure

- Automated and AI-agent activity
- Access breadth and high-value actions
- Scope drift or suspicious counterparties
- Automation adoption versus fraud exposure over time

### 7. Recent Risk Signals

- New findings
- Verdict changes
- Authority or entitlement changes
- New external beneficiaries
- Newly exposed accounts

### 8. Open Investigations

- Investigation name
- Owner
- Priority
- Number of linked findings
- Current status
- Last activity

### 9. Further Investigate

- Dashboard natural-language prompt with environment-wide query scope
- Suggested questions based on current dashboard state

This is an entry point rather than a data-heavy widget.

## 7. Dashboard interaction model

The dashboard is an aggregator and routing surface. Meaningful clicks should lead to an inner page or filtered view.

```text
Risk posture        → Risk posture detail
Exposure breakdown  → Accounts filtered by tier
Priority finding    → Finding detail
Critical account    → Account detail
Anomalous actor     → Actor detail
Automation exposure → Automation detail
Open investigation  → Investigation workspace
```

Lightweight interactions can remain inline:

- Time-range changes
- Filters
- Category switches
- Tooltips
- Short previews

Rule:

> If the user needs to understand, verify, or act on something, clicking should open an inner page.

## 8. Natural-language investigation

Natural language should be a navigation and investigation layer across the dashboard, not a disconnected chatbot.

### Dashboard entry point

Ask Dusk belongs inside the dashboard content, not in a global product header. The dashboard workspace vertically stacks its actions (Ask Dusk and time range) above the widgets. A separate navigation column vertically stacks the Dusk brand mark above primary navigation.

Use a lightweight search-like input with clear agent language and a dedicated CTA:

```text
[ ✦ Ask Dusk to investigate...                         ] [Ask Dusk]
```

The interface may resemble search, but the copy should make clear that the user is asking an agent to investigate. Preferred labels are **Ask Dusk** or **Investigate with Dusk**, rather than simply “Search.”

### Initial interaction: overlay workspace

When activated, the prompt opens a large sheet or overlay above the dashboard:

- The dashboard remains visible behind it.
- The prompt expands into a focused investigation surface.
- Suggested questions help users get started.
- Responses include structured results, linked findings, flows, and follow-up actions.
- Closing the overlay returns the user to the same dashboard state.

The overlay should feel like a temporary investigation workspace rather than a small confirmation modal.

### Future interaction: docked workspace

Later, the prompt can support a docked right-side column:

```text
┌───────────────────────────────┬──────────────────────┐
│ Dashboard                     │ Ask Dusk             │
│                               │ Conversation         │
│                               │ Structured results   │
│                               │ Follow-up actions    │
└───────────────────────────────┴──────────────────────┘
```

The dock should preserve the current dashboard context so users can ask questions such as:

> Why is this score high?

or:

> Show me the findings behind this account.

### Prompt modes

#### Environment-wide prompt

Investigates across the whole payment environment from the dashboard. This describes query scope, not persistent placement across product pages.

Example:

> Which critical accounts had unusual external activity this week?

#### Inline contextual prompt

Starts from a specific finding, actor, account, or flow and automatically includes that context.

Example:

> What other accounts did this actor access?

Every answer should return:

- A concise answer
- Relevant verdicts and confidence
- Linked actors, accounts, and flows
- The structured data supporting the answer
- Suggested follow-up questions
- Clear uncertainty where data is incomplete

Interaction model:

> Question → answer → supporting structured data → finding or flow → action

## 9. Vega Dynamics scenario

D. Marek is a finance analyst, nine days into a 30-day notice period.

The incident trail is:

1. Six months earlier, broad approval authority was granted for a quarter-close project and never revoked.
2. Marek’s normal behavior rarely touched compensation or payroll accounts.
3. On day 9 at Tue 09:12, dormant authority reactivated and accessed 14 Critical finance accounts in 20 minutes at 12× normal volume.
4. At Tue 09:40, two transfers were routed to a personal account not present in the payee master.
5. At Tue 22:07, the external transfer was confirmed and withdrawn from an unrecognized device in a new geography.
6. Dusk flagged the chain as Fraudulent with 0.91 confidence.

The system can establish that the activity conflicts with expected behavior and policy. It cannot prove Marek personally performed the actions or convict him of fraud.

## 10. Core experience story

The primary high-fidelity story should be:

```text
Dashboard posture
        ↓
Priority finding
        ↓
Supporting flow and reasons
        ↓
Group related findings into an investigation
        ↓
Take proportionate action
        ↓
Record what was found, done, and why
```

The finding is the user’s attention mechanism. The flow is the evidence. The investigation is the analyst’s workspace for grouping and resolving related findings.

## 11. Required deliverables

From the exercise brief:

1. **Hi-fi Figma**
   - Fully designed Challenge 1 dashboard
   - At least one screen at genuine high fidelity
   - Lower-fidelity frames or flow sketches for Challenges 2 and 3
   - Explorations should remain visible

2. **Presentation**
   - Problem framing
   - Key decisions
   - Trade-offs
   - What would be done next with more time

3. **Dev-ready artifact**
   - Structured, data-driven version of a key screen
   - Clear sample-data-to-UI mapping
   - Demonstrated as an HTML artifact

## 12. Confirmed implementation stack

The user confirmed shadcn/ui components and Lucide icons on 10 September 2026. The Figma design must match these choices. See DASHBOARD-REVIEW.md for the current component, data and route contract.

- **React + TypeScript + Vite** — fast local prototyping and a straightforward production path.
- **Tailwind CSS v4 with CSS variables** — maps directly to the `DESIGN.md` token schema.
- **shadcn / Base UI primitives** — buttons, dialogs, tabs, dropdowns, sheets, tooltips, and inputs.
- **Lucide React** — consistent functional iconography.
- **Recharts** — posture trends, exposure breakdowns, and automation charts.
- **Custom SVG / HTML** — flow evidence strips and relationship views where a focused visual is clearer than a full graph library.
- **TanStack Table** — only where findings, accounts, or actors require genuinely dense tables.
- **Zod with local fixture data** — define and validate the flow, finding, investigation, account, and actor schemas.

Avoid adding GSAP, a full graph library, or heavy global state management in the first slice. The initial prototype needs credible dashboard behavior and data relationships before advanced motion or infrastructure.

The Paper frame and dev-ready artifact should use the same conceptual data model:

```text
events → flow → finding
finding + finding → investigation
```

## 13. Recommended first build slice

Start with one coherent, data-driven dashboard slice using the D. Marek incident:

- Risk Posture widget
- Priority Findings widget
- Exposure Breakdown widget
- Critical Accounts at Risk widget
- Finding detail page
- Supporting flow evidence
- Basic investigation grouping concept

This proves Challenge 1 deeply while making the relationship to Challenges 2 and 3 clear.
