import { FrameworkType } from "../../types";
import generateReactApp from '../app/react'
import generateVueApp from '../app/vue'
import generateNativeApp from '../app/native'
// import generateNativeApp from '../app/native/index'

export default function initApp(targetDir: string, template: FrameworkType, features: string[]) {
  switch (template) {
    case FrameworkType.vue:
      generateVueApp(targetDir, features)
      break;
    case FrameworkType.reactNative:
      generateNativeApp(targetDir, features)
      break;
    default:
      generateReactApp(targetDir, features)
      break;
  }
}