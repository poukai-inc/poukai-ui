/** @type {import("@ladle/react").UserConfig} */
export default {
  stories: "src/**/*.stories.{ts,tsx}",
  defaultStory: "showcase-overview--index",
  appendToHead: `<link rel="stylesheet" href="/tokens.css" />`,
};
