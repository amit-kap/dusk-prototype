import type { Meta, StoryObj } from "@storybook/react-vite";
import { AutomationExposure, automationTrend } from "../Dashboard";

const meta = {
  title: "Dashboard/widget-graph",
  component: AutomationExposure,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Weekly automated and flagged activity, displayed in a 420 px tall widget. `points` is an ordered array of `{ label, automated, flagged }` values in percent; the chart plots them left to right and clamps values to 0–`maxValue`. Set `maxValue` above the expected series peak. `summary` is the footer context. `onViewAutomations` is the optional footer action; the prototype dashboard does not yet navigate from it. With no points, the chart shows an empty message. Loading and network errors belong to the page that supplies the data." } } },
  args: { points: automationTrend, maxValue: 40, summary: "1 service account · 1 AI agent" },
  render: (args) => <div style={{ width: 700, height: 420, maxWidth: "100%" }}><AutomationExposure {...args} /></div>,
} satisfies Meta<typeof AutomationExposure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "widget-graph" };
export const Empty: Story = { name: "widget-graph-empty", args: { points: [], summary: "No automations in this period" } };
export const DifferentSeries: Story = { name: "widget-graph-different-series", args: { points: [
  { label: "Aug 13", automated: 8, flagged: 2 },
  { label: "Aug 20", automated: 12, flagged: 4 },
  { label: "Aug 27", automated: 18, flagged: 6 },
  { label: "Sep 3", automated: 24, flagged: 9 },
  { label: "Sep 10", automated: 31, flagged: 15 },
], summary: "2 service accounts · 1 AI agent" } };
