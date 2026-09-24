import type { Meta, StoryObj } from "@storybook/react-vite";
import { RiskPostureWidget } from "../Dashboard";

const meta = {
  title: "Dashboard/Risk posture",
  component: RiskPostureWidget,
  render: () => <div style={{ width: 400, height: 420 }}><RiskPostureWidget /></div>,
} satisfies Meta<typeof RiskPostureWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
