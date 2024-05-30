export const stylelintignore = `node_modules/
dist/
*.min.css
`
export const stylelint = {
  extends: ["stylelint-config-standard", "stylelint-config-prettier"],
  plugins: [],
  rules: {
    "selector-class-pattern": null,
    "selector-pseudo-class-no-unknown": [true, {
      ignorePseudoClasses: ["global"]
    }],
    "declaration-block-single-line-max-declarations": null,
    "indentation": 2,
    "number-leading-zero": "always",
    "color-hex-case": "lower",
    "string-quotes": "single",
    "length-zero-no-unit": true,
    "property-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,
    "declaration-no-important": true,
    "declaration-block-no-duplicate-properties": true,
    "at-rule-empty-line-before": null,
    "block-closing-brace-newline-after": "always",
    "block-opening-brace-space-before": "always",
    "comment-whitespace-inside": "always",
    "max-nesting-depth": 3,
    "unit-whitelist": ["px", "em", 'vh'],
    "declaration-block-semicolon-newline-after": "always",
    "declaration-block-trailing-semicolon": "always",
    "declaration-colon-space-before": null,
    "function-comma-space-after": "always",
    "function-parentheses-space-inside": "never",
    "function-whitespace-after": "always",
    "number-max-precision": 3,
  }
}


