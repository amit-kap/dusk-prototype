import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountTierWidget } from "../Dashboard";

const meta = {
  title: "Dashboard/Exposure by account tier",
  component: AccountTierWidget,
  render: (args) => <div style={{ width: 400, height: 420 }}><AccountTierWidget {...args} /></div>,
} satisfies Meta<typeof AccountTierWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Events: Story = { args: { initialMetric: "activity" } };
export const Accounts: Story = { args: { initialMetric: "accounts" } };
