export const eslintBase = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: '',
  parserOptions: {
    sourceType: 'module',
  },
  extends: [],
  plugins: [],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  ignorePatterns: ['dist', '.eslintrc.js'],
  rules: {}
};
// 排除的文件和目录
export const eslintignore = `dist/
.changeset/
node_modules/
.prettierrc.js
.stylelintrc.js
_.min.js
_.md`;
