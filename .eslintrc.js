module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    semi: ['error', 'never'],
    'require-jsdoc': ['off'],
    'spaced-comment': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'import/order': [2, { alphabetize: { order: 'asc' } }],
  },
}
