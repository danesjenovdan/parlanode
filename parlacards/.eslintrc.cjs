const { resolve } = require('path');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    'import/extensions': ['error', 'always'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: false,
        devDependencies: ['build/**', '**/.eslintrc.{js,cjs,mjs}'],
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['__INITIAL_STATE__'] }],
    'vue/multi-word-component-names': ['off'],
    'no-param-reassign': ['off'], // TODO: fix and reenable
    'vue/no-mutating-props': ['off'], // TODO: fix and reenable
  },
  settings: {
    'import/resolver': {
      alias: [
        ['@', resolve(__dirname, 'cards')],
        ['parlassets', resolve(__dirname, 'parlassets')],
      ],
    },
  },
};
