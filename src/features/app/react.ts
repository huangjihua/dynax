import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";

/**
 * 生成组件
 *
 * @param {string} targetDir 目标目录路径
 * @param {string} ext 扩展名
 */
function generateComponent(targetDir: string, ext: string) {
  const HelloWorld = `import React,{useState,useEffect} from 'react'
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
    <div className="dynax-layout-center">
      <h2>{data}</h2>
    </div>
  )
}`
  createOrOverwriteFile(`${targetDir}/src/components/hello-world/index.${ext}`, HelloWorld)
}

/**
 * 生成 index 文件
 *
 * @param targetDir 目标目录
 * @param isMock 是否为 mock
 * @param ext 文件扩展名
 */
function generateIndex(targetDir: string, isMock: boolean, isTs: boolean, ext: string) {

  const indexPageContent = `import React,{ useState } from 'react'
import reactLogo from '@/assets/images/react.svg'
import viteLogo from '@/assets/images/vite.svg'
${isMock ? `import HelloWorld from '@/components/hello-world'` : ''}
import './style.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className="dynax-layout-center">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + ${isTs ? "TypeScript" : 'JavaScript'}</h1>
       ${isMock ? `<HelloWorld />` : ''}
      <div className="dynax-layout-center card">
        <button onClick={() => setCount(prevCount => prevCount + 1)}>count is {count}</button>
      </div>
      <p className="dynax-layout-center">
        Edit <code>src/views/index.${ext} </code> and save to test HMR
      </p>
      <p className="dynax-layout-center">Click on the Vite and React logos to learn more</p>
    </>
  )
}
export default App`
  createOrOverwriteFile(`${targetDir}/src/views/index/index.${ext}`, indexPageContent)
}

function generateApp(targetDir: string, isTs: boolean, ext: string) {
  const appPageContent = `import React,{lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary";

/**
 * 组件渲染错误后的 fallback 组件
 * @param param0
 * @returns
 */
function ErrorFallback(${isTs ? '{ error }: { error: Error }' : 'error'}) {
  console.error(error);
  return (<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <button onClick={() => window.location.reload()}>点击刷新</button>
  </div>);
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

export default App;

  `
  createOrOverwriteFile(`${targetDir}/src/App.${ext}`, appPageContent)
}
function generateMain(targetDir: string, isTs: boolean, ext: string) {
  const mainPageContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${ext}'
import '@/assets/css/index.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>)`
  createOrOverwriteFile(`${targetDir}/src/main.${ext}`, mainPageContent)
}

/**
 * 生成 React 应用
 *
 * @param targetDir 目标目录路径
 * @param features 功能列表
 * @param reactVersion React 版本号（可选）
 */
export default function generateReactApp(targetDir: string, features: string[], reactVersion?: string) {
  const isTs = features.includes(FeatureType.TypeScript);
  const isMock = features.includes(FeatureType.Mock);
  const ext = isTs ? 'tsx' : 'jsx';

  generateIndex(targetDir, isMock, isTs, ext)
  generateApp(targetDir, isTs, ext)
  generateMain(targetDir, isTs, ext)
  isMock && generateComponent(targetDir, ext)
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    "dependencies": {
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "react-error-boundary": "^4.0.13",
      "react-router-dom": "^6.23.1"
    },
    "devDependencies": {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0"
    }
  })
}