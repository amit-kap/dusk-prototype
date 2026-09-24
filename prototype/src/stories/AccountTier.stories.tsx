import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountTierWidget } from "../Dashboard";

const meta = {
  title: "Dashboard/widget-donut",
  component: AccountTierWidget,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Account-tier distribution at 400 × 420 px on desktop. `tiers` is an ordered list of `{ label, events, accounts, color, legend? }`; counts must be non-negative. The selected metric supplies the donut proportions and center total. The other measure remains visible in each legend row. `initialMetric` is the initial local toggle state; `onMetricChange` reports a user selection. With no tiers, the widget shows a zero donut and an empty message. No risk classification or data fetching happens here." } } },
  render: (args) => <div style={{ width: 400, height: 420 }}><AccountTierWidget {...args} /></div>,
} satisfies Meta<typeof AccountTierWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Events: Story = { name: "widget-donut-events", args: { initialMetric: "activity" } };
export const Accounts: Story = { name: "widget-donut-accounts", args: { initialMetric: "accounts" } };
export const Empty: Story = { name: "widget-donut-empty", args: { tiers: [] } };
