module.exports = {
    root: true,
    env: { browser: true, es2023: true, node: true },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    ignorePatterns: ["files", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  };