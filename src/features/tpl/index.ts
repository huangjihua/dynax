import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType, FrameworkType, CompileFrameWork } from "../../types";

function createTemplate(template: FrameworkType, features: string[]) {
  const isTs = features.includes(FeatureType.TypeScript);
  const ext = isTs ? 'ts' : 'js';
  let input = '/src/main.'
  switch (template) {
    case FrameworkType.vue:
      input += ext
      break;
    case FrameworkType.reactNative:
      input += isTs ? 'tsx' : 'jsx'
      break;
    default:
      input += isTs ? 'tsx' : 'jsx'
  }
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${template.toUpperCase()} APP</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${input}"></script>
  </body>
</html>`
}

export default function initTpl(targetDir: string, template: FrameworkType, features: string[], compileFrameWork: CompileFrameWork) {
  const tpl = createTemplate(template, features)
  switch (compileFrameWork) {
    case CompileFrameWork.webpack:
      createOrOverwriteFile(`${targetDir}/index.html`, tpl)
      break;
    case CompileFrameWork.metro:
      createOrOverwriteFile(`${targetDir}/index.html`, tpl)
      break;
    default:
      createOrOverwriteFile(`${targetDir}/index.html`, tpl)
      break;
  }
}