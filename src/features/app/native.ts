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
import { View, Text } from 'react-native';
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
    <View>
      <Text style={{ fontSize: 20 }}>{{data}}</Text>
    </View>
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
export default function generateNativeApp(targetDir: string, features: string[], reactVersion?: string) {
  const isTs = features.includes(FeatureType.TypeScript);
  const isMock = features.includes(FeatureType.Mock);
  const ext = isTs ? 'tsx' : 'jsx';

  const mainPageContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.${ext}';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
  const appFile = `import { useState } from 'react';
import { View, Text, Image } from 'react-native';
import reactNativeLogo from './assets/images/react-native.svg';
import viteLogo from './assets/images/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <View style={{ display: 'flex', justifyContent: 'space-around' }}>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <Image source={viteLogo} style={{ width: 100, height: 100 }} />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <Image source={reactNativeLogo} style={{ width: 100, height: 100 }} />
        </a>
      </View>
      <Text style={{ fontSize: '30px', color: 'white' }}>Vite + React Native</Text>
      <View>
        <Button title={'${`count is { count $}`}'} onPress={() => setCount(prevCount => prevCount + 1)} />
      </View>
      <Text style={{ fontSize: '14px', color: 'white' }}>
        Click on the <a href="https://reactnative.cn/">React Native</a> to learn more
      </Text>
    </View>
  );
}

export default App;
`
  createOrOverwriteFile(`${targetDir}/src/App.${ext}`, appFile)
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