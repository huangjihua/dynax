
import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { GenericObject, FeatureType, FrameworkType } from "../../types";
import { eslintBase, eslintignore } from './base'

/**
 * 添加 ESLint 规则到项目中
 *
 * @param template 框架类型
 * @param feature 功能类型（可选）
 */
function addEslint(targetDir: string, template: FrameworkType, features: string[]) {
  if (!features.includes(FeatureType.Eslint)) return;
  let config: GenericObject = eslintBase
  let installNpm: GenericObject[] = [{ eslint: '>=7', "eslint-plugin-node": "^11.1.0" }]
  let ext: string[] = []
  if (features.includes(FeatureType.TypeScript)) {
    config.env = {
      node: true,
      browser: true,
      es2021: true,
    }
    installNpm.push({ "@typescript-eslint/parser": "^7.11.0", "@typescript-eslint/eslint-plugin": "^7.11.0" })
    ext.push('.ts')
  }
  switch (template) {
    case FrameworkType.react:
      config = {
        extends: [
          'eslint:recommended',
          'plugin:react/recommended',
          // 'plugin:jsx-a11y/recommended',
          'plugin:react-hooks/recommended',
        ],
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
        plugins: ["react-refresh"],
        rules: {
          'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
          ],
        },
      }
      installNpm.push({ "eslint-plugin-react-refresh": "^0.4.7", })
      ext.push('.jsx')
      if (features.includes(FeatureType.TypeScript)) {
        delete config.parserOptions;
        config = {
          ...config,
          ...{
            extends: [
              ...config.extends,
              'plugin:@typescript-eslint/recommended'
            ],
            parser: '@typescript-eslint/parser',
          }
        }
        // installNpm.push({ "eslint-plugin-jsx-a11y": "^6.7.1", })
        ext.push('.tsx')
      }

      break;
    case FrameworkType.vue:
      config = {
        extends: [
          'eslint:recommended',
          'plugin:vue/strongly-recommended'
        ],
        parserOptions: {
          parser: '@babel/eslint-parser'
        }
      }
      installNpm.push({ "eslint-plugin-vue": "^9.9.0", })
      if (features.includes(FeatureType.TypeScript)) {
        config = {
          ...config, ...{
            parser: "vue-eslint-parser",
            extends: [
              'eslint:recommended',
              'plugin:vue/vue3-essential',
              '@vue/eslint-config-typescript'
            ],
            plugins: ["@typescript-eslint"],
            parserOptions: {
              ecmaVersion: 2020,
              parser: "@typescript-eslint/parser",
            }
          }
        }
        installNpm.push({ '@vue/eslint-config-typescript': '^13.0.0' })
      }
      ext.push('.vue')
      break;
    case FrameworkType.reactNative:
      config = {
        extends: '@react-native-community/eslint-config',
        parser: '@babel/eslint-parser',
        plugins: ['react', 'react-native'],
      }
      installNpm.push({ '@babel/eslint-parser': '^7.24.6', 'eslint-plugin-react-native': '^4.1.0' })
      ext.push('.jsx')
      if (features.includes(FeatureType.TypeScript)) {
        delete config['parser'];
        config.parserOptions = {
          ecmaVersion: 2020,
        }
        ext.push('.tsx')
      }
      break;
    default:
      break;
  }
  config = { ...eslintBase, ...config }
  // console.log('eslint 相关包：', Object.assign({}, ...installNpm))
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    scripts: {
      lint: `eslint --ext .js,${ext.join(',')} src`,
    },
    devDependencies: { ...Object.assign({}, ...installNpm) },
  })
  createOrOverwriteFile(`${targetDir}/.eslintrc.js`, `module.exports = ${JSON.stringify(config, null, 2).replace(/"(?!.*\/)(?!.*-)([^"]+)":/g, '$1:')}`)
  createOrOverwriteFile(`${targetDir}/.eslintignore`, eslintignore)
}

export default addEslint