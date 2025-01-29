import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            indent: ["error", 4],
            "max-len": [
                "warn",
                {
                    code: 100,
                },
            ],
            "comma-dangle": ["error", "always-multiline"],
            "object-curly-spacing": ["error", "always"],
            "no-duplicate-imports": "error",
            "no-multi-spaces": "error",
            "no-multiple-empty-lines": [
                "error",
                {
                    max: 1,
                    maxEOF: 1,
                },
            ],
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "lf",
                    tabWidth: 4,
                    printWidth: 100,
                },
            ],
        },
    },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
];
