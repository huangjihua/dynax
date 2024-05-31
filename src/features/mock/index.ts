import { createOrOverwriteFile, createOrUpdateJsonConfigFile } from '../../utils/file'
import { GenericObject, FeatureType } from "../../types";
import addMockApi from './mock-api'
import addApi from './api';

export default function addMock(targetDir: string, features: string[]) {
  if (!features.includes(FeatureType.Mock)) return;

  addMockApi(targetDir)
  addApi(targetDir, features)
}