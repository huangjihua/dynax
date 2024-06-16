import { FrameworkType } from "../../types";
import generateReactApp from '../app/react'
import generateVueApp from '../app/vue'
import generateNativeApp from '../app/native'
import initMetro from '../app/metro'
// import generateNativeApp from '../app/native/index'

export default async function initApp(targetDir: string, template: FrameworkType, projectName: string, features: string[]) {
  switch (template) {
    case FrameworkType.vue:
      await generateVueApp(targetDir, features)
      break;
    case FrameworkType.reactNative:
      await generateNativeApp(targetDir, features)
      await initMetro(targetDir, template, projectName, features)
      break;
    default:
      await generateReactApp(targetDir, features)
      break;
  }
}