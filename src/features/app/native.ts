import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";

/**
 * 生成组件
 *
 * @param {string} targetDir 目标目录路径
 * @param {string} ext 扩展名
 */
async function generateComponent(targetDir: string, ext: string) {
  const HelloWorld = `import React,{useState,useEffect} from 'react'
import { View, Text } from 'react-native';
import {getHelloworld} from '@/api'

export default function Index() {
  const [data,setData] = useState(null);
  useEffect(()=>{
    getHelloworld()
    .then(({returncode,result}) => {
      if(returncode===0) setData(result)
    })
    .catch((error)=>{
      console.error(error)
    })
  },[])
  return (
    <View>
      <Text style={{ padding: 10, fontSize: 25, textAlign: 'center', color: 'white' }}>{data}</Text>
    </View>
  )
}`
  await createOrOverwriteFile(`${targetDir}/src/components/hello-world/index.${ext}`, HelloWorld)
}

/**
 * 生成 index 文件
 *
 * @param targetDir 目标目录
 * @param isMock 是否为 mock
 * @param ext 文件扩展名
 */
async function generateIndex(targetDir: string, isMock: boolean, isTs: boolean, ext: string) {
  const _count = '`count is ${count}`'
  const indexPageContent = `import React,{ useState } from 'react'
import { View, Button, Text, Image } from 'react-native';
${isMock ? `import HelloWorld from '@/components/hello-world'` : ''}
import reactNativeLogo from '@/assets/images/react-native.svg'
import viteLogo from '@/assets/images/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  return (
    <View>
      <View style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <Image source={viteLogo} style={{ width: 100, height: 100 }} />
        </a>
        <a href="https://reactnative.cn" target="_blank" rel="noreferrer">
          <Image source={reactNativeLogo} style={{ width: 100, height: 100 }} />
        </a>
      </View>
      <Text style={{ padding: 20, fontSize: '30px', color: 'white', textAlign: 'center' }}>
        Vite + React Native
      </Text>
      ${isMock ? `<HelloWorld />` : ''}
      <View>
        <Button title={${_count}} onPress={() => setCount(prevCount => prevCount + 1)} />
      </View>
      <Text style={{ fontSize: '14px', color: 'white', lineHeight: 30, textAlign: 'center' }}>
        Edit <code>src/views/index.jsx </code> and save to test HMR
      </Text>
      <Text style={{ fontSize: '14px', color: 'white', textAlign: 'center' }}>
        Click on the <a href="https://reactnative.cn/">React Native</a> to learn more
      </Text>
    </View>
  )
}
export default App`
  await createOrOverwriteFile(`${targetDir}/src/views/index/index.${ext}`, indexPageContent)
}

/**
 * 生成应用程序文件
 *
 * @param targetDir 目标目录
 * @param isTs 是否为TypeScript
 * @param ext 文件扩展名
 */
async function generateApp(targetDir: string, isTs: boolean, ext: string) {
  const appPageContent = `import React,{lazy } from 'react';
import { View, Button } from 'react-native';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary";

/**
 * 组件渲染错误后的 fallback 组件
 * @param param0
 * @returns
 */
function ErrorFallback(${isTs ? '{ error }: { error: Error }' : 'error'}) {
  console.error(error);
  return (<View style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Button title="点击刷新" onPress={() => window.location.reload()} />
  </View>);
}

/**
 * 错误日志
 * @param error
 * @param info
 */
const logError = (${isTs ? 'error: Error, info: { componentStack: string }' : 'error,info'}) => {
  // Do something with the error, e.g. log to an external API
  console.error(error,info);
};

const Index = lazy(() => import('./views/index'));

function App() {
  return (
     <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <BrowserRouter basename={ import.meta.env.BASE_URL || '/'}>
        <Routes>
          <Route path="/" element={<Index/>} />
        </Routes>
      </BrowserRouter>
     </ErrorBoundary>
  );
}

export default App;`
  await createOrOverwriteFile(`${targetDir}/src/App.${ext}`, appPageContent)
}

/**
 * 生成主文件
 *
 * @param targetDir 目标目录
 * @param isTs 是否是 TypeScript
 * @param ext 文件后缀名
 */
async function generateMain(targetDir: string, isTs: boolean, ext: string) {
  const mainPageContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${ext}'
import '@/assets/css/index.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>)`
  await createOrOverwriteFile(`${targetDir}/src/main.${ext}`, mainPageContent)
}

/**
 * 生成 React 应用
 *
 * @param targetDir 目标目录路径
 * @param features 功能列表
 * @param reactVersion React 版本号（可选）
 */
export default async function generateReactApp(targetDir: string, features: string[], reactVersion?: string) {
  const isTs = features.includes(FeatureType.TypeScript);
  const isMock = features.includes(FeatureType.Mock);
  const ext = isTs ? 'tsx' : 'jsx';

  await generateIndex(targetDir, isMock, isTs, ext)
  await generateApp(targetDir, isTs, ext)
  await generateMain(targetDir, isTs, ext)
  isMock && await generateComponent(targetDir, ext)
  await createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    "dependencies": {
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "react-error-boundary": "^4.0.13",
      "react-router-dom": "^6.23.1",
      "react-native": "0.74.2",
      "react-native-web": "0.19.12"
    },
    "devDependencies": {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0"
    }
  })
}