import typescriptEslint from "typescript-eslint";

export default [
    {
        files: ["**/*.ts"],
        ignores: ["out/**", "dist/**", "**/*.d.ts"],
        plugins: {
            "@typescript-eslint": typescriptEslint.plugin,
        },
        languageOptions: {
            parser: typescriptEslint.parser,
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE", "kebab-case"],
                },
                {
                    selector: "variable",
                    format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE", "kebab-case"],
                },
                {
                    selector: "function",
                    format: ["camelCase", "PascalCase", "snake_case", "kebab-case"],
                },
                {
                    selector: "parameter",
                    format: ["camelCase", "snake_case", "PascalCase"],
                },
                {
                    selector: "property",
                    format: null, // Allow any format for properties (for JSON conversion)
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-non-null-assertion": "warn",
            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "warn",
            "no-unused-vars": "off", // Use TypeScript version instead
        },
    },
];