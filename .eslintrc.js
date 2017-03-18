module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true,
    node: true
  },
  rules: {
  },
  globals: {
    io: true,
    URI: true
  }
};
