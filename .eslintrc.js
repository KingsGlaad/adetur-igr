// .eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@next/next/recommended",
    "prettier", // se você usa Prettier
  ],
  rules: {
    // Suas regras personalizadas aqui:
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "off",
    "react/react-in-jsx-scope": "off", // Next.js não precisa importar React
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: [
        "**/node_modules/**/*",
        "**/prisma/**/*",
        "**/.next/**/*",
        "src/generated/**/*.{ts,js,tsx,jsx}",
      ],
      rules: {
        // Desativa regras para arquivos gerados automaticamente:
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "prisma/", // garante que o prisma não seja verificado
    "dist/",
    "src/generated/",
  ],
};
