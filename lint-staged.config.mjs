/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "!(*.{js,jsx,ts,tsx})": "prettier --write --ignore-unknown",
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
};

export default config;
