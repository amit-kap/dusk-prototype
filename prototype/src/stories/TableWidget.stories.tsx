import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DashboardTableWidget, findings, type DashboardTableWidgetProps } from "../Dashboard";
import { initialCases } from "../caseData";

const cases: DashboardTableWidgetProps["rows"] = initialCases.map((item) => ({
  cells: [
    { primary: item.name, secondary: `${item.id} · ${item.findingIds.length} finding · ${item.priority}` },
    { primary: item.owner, secondary: `Updated ${item.updated}` },
    { badge: item.status, tone: item.status === "Closed" ? "legitimate" : item.status === "Investigating" ? "suspicious" : "neutral" },
    {},
  ],
}));

const meta = {
  title: "Dashboard/widget-table",
  component: DashboardTableWidget,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Shared 420 px tall dashboard table. Pass one `columns` label and one CSS grid track in `template` for each cell in every row; the final empty cell is the chevron slot where used. Each `TableCell` contains primary/secondary text or a verdict badge. A row with `onClick` renders as a keyboard-usable button; rows without it are static. At most five rows are visible; the footer summarizes the full dataset and its optional action uses `onFooterClick`. Minimum column widths scroll horizontally on narrow canvases. Long cell text truncates with a title tooltip. With zero rows, `emptyMessage` replaces the list. Loading and network errors are owned by the page." } } },
  render: (args, context) => <div style={{ width: context.parameters.widgetWidth ?? 800, height: 420, maxWidth: "100%" }}><DashboardTableWidget {...args} /></div>,
} satisfies Meta<typeof DashboardTableWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Findings: Story = { name: "widget-table-findings", args: {
  title: "Findings", className: "findings-widget",
  columns: ["Finding", "Actor", "Verdict", "Confidence", ""],
  template: "minmax(240px, 3fr) minmax(120px, 1.3fr) 100px 78px 20px",
  rows: findings.map((row) => ({ ...row, onClick: fn() })),
  footerSummary: "4 require review · 1 cleared", footerAction: "View all findings", onFooterClick: fn(),
} };

export const Cases: Story = { name: "widget-table-cases", args: {
  title: "Cases", className: "investigations-widget",
  columns: ["Case", "Owner", "Status", ""],
  template: "minmax(180px, 1.7fr) 100px 104px 20px",
  rows: cases, footerSummary: "3 active · 1 closed",
} };

export const Empty: Story = { name: "widget-table-empty", args: {
  title: "Findings", columns: ["Finding", "Actor", "Verdict", "Confidence", ""],
  template: "minmax(240px, 3fr) minmax(120px, 1.3fr) 100px 78px 20px",
  rows: [], footerSummary: "0 findings", emptyMessage: "No findings in this period",
} };

export const Narrow: Story = { name: "widget-table-narrow", parameters: { widgetWidth: 480 }, args: {
  title: "Findings", columns: ["Finding", "Actor", "Verdict", "Confidence", ""],
  template: "minmax(240px, 3fr) minmax(120px, 1.3fr) 100px 78px 20px",
  rows: [{ cells: [
    { primary: "Multiple previously dormant approval rights were used across payroll accounts outside the expected quarter-close window", secondary: "FND-1042 · 14 accessed accounts · Tuesday 09:12" },
    { primary: "D. Marek and additional account holders", secondary: "Finance employees" },
    { badge: "Fraudulent", tone: "fraudulent" }, { primary: "91%" }, {},
  ], onClick: fn() }, ...findings.slice(1)], footerSummary: "4 require review · 1 cleared", footerAction: "View all findings", onFooterClick: fn(),
} };
