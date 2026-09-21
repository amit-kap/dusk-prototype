# Dusk project constraints

## Required before every UI change

- Read the current user brief and inspect the live design. Check the final screenshot against each explicit constraint before claiming completion.
- Preserve the two-column application shell: existing primary navigation and brand stay on the left; only the right-hand dashboard workspace changes into Ask Dusk.
- Never introduce a replacement full-width top bar for Ask Dusk. Put its back control inside the right workspace.
- Do not repeat Vega Dynamics or add organization/context labels unless explicitly requested.
- Use the existing shadcn component library and Dusk tokens, Geist typography, and Lucide icons. Inspect actual component source/anatomy before designing; do not merely call custom styling shadcn.
- Local component source: `/Users/amitka/Personal/Projects/shadcn-comp-lib/src/components/ui/`. Chat primitives include MessageGroup, Message, MessageContent, Bubble, MessageScroller, InputGroup, and Textarea. Button and Badge already have Dusk Figma counterparts.
- Every Ask Dusk content block must be an actual Figma component instance composed from the local shadcn component anatomy, with editable properties and Dusk tokens; loose rectangles or renamed custom frames are not acceptable.
- The payment-chain answer must lead with a direct factual explanation, followed by source-linked events and actor/account context. Dusk interpretation and any safeguard remain secondary.
- Present the Marek answer as comprehensive, structured conversational text with specific inline or adjacent source links. A small event flow may support the prose; do not replace the answer with a grid of equal-weight cards. Component instances do not require visible card borders.
- Account numbers 641 and 642 in the exercise appendix are ledger classes, not account identifiers. Link the named source accounts and distinguish the supplied sample records from the complete 14-account access population.
- Chat uses a right-aligned user message and left-aligned assistant response. Do not add YOU labels or turn the conversation into a report heading.
- Keep the composer blank with suggested-question helpers. It stays available while the message area scrolls; the left navigation stays available too.
- Ask Dusk must not restate the dashboard as a chat transcript. Its value is cross-dashboard synthesis, causal explanation, uncertainty, and an operator decision. Every surfaced finding needs a meaningful deep link or expand/drill-in path to the supporting evidence, relevant entity, comparison, or next action; static arrows, generic chips, and duplicate summaries are not acceptable.
- In Ask Dusk, label source facts as events and label Dusk's interpretation separately. Every event must show what happened, the relevant entity or account, when it happened, why it matters to the causal chain, and a direct source link. State the recommended action in plain language, including its scope and what remains unverified.
- Do not turn an Ask Dusk response into a narrow vertical memo. At normal canvas scale, the decision must dominate; the causal chain must be understandable at a glance; each event needs enough visual space to be read without hunting through micro-copy.
- Preserve dashboard frame `4003:182`. The existing Ask Dusk frame is `4019:2890`; correct it in place instead of duplicating it.
- Use the authorized local plugin manifest at `/Users/amitka/Personal/Projects/dusk-home-exe/figma-dashboard-plugin/manifest.json` when MCP is unavailable. Do not bypass Figma plan restrictions.
- Return created/mutated IDs and visually inspect the rendered result. State limitations honestly; a passed script is not visual approval.

## Scope and verification

- Distinguish analysis, planning, implementation, and verification. Do not edit during analysis or planning without authorization.
- Inspect relevant files and Git status before implementation. This directory was not a Git checkout at the latest inspection; verify rather than assume.
- For three or more meaningful steps, state a short plan before edits. Preserve unrelated work.
- Record recurring user corrections here. Do not edit global memory unless explicitly requested.
