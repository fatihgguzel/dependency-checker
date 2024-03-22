import { GitHubProvider } from '../clients';
import * as Enums from '../types/enums';
import { IGetDependenciesMetaData, IDependency } from '../clients';
import * as Consts from '../consts';
import * as RegistryService from './registryService';
import * as MailService from './mailService';
import { AppError } from '../errors/AppError';
import { Errors } from '../types/Errors';

interface ICheckDependenciesOptions {
  repository: string;
  sendTo: string[];
  provider: Enums.GitProviders;
}
export async function checkDependencies(options: ICheckDependenciesOptions) {
  let dependenciesMetaData;
  switch (options.provider) {
    case Enums.GitProviders.GITHUB:
      dependenciesMetaData = await GitHubProvider.getDependenciesMetaData({
        repository: options.repository,
      });
      break;
  }

  const dependencies = await getDependencies({ dependenciesMetaData });

  if (!dependencies.length) {
    throw new AppError(Errors.DEPENDENCY_FILE_IS_INVALID, 400);
  }

  const outdatedDependencies = await RegistryService.getOutdatedDependencies({
    dependencies: dependencies,
    registry: dependenciesMetaData.registry,
  });

  await MailService.sendMail({
    repository: options.repository,
    outdatedDependencies,
    sendTo: options.sendTo,
  });
}

interface IGetDependenciesOptions {
  dependenciesMetaData: IGetDependenciesMetaData;
}
async function getDependencies(options: IGetDependenciesOptions) {
  try {
    const { content, dependencyFile } = options.dependenciesMetaData;

    const keysToParse = Consts.DEPENDENCY_KEY_NAMES[dependencyFile];

    return parseDependencies({ content, keysToParse });
  } catch (err) {
    throw new AppError(Errors.DEPENDENCY_FILE_IS_INVALID, 400);
  }
}

interface IParseDependenciesOptions {
  content: string;
  keysToParse: string[];
}
function parseDependencies(options: IParseDependenciesOptions) {
  const dependencies: IDependency[] = [];
  const parsedContent = JSON.parse(options.content);

  options.keysToParse.forEach((key) => {
    if (parsedContent[key]) {
      for (const dependencyName in parsedContent[key]) {
        const dependencyVersion = parsedContent[key][dependencyName].toString();

        // NOTE : Be aware of that, parseDependencies() function assumes that version
        // is in valid format. It can only include ^ or ~ at the beginning of the version string
        const parsedVersion = parseVersion(dependencyVersion);

        if (parsedVersion) {
          dependencies.push({ name: dependencyName, version: parsedVersion });
        }
      }
    }
  });

  return dependencies;
}

function parseVersion(version: string) {
  let parsedVersion = '';
  if (version.startsWith('~') || version.startsWith('^')) {
    parsedVersion = version.slice(1);
  }

  if (
    parsedVersion !== '' &&
    parsedVersion.split('').every((char) => char === '.' || Number.isInteger(parseInt(char)))
  ) {
    return parsedVersion;
  }
}
