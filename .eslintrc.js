module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'google',
    'prettier',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import'
  ],
  'rules': {
    'semi': ['error', 'never'],
    'require-jsdoc': ['off'],
    'spaced-comment': ['off'],
    'react/react-in-jsx-scope': ['off'],
    "import/order": [2, {"alphabetize": { "order": "asc" }}],
  },
}
