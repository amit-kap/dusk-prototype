---
version: alpha
name: Dusk
description: A dark, high-trust financial security system where layered panels, precise typography, luminous data signals, and controlled color turn payment activity into findings, evidence, and action.
colorScheme: dark
colors:
  background: "#0C0F0E"
  foreground: "#F1F5F2"
  card: "#141917"
  primary: "#B7F76B"
  primary-foreground: "#0C0F0E"
  secondary: "#1D2520"
  muted: "#101411"
  muted-foreground: "#A3AEA7"
  border: "#2C3831"
  input: "#101411"
  ring: "#B7F76B"
  accent: "#253622"
typography:
  body-md:
    fontFamily: "Geist"
  headline-display:
    fontFamily: "Geist"
rounded:
  base: 12px
spacing:
  base: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.base}"
    padding: "{spacing.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.base}"
---

# Dusk — Design Reference

> Quiet signal in the dark: a high-trust financial security interface that turns complex payment activity into clear findings, evidence, and action.

**Theme:** dark with luminous data moments
**Flavor:** Security Finance / Quiet Signal / Dark Instrument
**Mode:** DESIGN.md examples | AI design resources | Design prompts

## Confirmed product constraints — 10 September 2026

- Implement with **shadcn/ui components and Lucide icons**. Use the real component anatomy and SVG source in Figma.
- Treat the dashboard as a real product mock: product copy only on the canvas. Keep all assumptions and fixture provenance outside the UI.
- Use the shared Card, CardHeader, table-row and Badge components. Give every layer a meaningful name.
- Navigation is a floating icon rail with no container background, border, or shadow, labels underneath, a centered brand mark, and settings/profile at the bottom.
- The dashboard root uses horizontal auto layout with two vertical columns: `Navigation / Column` contains the Dusk brand mark and primary navigation; `Dashboard / Workspace` contains dashboard actions and main content. Ask Dusk belongs to the dashboard actions, not a shared product header.
- Tables show five rows. Account value, risk scores, event verdicts and case workflow status are distinct concepts.
- The dashboard routes to findings and cases; the next slice follows Marek from finding to its events, actors, accounts, evidence and investigation.
- The current Figma implementation, data additions and route contract are recorded in [DASHBOARD-REVIEW.md](DASHBOARD-REVIEW.md). That review supersedes earlier exploratory layout sketches below.

## Reference synthesis

This direction is informed by the supplied Refero references for [Stripe](https://styles.refero.design/style/48e5de76-05d5-4c4e-a269-c7c245b291ec), [Wise](https://styles.refero.design/style/367c0c6e-73a7-441c-a8ff-91d139ac60dc), [Square](https://styles.refero.design/style/86a6814d-2485-4fad-b6fd-56c2d0a23620), and [Kraken](https://styles.refero.design/style/14389660-81ff-4ca0-957f-b0dcc8fbe120).

Shared principles worth carrying into Dusk:

- Near-monochrome canvas with controlled luminous accents.
- High-contrast typography and generous whitespace around dense information.
- Layered panels with soft depth, rounded geometry, and restrained glow.
- Compact, confident controls inside a persistent application shell.
- A clear split between brand accent, data visualization color, and semantic status colors.

The local `UI Ref's` folder is the stronger guide for the product UI direction. It points to:

- Dark application shells with a left navigation rail and a large working canvas.
- Floating or inset panels with rounded corners rather than flat page sections.
- Dense, high-value dashboards using rings, timelines, maps, charts, and relationship views.
- Bright signal colors that make important data legible against dark surfaces.
- A prompt/agent surface that feels native to the product rather than a separate chat page.
- A mix of quiet black/charcoal structure and occasional expressive gradients or glows.

Dusk should be its own product language:

- More operational and evidence-oriented than a payments marketing site.
- Darker and more atmospheric than the light fintech references.
- More restrained than a neon command center: glow is reserved for signal and interaction.
- Dense enough for an analyst, but organized enough for an executive scan.

## Visual Character

Dusk should feel like a trusted control room for financial movement:

- Calm, watchful, exact, and quietly serious.
- Dark canvas first; floating panels carry the working information.
- Color appears when it communicates state, risk, selection, signal, or action.
- Dense information is acceptable when hierarchy is strong and rows remain scannable.
- The visual system should make a decision feel explainable, not dramatic.
- Visualizations can be expressive, but the evidence and labels must remain precise.

Avoid the usual security-product clichés: hacker imagery, excessive red, unstructured command-center darkness, and ornamental network diagrams that do not explain a relationship.

## Tokens — Colors

The values below are the proposed Dusk tokens. They are intentionally close to the reference systems’ observed near-monochrome approach, but are not copies of their brand palettes.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Dusk Ink | `#F1F5F2` | `--color-ink` | Primary text, headings, navigation, high-confidence data |
| Deep Ink | `#242832` | `--color-deep-ink` | Dark surfaces, selected rows, investigation headers |
| Graphite | `#A3AEA7` | `--color-graphite` | Secondary text, descriptions, supporting metadata |
| Ash | `#718078` | `--color-ash` | Tertiary text, disabled states, low-priority metadata |
| Cloud | `#0C0F0E` | `--color-cloud` | Page background and quiet bands |
| Border | `#2C3831` | `--color-border` | Hairline dividers, table rules, input borders |
| Paper | `#141917` | `--color-paper` | Card and table surfaces, input fills |
| Signal Green | `#B7F76B` | `--color-signal-green` | Primary action, active navigation, links, agent focus |
| Signal Green Soft | `#253622` | `--color-signal-green-soft` | Selected surfaces, prompt background, low-intensity emphasis |
| Fraud Red | `#FF8B87` | `--color-fraud` | Fraudulent verdicts and high-risk semantic states only |
| Suspicious Amber | `#E9BB73` | `--color-suspicious` | Suspicious verdicts and caution states only |
| Legitimate Mint | `#74CDA9` | `--color-legitimate` | Legitimate verdicts and completed safe states only; distinct from the Signal Green brand accent |

Color rules:

- Signal Green is the only brand accent.
- Red and amber are semantic status colors. Legitimate uses a cooler mint so it remains distinct from the Signal Green brand accent.
- Never use color as the only signal; pair it with text, icon, or shape.
- Keep large surfaces dark and neutral. Signal Green should mark a decision, selection, signal, or action.

## Tokens — Typography

Use a two-level sans system with a restrained monospace role for technical data.

| Role | Family | Size | Weight | Line height | Token |
|------|--------|------|--------|------------|-------|
| display | Geist | 48–64px | 500–600 | 0.98–1.05 | `--text-display` |
| page heading | Geist | 32–40px | 600 | 1.05–1.12 | `--text-heading` |
| section heading | Geist | 20–24px | 600 | 1.2–1.3 | `--text-section` |
| body | Geist | 15–16px | 400 | 1.45–1.55 | `--text-body` |
| UI label | Geist | 12–14px | 500–600 | 1.25–1.4 | `--text-label` |
| metadata | Geist | 11–12px | 400–500 | 1.3–1.45 | `--text-meta` |
| technical data | IBM Plex Mono | 12–14px | 400–500 | 1.35–1.45 | `--text-mono` |

Typography guidance:

- Use Geist for compact, confident headings; do not make headings oversized for their own sake.
- Use tabular numerals for scores, amounts, counts, timestamps, and risk metrics.
- Use monospace selectively for account IDs, actor handles, ledger classes, event IDs, and raw system values.
- Keep body copy left-aligned and readable. Avoid long paragraphs inside dense dashboard cards.
- Use weight to establish hierarchy; do not rely on all-caps or color alone.

## Tokens — Spacing & Shape

| Name | Value | Token | Role |
|------|-------|-------|------|
| base | `4px` | `--space-1` | Small alignment unit |
| compact | `8px` | `--space-2` | Icon/text and row gaps |
| control | `12px` | `--space-3` | Dense control padding |
| element | `16px` | `--space-4` | Default component gap |
| card | `24px` | `--space-6` | Card padding |
| section | `40px` | `--space-10` | Dashboard section spacing |
| major | `64px` | `--space-16` | Page-level separation |

| Element | Value | Token |
|---------|-------|-------|
| dense control | `4px` | `--radius-control` |
| card | `8px` | `--radius-card` |
| large panel | `12px` | `--radius-panel` |
| status badge | `999px` | `--radius-pill` |

Shape and elevation:

- Prefer surface contrast, soft borders, and selective glow over heavy shadows.
- Use `12px` cards as the default Dusk shape: rounded enough to feel like a working instrument, controlled enough for financial data.
- Use `8px` for inputs, buttons, filters, and compact controls.
- Reserve pills for statuses, filters, and compact labels—not primary containers.
- Use soft elevation only on floating panels, overlays, and navigation:
  `0 12px 32px rgba(0, 0, 0, 0.28)`.
- Use glows sparingly around active data, selected nodes, or high-priority signals; never use glow as general decoration.

## Components

### Application navigation

Persistent left navigation for Dashboard, Findings, Investigations, Accounts, Actors, and Automations. Use Dusk Ink for labels, a soft Signal Green surface for the active item, and a small icon or rule to reinforce selection. The rail should feel integrated into the dark shell and remain visually quieter than the working canvas.

### Risk posture card

The highest-level value signal. Show the score, direction of travel, time range, and a short explanation of the drivers. The score must always be accompanied by a breakdown; never present false precision as an unexplained number.

### Priority finding row

The primary action component. Anatomy:

- Finding title
- Verdict and confidence
- Severity or account tier
- One-line reason
- Recommended action
- Timestamp and status

Clicking opens the finding page. The row may include a compact evidence preview, but should not attempt to contain the full flow.

### Flow evidence strip

The visual evidence layer inside a finding or investigation. Show the connected sequence as:

`actor → account → action → beneficiary/device → outcome`

Use compact nodes, clear event timestamps, and explicit verdict reasons. The strip should be readable as a sequence, not a decorative graph.

### Investigation workspace

A case surface that groups related findings and flows. Show the working hypothesis, linked findings, evidence, notes, actions, owner, status, and audit history. Analysts can add findings to an investigation; the system may suggest relationships but should not silently merge them.

### Ask Dusk prompt

Use a search-like input that clearly communicates agent behavior:

```text
[ ✦ Ask Dusk to investigate...                         ] [Ask Dusk]
```

On activation, open a large overlay workspace while preserving the dashboard behind it. A future version may dock the workspace as a right-side column. Responses must return structured results, linked findings, supporting flows, uncertainty, and follow-up actions.

### Data table

Use for dense account, actor, event, and finding lists. Keep columns purposeful, align numeric data, use tabular numerals, and allow row-level navigation. Avoid tables that repeat every available field without prioritization.

### Status badge

Compact text-plus-color state indicator. Examples: `Fraudulent`, `Suspicious`, `Legitimate`, `Open`, `Contained`, `Resolved`. Status color is semantic and must be paired with readable text.

### Action control

Actions should be visibly tiered:

- Safe/reversible: quiet secondary or outline control.
- Workflow: Signal Green primary or standard action.
- Destructive/high-stakes: explicit danger treatment, confirmation, impact preview, and undo or recovery where possible.

## Layout

### Dashboard

Use a dark application shell with a persistent navigation rail and a practical working area. The main canvas can use a 12-column grid, with floating or inset panels for high-value widgets. The page should feel layered rather than flat, but remain disciplined enough for financial analysis.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Navigation     Risk posture                  Ask Dusk                │
├───────────────────────────────┬──────────────────────────────────────┤
│ Risk posture                  │ Priority findings                    │
├───────────────────────────────┼──────────────────────────────────────┤
│ Exposure breakdown            │ Critical accounts at risk             │
├───────────────────────────────┼──────────────────────────────────────┤
│ Anomalous actors              │ Automation exposure                   │
├───────────────────────────────┼──────────────────────────────────────┤
│ Recent risk signals           │ Open investigations                    │
└───────────────────────────────┴──────────────────────────────────────┘
```

The top-left should answer “What is the state?” and the top-right should answer “What do I do next?” Lower sections provide analyst exploration. Every meaningful widget routes to a detailed inner page or filtered view.

### Inner pages

- Dashboard: aggregate posture, value, and next actions.
- Finding: verdict, reasons, supporting flow, available actions, and related findings.
- Investigation: grouped findings, evidence, notes, actions, and audit record.
- Account: value tier, sensitivity, exposure, access population, activity, and findings.
- Actor: type, baseline, permissions, related accounts, flows, and findings.
- Automation: automated actors, scope, activity, drift, and associated findings.

Do not create a standalone Flow page in the initial information architecture. Flow evidence should be reachable from findings, investigations, accounts, and actors.

## Imagery & Iconography

- Product UI should carry the visual weight; avoid decorative hero imagery inside the application.
- Use the Dusk icon as a simple black geometric mark: a circle/sun with a wave interaction.
- Keep icons geometric, consistent, and functional, using Lucide SVG source with a consistent 1.75px stroke at a 24px viewBox; use 16px and 20px icon slots.
- Use the brand mark in black on light surfaces and white on dark surfaces; keep its simple circle/wave geometry intact.
- Prefer diagrams that explain a sequence or relationship over abstract network decoration.
- If imagery is needed for presentations, use quiet evening light, financial infrastructure, documents, and controlled systems—not cyberpunk or hacker imagery.

## Motion & Geistaction

- Use short, restrained transitions: 120–180ms for controls and 200–280ms for drawers or page transitions.
- Animate changes in risk metrics only when the change is meaningful; do not create urgency through constant motion.
- Preserve context when opening findings, prompt overlays, or investigation drawers.
- Use progressive disclosure for dense evidence: summary first, flow detail second, raw event detail on demand.
- Respect `prefers-reduced-motion` and provide non-animated state changes.

## Accessibility Notes

- Maintain WCAG AA contrast for all text and status treatments.
- Never communicate verdict through color alone.
- Provide labels for score, confidence, trend direction, and time range.
- Make tables navigable by keyboard and preserve row context when opening details.
- Ensure prompt responses are readable by assistive technology and expose links to their supporting data.
- Keep destructive actions clearly labeled and separated from safe actions.

## Do's and Don'ts

### Do

- Use dark near-monochrome surfaces and one controlled high-saturation green brand accent.
- Make findings the primary action layer and flows the supporting evidence layer.
- Use surface contrast, whitespace, and restrained glow to create hierarchy before adding heavy shadow.
- Show the reason behind a verdict wherever the verdict appears.
- Use tabular numbers and monospace selectively for financial and system data.
- Keep dashboard cards scannable and route meaningful clicks to inner pages.
- Make agent answers return to structured findings, flows, accounts, actors, and actions.

### Don't

- Do not show findings and flows as equal, unrelated dashboard widgets.
- Do not imply that a flow verdict proves an actor’s intent or guilt.
- Do not use a giant unexplained risk score as the entire product value story.
- Do not make every panel neon, glassy, or command-center-like; dark is the canvas, not an excuse for visual noise.
- Do not use red as a general brand color; reserve it for semantic fraud/high-risk states.
- Do not turn the dashboard into a full investigation workspace.
- Do not make the prompt a disconnected chatbot with answers that cannot be audited.

## Agent Prompt Guide

When designing a Dusk surface, describe it as:

> A calm, high-trust financial security interface in a dark application shell. Use Dusk Ink typography, layered charcoal panels, hairline borders, restrained 12px cards, one high-saturation Signal Green action accent, luminous data signals, and semantic red/amber/green only for verdict states. Prioritize findings as the action layer, show flows as their evidence, and route meaningful interactions to detailed inner pages. Keep the dashboard useful to both a Head of Fraud scanning posture and a Fraud Analyst exploring evidence.

For dashboard work, always specify:

- The persona and their decision.
- The widget’s position in the top-left-to-bottom-right hierarchy.
- The finding or inner page it routes to.
- The evidence supporting any score or verdict.
- Whether an action is safe, workflow, or destructive.
- The data fields shown and the empty/loading/error states.
