module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'indent': ['warn', 2],
    'no-unused-vars': ['off', { 'vars': 'local' }],
    'no-case-declarations': 'off',
    'prefer-const': 'warn',
    'quotes': ['warn', 'single'],
    'react/prop-types': 'off',
    'semi': ['warn', 'always'],
    'space-infix-ops': 'warn'
  },
  'settings': {
    'react': { 'version': 'detect'}
  }
};
