// 通用对象类型
interface GenericObject { [key: string]: any }
// 用户输入
interface IQuestion {
  name: string;
  description: string;
  author: string;
  git: string;
  base?: string;
  editPattern?: string;
}
enum FrameworkType {
  react = 'react',
  vue = 'vue',
  reactNative = 'react-native'
}
// 选择功能
enum FeatureType {
  TypeScript = 'typescript',
  Eslint = 'eslint',
  Stylelint = 'stylelint',
  Prettier = 'prettier',
  Mock = 'mock'
}
// 命令参数类型
interface ICmdArgs {
  template?: FrameworkType; // 模版
  context?: string;
}

export { GenericObject, FrameworkType, FeatureType, IQuestion, ICmdArgs }