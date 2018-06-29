const path = require('path');

module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    browser: true,
  },
  globals: {
    measure: false,
    $: false,
    d3: false,
  },
  plugins: [
    'import',
  ],
  rules: {
    'vue/max-attributes-per-line': ['error', { 'singleline': 3 }],
    'vue/html-self-closing': ['error', { html: { normal: 'any' } }],
    'vue/html-closing-bracket-newline': ['error', { multiline: 'always' }],
    'vue/html-closing-bracket-spacing': 'error',
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
