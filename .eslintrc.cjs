const { resolve } = require('path');
const {
  rules: bpRules,
} = require('eslint-config-airbnb-base/rules/best-practices.js');

const noRestrictedProperties = bpRules['no-restricted-properties'].slice(1);

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
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: false,
        devDependencies: ['build/**', '**/.eslintrc.{js,cjs,mjs}'],
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['__INITIAL_STATE__'] }],
    'no-restricted-properties': [
      'error',
      ...noRestrictedProperties,
      {
        property: '$options',
        message:
          'Use this.cardData and this.cardState (defined in common mixin)',
      },
    ],
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
