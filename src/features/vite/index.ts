import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FrameworkType, FeatureType, CompileFrameWork } from "../../types";
import addEnv from '../env';

function viteConfig(targetDir: string, template: FrameworkType, ext: string, isMock: boolean) {
  let content = ``
  let npmName = 'react'
  let pkg = {
    scripts: {
      "dev": "vite --mode dev",
      "test": "vite --mode test",
      "online": "vite --mode prod",
      "build:test": "vite build --mode test",
      "build": "vite build --mode prod",
      "serve": "vite preview"
    },
    devDependencies: {
      "vite": "^5.2.12"
    }
  }

  switch (template) {
    case FrameworkType.vue:
      content = `import vue from '@vitejs/plugin-vue';`
      npmName = 'vue'
      pkg.devDependencies['@vitejs/plugin-vue'] = "^5.0.5"
      break;
    case FrameworkType.reactNative:
      break;
    default:
      content = `import react from '@vitejs/plugin-react';`
      pkg.devDependencies['@vitejs/plugin-react'] = "^4.3.0"
      break;
  }
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, pkg)

  const viteConfig = `import { defineConfig, loadEnv } from 'vite';
${content}
import path from 'path';
${isMock ? "import { viteMockServe } from 'vite-plugin-mock';" : ''}

export default ({ mode }) => {
  const env = loadEnv(mode, './env');
  return defineConfig({
    plugins: [
      ${npmName}()
      ${isMock ? `,viteMockServe({
        mockPath: 'mock',
        enable: mode === 'dev',
      })` : ''}
    ],
    server: {
      port: 5000,
      open: env.VITE_APP_BASE,
    },
    base:env.VITE_APP_BASE,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    build: {
      sourcemap: mode !== 'prod',
      minify: 'terser',
      chunkSizeWarningLimit: 300,
      terserOptions: {
        compress: {
          drop_console: mode !== 'prod',
        },
      }
    },
  })
}`

  createOrOverwriteFile(`${targetDir}/vite.config.${ext}`, viteConfig)
}

/**
 * 初始化 Vite
 *
 * @param targetDir 目标目录
 * @param features 功能列表
 * @returns 无返回值
 */
export default function initVite(targetDir: string, template: FrameworkType, features: string[], compileFrameWork: CompileFrameWork) {
  if (compileFrameWork !== CompileFrameWork.vite) return;
  const isTs = features.includes(FeatureType.TypeScript);
  const isMock = features.includes(FeatureType.Mock);
  const ext = isTs ? 'ts' : 'js';
  addEnv(targetDir, compileFrameWork)
  viteConfig(targetDir, template, ext, isMock)
  isTs && createOrOverwriteFile(`${targetDir}/.vite-env.d.ts`, '/// <reference types="vite/client" />')
}