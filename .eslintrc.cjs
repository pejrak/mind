module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:vue/essential', 'standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['vue'],
  rules: {
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'comma-dangle': 'off',
    camelcase: 'off',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
  },
}
