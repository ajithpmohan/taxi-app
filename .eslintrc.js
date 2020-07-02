module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx'] },
    ],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false,
      },
    ],
    'react/jsx-closing-tag-location': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react/jsx-props-no-spreading': ['off'],
    'import/prefer-default-export': 0,
    'func-names': 0,
    'no-unused-expressions': 0,
    'no-alert': 0,
    'no-new': 0,
  },
};
