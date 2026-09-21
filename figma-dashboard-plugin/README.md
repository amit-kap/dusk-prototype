# Dusk dashboard refinement

## Current entry point — Ask Dusk correction

The existing manifest now runs `correct-ask-dusk.js`, a native, network-disabled correction for Ask Dusk frame `4019:2890`. It preserves dashboard `4003:182`, restores the two-column shell with the existing navigation on the left, and places the chat workspace on the right. It removes the added top bar, repeated organization copy, and YOU label. Run **Apply scoped correction** only once; later runs must use **Verify and export**. The correction refuses to duplicate a corrected workspace.

The chat anatomy was checked against the actual local shadcn library: `message.tsx`, `bubble.tsx`, `message-scroller.tsx`, and `input-group.tsx`. The right-aligned user Bubble has reusable Figma component `4019:3214` and instance `4019:3215`. Existing Button, Badge, and navigation components remain instances. The scroll container and composer are editable auto-layout compositions matching MessageScroller and InputGroup anatomy; they are not a running React app.

Latest output: `Ask-Dusk-corrected.png` and `ask-dusk-corrected-audit.json`. The exported PNG was inspected at full size. The audit verifies the two columns, preserved dashboard, Geist, and absence of prohibited copy. The composer is a blank design state; runtime messaging and full detail destinations still require implementation. Old exports and builder sources below are historical and are not the current entry point.

Local Figma development plugin for dashboard frame `4003:182` in the supplied `src2cart` file. The current revision uses native editable layers, shared shadcn-aligned components, Geist, semantic tokens, and Lucide SVGs. It uses no network access.

Sources and additions are documented in `../DASHBOARD-REVIEW.md`. The PDF facts are preserved; explicitly documented mock data supplies populated findings, historical context and case records. Product-facing UI contains no exercise commentary.

The current `code.js` applies the targeted `10-dashboard-columns` update. It reuses the existing frames to create a horizontal dashboard root with two vertical columns: brand plus primary navigation, and dashboard actions plus main content. It preserves existing content, positions, sizes, and layer IDs. The navigation container remains transparent and borderless. Run from Figma desktop: Plugins → Development → “Dusk Dashboard — Complete Named Layers”. The plugin reports before/after geometry and hierarchy checks. `dashboard-columns-audit.json` records the passed check; `dashboard-audit.json` records the earlier full dashboard audit and widget IDs. The export at `../Dusk/Payment intelligence/Dashboard-revised.png` predates the floating-navigation and column updates.

Stages `01` through `07` describe the earlier construction sequence; they can overwrite subsequent refinements and `01-shell` targets the old frame names. Use targeted stages for the current design. `09-inspect-columns` is read-only.

The top-to-bottom build sources are in `stages/`. To prepare a stage, run `node build-stage.mjs STAGE-NAME`; this composes the common helpers and exact Lucide SVG source into `code.js`. Do not rerun construction stages casually: they replace the matching widget and can overwrite subsequent manual edits. Use targeted changes for later refinements. `dashboard-v1.js` preserves the earlier plugin source, and the previous PNG remains alongside the revised export.

Future implementation uses shadcn/ui and Lucide. The detail destinations and Marek investigation are specified in the review document; interactive destination frames are the next design slice.
