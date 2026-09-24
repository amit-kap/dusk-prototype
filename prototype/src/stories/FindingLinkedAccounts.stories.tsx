import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { FindingLinkedAccounts } from "../FindingLinkedAccounts";
import { linkedAccounts } from "../findingLinkedAccountsData";

const meta = {
  title: "Findings/widget-table",
  component: FindingLinkedAccounts,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Linked accounts table with one expandable row at a time. `accounts` supplies rows, facts, and evidence links. `initialOpenAccountId` sets the initial expanded row; `focusRequest` opens and focuses an account on navigation from the timeline. `onNavigateEvidence` reports source-link clicks. Coverage text is supplied separately because the three visible rows are a sample of the 14 accessed accounts. This currently uses Collapsible rows; the dashboard's flat `DashboardTableWidget` does not support these expanded details." } } },
  args: { accounts: linkedAccounts, focusRequest: null, onNavigateEvidence: fn() },
  render: (args) => <div style={{ width: 900, maxWidth: "100%" }}><FindingLinkedAccounts {...args} /></div>,
} satisfies Meta<typeof FindingLinkedAccounts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = { name: "widget-table-collapsed" };
export const Expanded: Story = { name: "widget-table-expanded", args: { initialOpenAccountId: "payroll-master-eu" } };
