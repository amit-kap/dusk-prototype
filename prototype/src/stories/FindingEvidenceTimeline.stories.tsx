import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { FindingEvidenceTimeline, findingEvidence } from "../FindingEvidenceTimeline";

const meta = {
  title: "Findings/widget-timeline",
  component: FindingEvidenceTimeline,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Evidence events are ordered newest first in this finding. Each item provides time, source, title, explanation, and source actions. `events` supplies the content; `onOpenAccount` connects account actions to the linked-accounts section. The active pulse marks the latest event. Calendar dates and authority time in the demo are illustrative." } } },
  args: { events: findingEvidence, onOpenAccount: fn() },
  render: (args) => <div className="finding-detail-content" style={{ width: 900, maxWidth: "100%", height: "auto", overflow: "visible" }}><FindingEvidenceTimeline {...args} /></div>,
} satisfies Meta<typeof FindingEvidenceTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "widget-timeline-default" };
export const FocusedEvent: Story = {
  name: "widget-timeline-focused-event",
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>("#evidence-transfer-1")?.focus({ preventScroll: true });
  },
};
