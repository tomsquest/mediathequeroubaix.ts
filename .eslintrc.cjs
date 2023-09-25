/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    // Turns off all rules that are unnecessary or might conflict with Prettier.
    "prettier",
  ],
  plugins: ["@typescript-eslint", "simple-import-sort", "import"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: ["/dist"],
  rules: {
    /* Simple-import, Import */
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
  },
};
