const { resolve } = require("path");

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["airbnb-base", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "import/extensions": ["error", "always"],
  },
  settings: {
    "import/resolver": {
      alias: [
        ["@", resolve(__dirname, "cards")],
        ["parlassets", resolve(__dirname, "parlassets")],
      ],
    },
  },
};
