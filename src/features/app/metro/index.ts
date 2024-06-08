import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../../utils/file'
import { FrameworkType } from "../../../types";

/**
 * 生成 Metro 配置文件
 *
 * @param targetDir 目标目录路径
 */
function generateMetroConfigFile(targetDir: string) {

  createOrOverwriteFile(`${targetDir}/metro.config.js`, `const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro配置
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@': ${'`${__dirname}/src`'},
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);`)
}

/**
 * 生成 label 配置文件
 *
 * @param targetDir 目标目录
 */
function generateLabelConfig(targetDir: string) {
  createOrOverwriteFile(`${targetDir}/babel.config.js`, `module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};`)
}

/**
 * 生成打包入口文件
 *
 * @param targetDir 目标目录
 */
function generateInputFile(targetDir: string) {
  createOrOverwriteFile(`${targetDir}/index.js`, `import { AppRegistry } from 'react-native';
import Index from './src/views/index/index';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Index);`)
}

/**
 * 生成应用配置文件
 *
 * @param targetDir 目标目录路径
 * @param projectName 项目名称
 */
function generateAppConfig(targetDir: string, projectName: string) {
  createOrUpdateJsonConfigFile(`${targetDir}/app.json`, {
    "name": projectName,
    "displayName": projectName
  }
  )
}

/**
 * 初始化 Metro 配置
 *
 * @param targetDir 目标目录
 * @param template 框架类型
 * @param projectName 项目名称
 * @param feature 功能列表
 * @returns 无返回值
 */
export default function initMetro(targetDir: string, template: FrameworkType, projectName: string, feature: string[]) {
  if (template !== FrameworkType.reactNative) return;
  generateMetroConfigFile(targetDir)
  generateLabelConfig(targetDir)
  generateAppConfig(targetDir, projectName)
  generateInputFile(targetDir)
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    "scripts": {
      "start": "react-native start",
      "android": "react-native run-android",
      "ios": "react-native run-ios",
      "build": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output dist/index.bundle --assets-dest dist/",
    },
    "dependencies": {
      "react-native-svg": "^15.3.0",
      "react-native-svg-transformer": "^1.4.0",
    },
    "devDependencies": {
      "@babel/core": "^7.14.6",
      "@babel/runtime": "^7.14.6",
      "babel-plugin-module-resolver": "^5.0.2",
      "metro-react-native-babel-preset": "0.77.0",
      "react-native-css-transformer": "2.0.0",
    }
  })
}