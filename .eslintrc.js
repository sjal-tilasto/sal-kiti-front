module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/prettier",
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": "error",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/valid-v-slot": [
      "error",
      {
        allowModifiers: true
      }
    ]
  },
  parserOptions: {
    parser: "@babel/eslint-parser"
  }
};
