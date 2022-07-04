module.exports = {
    root: true,
    extends: ['plugin:prettier/recommended'],
    rules: {
        'max-len': [1, { code: 200 }],
        'prettier/prettier': [1, { printWidth: 100 }],
    },
    globals: {
        IS_DEVELOPMENT: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        es6: true,
    },
}
