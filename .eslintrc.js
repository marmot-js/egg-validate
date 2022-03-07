module.exports = {
  extends: [
    'eslint-config-egg/typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'array-bracket-spacing': ['error', 'never'],
  },
};
