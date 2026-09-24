import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { FindingMasterItem, type FindingMasterItemData } from "../FindingMasterItem";
import { findingItems } from "../findingData";

const itemProps = ({ id, entity, timestamp, title, verdict, confidence, status }: FindingMasterItemData) => ({ id, entity, timestamp, title, verdict, confidence, status });

const meta = {
  title: "Findings/widget-finding-item",
  component: FindingMasterItem,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "One selectable finding in the Findings inbox. The caller supplies the verdict, confidence, status, and selected state. `onSelect` reports the click; selection and filtering belong to the page. The selected row grows from 104 px to 126 px on desktop." } } },
  render: (args) => <div className="findings-pane findings-inbox" style={{ width: 368, maxWidth: "100%", height: 168, padding: 12 }}><div className="finding-master-list"><FindingMasterItem {...args} /></div></div>,
} satisfies Meta<typeof FindingMasterItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectedOpen: Story = { name: "widget-finding-item-selected-open", args: { ...itemProps(findingItems[0]), selected: true, onSelect: fn() } };
export const Cleared: Story = { name: "widget-finding-item-cleared", args: { ...itemProps(findingItems[4]), selected: false, onSelect: fn() } };
