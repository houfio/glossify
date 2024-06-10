/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  plugins: [
    'eslint-plugin-react-compiler'
  ],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
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
    'react-compiler/react-compiler': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'semi': ['error', 'always'],
    'template-curly-spacing': ['error', 'never']
  }
};
