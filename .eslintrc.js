const path = require('path');

module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/base',
    // 'plugin:vue/recommended',
  ],
  env: {
    browser: true,
  },
  globals: {
    measure: false,
    $: false,
    d3: false,
  },
  plugins: [
    'vue',
    'import',
    // 'html',
  ],
  rules: {
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
  },
  settings: {
    'import/resolver': {
      alias: [
        // cardPath: `${path.resolve(cardPath)}`,
        ['components', `${path.resolve(__dirname)}/cards/_components`],
        ['helpers', `${path.resolve(__dirname)}/cards/_helpers`],
        ['mixins', `${path.resolve(__dirname)}/cards/_mixins`],
        ['directives', `${path.resolve(__dirname)}/cards/_directives`],
        // 'i18n/card.json$': i18nCardPath,
        // 'i18n/defaults.json$': i18nDefaultPath,
        ['i18n', `${path.resolve(__dirname)}/cards/_i18n`],
      ],
    },
  },
};
