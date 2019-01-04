module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      impliedStrict: true,
      classes: true
    }
  },
  env: {
    browser: true,
    node: true,
    jquery: true
  },
  rules: {
    "no-debugger": 0,
    "no-unused-vars": [
      1,
      {
        argsIgnorePattern: "res|next|^err"
      }
    ],
    "arrow-body-style": [2, "as-needed"],
    "no-unused-expressions": [
      2,
      {
        allowTaggedTemplates: true
      }
    ],
    "no-param-reassign": [
      2,
      {
        props: false
      }
    ],
    "no-console": 0,
    "import/prefer-default-export": 0,
    import: 0,
    "func-names": 0,
    "import/no-dynamic-require": 0,
    "space-before-function-paren": 0,
    "comma-dangle": 0,
    "max-len": 0,
    "import/extensions": 0,
    "no-underscore-dangle": 0,
    "consistent-return": 0,
    radix: 0,
    "no-shadow": [
      2,
      {
        hoist: "all",
        allow: ["resolve", "reject", "done", "next", "err", "error"]
      }
    ],
    quotes: [
      2,
      "single",
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 80,
        semi: false
      }
    ],
    "semi": [2, "never"],
  },
  plugins: [
    "prettier"
  ]
};
