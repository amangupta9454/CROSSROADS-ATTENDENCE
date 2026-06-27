const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                require: "readonly",
                module: "readonly",
                exports: "readonly",
                __dirname: "readonly",
                process: "readonly",
                console: "readonly",
                Buffer: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                setTimeout: "readonly"
            },
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        rules: {
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "no-undef": "error"
        }
    }
];
