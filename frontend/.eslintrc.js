module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:storybook/recommended',
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'plugin:@next/next/recommended',
    'plugin:import/typescript',
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
      rules: {
        // example of overriding a rule
        'import/no-extraneous-dependencies': 'off',
        'storybook/hierarchy-separator': 'error',
        'storybook/default-exports': 'off',
      },
    },
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    indent: 0,
    'max-len': 'off',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'object-curly-newline': 'off',
    'arrow-parens': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-nested-ternary': 'off',
    'nonblock-statement-body-position': ['error', 'any'],
    'no-underscore-dangle': 'off',
    camelcase: 'off',
    'consistent-return': 0,
    'no-restricted-syntax': 'off',
    'func-names': 'off',
    'no-console': 0,
    'arrow-body-style': ['error', 'as-needed'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/no-unescaped-entities': 0,
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx', '.stories.tsx'],
      },
    ],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 'off',
  },
};
