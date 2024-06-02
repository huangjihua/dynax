import { FrameworkType } from "../../types";
import generateReactApp from '../app/react'
import generateVueApp from '../app/vue'

export default function initApp(targetDir: string, template: FrameworkType, features: string[]) {
  switch (template) {
    case FrameworkType.vue:
      generateVueApp(targetDir, features)
      break;
    case FrameworkType.reactNative:

      break;
    default:
      generateReactApp(targetDir, features)
      break;
  }
}