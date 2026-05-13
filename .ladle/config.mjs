/** @type {import("@ladle/react").UserConfig} */
export default {
  stories: "src/**/*.stories.{ts,tsx}",
  defaultStory: "brand-wordmark--default",
  appendToHead: `<link rel="stylesheet" href="/tokens.css" />`,
  serve: { port: 61000 },
};
