import type { Meta, StoryObj } from "@storybook/react-vite";
import { RiskPostureWidget } from "../Dashboard";

const meta = {
  title: "Dashboard/widget-gauge",
  component: RiskPostureWidget,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Risk summary at 400 × 420 px on the desktop dashboard. `score` is a 0–100 value supplied by the caller; this widget does not calculate risk or decide the status threshold. Supply `statusLabel` from the same risk assessment. The badge keeps the prototype's high-risk color, so other severity colors are not defined yet. `trendDelta` is the signed change from the previous period. The segmented SVG is fixed scale artwork, while the overlaid number carries the current score. The two counts are independent inputs. The header menu is presentational in this prototype; its action is not specified." } } },
  args: { score: 82, statusLabel: "High risk", trendDelta: 8, findingsCount: 4, criticalAccountsCount: 3 },
  render: (args) => <div style={{ width: 400, height: 420, maxWidth: "100%" }}><RiskPostureWidget {...args} /></div>,
} satisfies Meta<typeof RiskPostureWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "widget-gauge" };
export const ChangedValues: Story = { name: "widget-gauge-changed-values", args: { score: 76, trendDelta: -6, findingsCount: 2, criticalAccountsCount: 3 } };
