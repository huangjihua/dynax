import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";

/**
 * 生成组件
 *
 * @param {string} targetDir 目标目录路径
 * @param {string} ext 扩展名
 */
function generateComponent(targetDir: string, ext: string) {
  const helloDynax = `import {useState,useEffect} from 'react'
import {getHelloworld} from '@/api'
export default function HelloDynax() {
  const [data,setData] = useState(null);
  useEffect(()=>{
    async ()=>{
       const {returncode,result}= await getHelloworld();
       if(returncode===0) setData(result)
    }
  })
  return (
    <div>
      <h1>{{data}}</h1>
    </div>
  )
}`
  createOrOverwriteFile(`${targetDir}/src/components/hello-dynax.${ext}`, helloDynax)
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
  const mainPageContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${ext}'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>)`

  const appPageContent = `import { useState } from 'react'
import reactLogo from './assets/images/react.svg'
import viteLogo from '../public/vite.svg'
${isMock ? `import HelloDynax from '@/components/hello-dynax'` : ''}
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((prevCount) => prevCount + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.${ext}</code> and save to test HMR
        </p>
        ${isMock ? `<HelloDynax />` : ''}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
export default App`
  createOrOverwriteFile(`${targetDir}/src/App.${ext}`, appPageContent)
  createOrOverwriteFile(`${targetDir}/src/main.${ext}`, mainPageContent)
  isMock && generateComponent(targetDir, ext)
  createOrUpdateJsonConfigFile(`${targetDir}/package.json`, {
    "dependencies": {
      "react": "^18.3.1",
      "react-dom": "^18.3.1"
    },
    "devDependencies": {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0"
    }
  })
}