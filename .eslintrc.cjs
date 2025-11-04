module.exports = {
  env: { node: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  plugins: ['import'],
  rules: {
    'import/order': ['error', { 'newlines-between': 'always' }],
  },
  ignorePatterns: ['dist', 'src/screens', 'App.tsx', 'index.ts']
};

