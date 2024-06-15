import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";

/**
 * 生成组件
 *
 * @param {string} targetDir 目标目录路径
 * @param {string} lang isTS? lang="ts":'';
 */
async function generateComponent(targetDir: string, lang: string) {
  const HelloWorld = `<script setup${lang}>
import { ref,onMounted } from 'vue'
import {getHelloworld} from '@/api'
 
  const data = ref(null);
  onMounted(async () => {
    try {
      const {returncode,result} = await getHelloworld();
      if(returncode===0) {data.value = result}
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

</script>

<template>
  <div className="dynax-layout-center">
      <h2>{{data}}</h2>
  </div>
</template>

<style scoped>
</style>
`
  await createOrOverwriteFile(`${targetDir}/src/components/hello-world/index.vue`, HelloWorld)
}

/**
 * 生成 index 文件
 *
 * @param targetDir 目标目录
 * @param isMock 是否为 mock
 * @param lang  语言类型 isTS? lang="ts":'';
 */
async function generateIndex(targetDir: string, isMock: boolean, isTs: boolean, lang: string) {
  const indexPageContent = `<script setup${lang}>
  import { ref } from 'vue'
  ${isMock ? `import HelloWorld from '@/components/hello-world/index.vue'` : ''}

  const count = ref(0)
</script>

<template>
  <div class="dynax-layout-center">
    <a href="https://vitejs.dev" target="_blank">
      <img src="../../assets/images/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../../assets/images/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
   <h1>Vite + Vue  + ${lang ? "TypeScript" : 'JavaScript'}</h1>
  ${isMock ? `<HelloWorld />` : ''}
  <div class="dynax-layout-center card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>
   <p className="dynax-layout-center">
      Edit
      <code>src/views/index.vue</code> to test HMR
    </p>
  <p class="dynax-layout-center">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
  @import 'style.css'
</style>`
  await createOrOverwriteFile(`${targetDir}/src/views/index/index.vue`, indexPageContent)
}

async function generateApp(targetDir: string, lang: string) {
  const appContent = `<script setup${lang}>
import Index from '@/views/index/index.vue'
</script>

<template>
  <Index/>
</template>

<style scoped>
</style>
`
  await createOrOverwriteFile(`${targetDir}/src/App.vue`, appContent)
}

/**
 * 生成主文件
 *
 * @param targetDir 目标目录
 * @param ext 文件扩展名
 */
async function generateMain(targetDir: string, ext: string) {
  const mainPageContent = `import { createApp } from 'vue'
  import App from './App.vue'
  import '@/assets/css/index.css'

  createApp(App).mount('#app')`
  await createOrOverwriteFile(`${targetDir}/src/main.${ext} `, mainPageContent)
}
/**
 * 生成 React 应用
 *
 * @param targetDir 目标目录路径
 * @param features 功能列表
 * @param reactVersion React 版本号（可选）
 */
export default async function generateVueApp(targetDir: string, features: string[], reactVersion?: string) {
  const isTs = features.includes(FeatureType.TypeScript);
  const isMock = features.includes(FeatureType.Mock);
  const ext = isTs ? 'ts' : 'js';
  const lang = isTs ? ' lang="ts"' : '';

  await generateIndex(targetDir, isMock, isTs, lang)
  await generateApp(targetDir, lang)
  await generateMain(targetDir, ext)
  isMock && await generateComponent(targetDir, lang)
  await createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    dependencies: {
      "vue": "^3.4.27"
    }
  })
}