import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import next from '@next/eslint-plugin-next';

export default tseslint.config(
    { ignores: ['dist', '.jsx'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier,
            tanstackQuery,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-unused-vars': 'warn',
            'array-callback-return': 1,
            semi: ['warn', 'always'],
            'no-void': 0,
            '@typescript-eslint/no-confusing-void-expression': 0,
            '@typescript-eslint/no-explicit-any': 'warn',
            'prettier/prettier': 1,
            '@typescript-eslint/adjacent-overload-signatures': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
            'no-case-declarations': 'warn',
            'no-sparse-arrays': 'warn',
            'no-regex-spaces': 'warn',
            'use-isnan': 'warn',
            'no-fallthrough': 'warn',
            'no-empty-pattern': 'warn',
            'no-redeclare': 'warn',
            'no-self-assign': 'warn',
            '@typescript-eslint/semi': 0,
            '@typescript-eslint/indent': 0,
            'eslint@typescript-eslint/member-delimiter-style': 0,
            strict: 'error',
            '@typescript-eslint/strict-boolean-expressions': 0,
            '@typescript-eslint/prefer-nullish-coalescing': 0,
            '@typescript-eslint/explicit-function-return-type': 0,
            '@typescript-eslint/no-non-null-assertion': 0,
            'sort-imports': [
                'warn',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                },
            ],
            'no-undef': 'off',
            '@typescript-eslint/no-this-alias': [
                'warn',
                {
                    allowedNames: ['self'],
                },
            ],
        },
    },
);
