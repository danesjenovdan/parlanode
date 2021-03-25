const { resolve } = require('path');

module.exports = {
  root: true,
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
    'no-param-reassign': ['off'], // TODO: fix and reenable
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
