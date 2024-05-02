/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting"
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        semi: false,
        tabWidth: 2,
        singleQuote: false,
        printWidth: 70,
        trailingComma: "none",
        endOfLine: "auto"
      }
    ]
  }
}
