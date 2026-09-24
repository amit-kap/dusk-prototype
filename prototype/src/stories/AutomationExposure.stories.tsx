import type { Meta, StoryObj } from "@storybook/react-vite";
import { AutomationExposure } from "../Dashboard";

const meta = {
  title: "Dashboard/widget-graph",
  component: AutomationExposure,
  render: () => <div style={{ width: 700, height: 420 }}><AutomationExposure /></div>,
} satisfies Meta<typeof AutomationExposure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "widget-graph" };
