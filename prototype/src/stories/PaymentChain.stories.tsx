import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { PaymentChain } from "../PaymentChain";

const meta = {
  title: "Findings/widget-flow-chart",
  component: PaymentChain,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "The FND-1042 payment chain. Compact mode fits the five nodes, supports node selection, and leaves zoom disabled. Explore opens the full-screen graph with zoom controls and node details. The graph content is fixed prototype data; payment amounts, account population, and attribution are not inferred by this component." } } },
  render: () => <div style={{ width: 900, maxWidth: "100%" }}><PaymentChain /></div>,
} satisfies Meta<typeof PaymentChain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = { name: "widget-flow-chart-compact" };
export const Explorer: Story = {
  name: "widget-flow-chart-explorer",
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Explore" }));
  },
};
