/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc'
        }
      }
    ],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'react/display-name': 'off',
    'react/jsx-curly-spacing': [
      'error',
      {
        'when': 'never',
        'children': true
      }
    ],
    'react/jsx-tag-spacing': [
      'error',
      {
        'beforeSelfClosing': 'never',
        'beforeClosing': 'proportional-always'
      }
    ],
    'react-hooks/exhaustive-deps': 'off',
    'template-curly-spacing': ['error', 'never']
  }
};
