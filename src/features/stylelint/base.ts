export const stylelintignore = `node_modules/
dist/
*.min.css
`
export const scssRules = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'scss/at-function-pattern': '^[a-zA-Z]+([a-zA-Z0-9-]+[a-zA-Z0-9]+)?$',
    'scss/at-import-no-partial-leading-underscore': null,
    'scss/dollar-variable-pattern': '^[_]?[a-zA-Z]+([a-zA-Z0-9-]+[a-zA-Z0-9]+)?$',
  }
}
export const stylelint = {
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-standard'],
  rules: {
    'order/properties-order': [
      'display',
      'float',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'margin',
      'padding',
      'width',
      'height',
      'border',
      'font',
      'color',
      'text-align',
      'line-height',
      'background-color',
      'opacity',
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-name-quotes': 'always-where-recommended',
    'font-family-no-missing-generic-family-keyword': [
      true,
      {
        ignoreFontFamilies: ['DINAlternate-Bold'],
      },
    ],
    'function-calc-no-unspaced-operator': true,
    'max-nesting-depth': [
      3,
      {
        ignore: ['pseudo-classes', 'blockless-at-rules'],
        ignoreAtRules: [':global', 'include'],
      },
    ],
    'no-descending-specificity': null,
    'no-unknown-animations': true,
    'unit-allowed-list': ['px', 'deg', 's', '%', 'vw', 'vh', 'ms', 'em'],
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['box'],
      },
    ],
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['box-orient'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'tap-highlight-color',
          'scroll-chaining',
          'box-align',
          'box-pack',
          'flex-pack',
          'composes',
        ],
      },
    ],
    'selector-pseudo-element-allowed-list': [
      'after',
      'before',
      'placeholder',
      'scrollbar',
      'scrollbar-thumb',
      'clear',
      'reveal',
    ],
    'selector-type-no-unknown': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['/global/'],
      },
    ],
    'selector-class-pattern': '^[a-zA-Z0-9\\-_]+$',
    'selector-no-qualifying-type': null,
    'selector-max-compound-selectors': null,
    'selector-max-id': null,
  }
}


