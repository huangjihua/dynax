// 通用对象类型
export interface GenericObject { [key: string]: any }
// 用户输入
export interface IQuestion {
  name: string;
  description: string;
  author: string;
  git: string;
  base?: string;
  editPattern?: string;
}
export enum CompileFrameWork {
  vite = 'vite',
  webpack = 'webpack'
}
export enum FrameworkType {
  react = 'react',
  vue = 'vue',
  reactNative = 'react-native'
}
// 选择功能
export enum FeatureType {
  TypeScript = 'typescript',
  Eslint = 'eslint',
  Stylelint = 'stylelint',
  Prettier = 'prettier',
  Mock = 'mock'
}
// 命令参数类型
export interface ICmdArgs {
  template?: FrameworkType; // 模版
  context?: string;
}

