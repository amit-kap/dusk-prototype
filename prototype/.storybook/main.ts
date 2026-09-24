import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: "@storybook/react-vite",
  addons: ["@storybook/addon-docs"],
  viteFinal: (config) => mergeConfig(config, {
    base: process.env.GITHUB_ACTIONS === "true" ? "/dusk-prototype/storybook/" : "/",
  }),
};

export default config;
