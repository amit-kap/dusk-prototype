import type { Preview } from "@storybook/react-vite";
import { Theme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";
import "@astryxdesign/theme-neutral/theme.css";
import "@xyflow/react/dist/base.css";
import "../src/dusk.css";
import "../src/dashboard.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <Theme theme={neutralTheme} mode="dark">
        <div className="dashboard-workspace" style={{ minHeight: "100vh", height: "auto", padding: 24 }}>
          <Story />
        </div>
      </Theme>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default preview;
