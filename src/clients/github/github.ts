import axios from 'axios';
import * as Consts from '../../consts';
import { decodeBase64 } from '../../services/utils';
import * as Enums from '../../types/enums';
import { AppError } from '../../errors/AppError';
import { Errors } from '../../types/Errors';
interface IGetDependenciesFileOptions {
  repository: string;
}
export async function getDependenciesMetaData(options: IGetDependenciesFileOptions) {
  try {
    const dependenciesFileInfo = await getDependenciesFileInfo({ repository: options.repository });

    const url = `${Consts.GITHUB_BASE_URL}/repos/${options.repository}/contents/${dependenciesFileInfo!.dependencyFile}`;

    const { data } = await axios.get(url);

    return {
      content: decodeBase64({ encodedString: data.content }) || '',
      registry: dependenciesFileInfo!.registry as Enums.DependencyRegistries,
      dependencyFile: dependenciesFileInfo!.dependencyFile as Enums.DependencyFilePaths,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(Errors.DEPENDENCY_FILE_NOT_FOUND, 404);
  }
}

interface IGetDependenciesFileInfoOptions {
  repository: string;
}
async function getDependenciesFileInfo(options: IGetDependenciesFileInfoOptions) {
  const url = `${Consts.GITHUB_BASE_URL}/repos/${options.repository}/contents`;

  const { data } = await axios.get(url);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependencyFile = data.find((depFile: any) => {
    return Object.values(Consts.DEPENDENCIES_CONFIG).some((config) => depFile.name === config.dependencyFile);
  });

  if (dependencyFile) {
    return Object.values(Consts.DEPENDENCIES_CONFIG).find((lang) => lang.dependencyFile === dependencyFile.name);
  }
}
