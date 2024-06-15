import { createOrUpdateJsonConfigFile } from '../../utils/file'
import { FeatureType } from "../../types";
import addMockApi from './mock-api'

export default async function addMock(targetDir: string, features: string[]) {
  if (!features.includes(FeatureType.Mock)) return;

  await addMockApi(targetDir)
  await createOrUpdateJsonConfigFile(
    `${targetDir}/package.json`,
    {
      devDependencies: {
        "vite-plugin-mock": '^3.0.2'
      }
    }
  )
}