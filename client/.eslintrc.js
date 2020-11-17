module.exports = {
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    'airbnb',
    'prettier',
  ],
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
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true },
    ],
    'react/jsx-curly-newline': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react/jsx-props-no-spreading': ['off'],
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react/jsx-fragments': 0,
    'func-names': 0,
    'no-unused-expressions': 0,
    'no-alert': 0,
    'no-console': 0,
    'no-new': 0,
  },
  overrides: [
    {
      files: ['**/*.spec.js', '**/*.spec.jsx'],
      env: {
        jest: true,
      },
    },
  ],
};
