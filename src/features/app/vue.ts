import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";

/**
 * 生成组件
 *
 * @param {string} targetDir 目标目录路径
 * @param {string} ext 扩展名
 */
function generateComponent(targetDir: string, ext: string) {
  const helloDynax = `<script setup>
import { ref } from 'vue'

defineProps({
  data: String,
})
</script>

<template>
  <div class="hello-dynax">
    <h1 style="color: red">{{data}}</h1>
  </div>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
`
  createOrOverwriteFile(`${targetDir}/src/components/hello-dynax.vue`, helloDynax)
}

/**
 * 生成 React 应用
 *
 * @param targetDir 目标目录路径
 * @param features 功能列表
 * @param reactVersion React 版本号（可选）
 */
export default function generateVueApp(targetDir: string, features: string[], reactVersion?: string) {
  const isTs = features.includes(FeatureType.TypeScript);
  const isMock = features.includes(FeatureType.Mock);
  const ext = isTs ? 'ts' : 'js';
  const mainPageContent = `import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')`

  const appPageContent = `<script setup${isTs ? 'lang="ts"' : ''}>
  import { ref } from 'vue'
  ${isMock ? `import HelloDynax from '@/components/hello-dynax.vue'` : ''}
  const count = ref(0)
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
   <h1>Vite + Vue</h1>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
  ${isMock ? `<HelloDynax />` : ''}
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>`
  createOrOverwriteFile(`${targetDir}/src/App.vue`, appPageContent)
  createOrOverwriteFile(`${targetDir}/src/main.${ext}`, mainPageContent)
  isMock && generateComponent(targetDir, ext)
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    dependencies: {
      "vue": "^3.4.27"
    }
  })
}