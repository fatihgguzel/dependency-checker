import * as Consts from '../consts';
import * as Enums from '../types/enums';
import { IDependency, IRegistryDependency } from '../clients';
import axios from 'axios';
import { AppError } from '../errors/AppError';
import { Errors } from '../types/Errors';

interface IGetOutdatedDependenciesOptions {
  dependencies: IDependency[];
  registry: Enums.DependencyRegistries;
}
export async function getOutdatedDependencies(options: IGetOutdatedDependenciesOptions) {
  try {
    const outdatedDependencies: IRegistryDependency[] = [];

    const registryMetaData = await getRegistryMetaData({
      dependencies: options.dependencies,
      registry: options.registry,
    });

    registryMetaData.forEach((pkg) => {
      if (compareVersions({ currentVersion: pkg.version, latestVersion: pkg.latestVersion })) {
        outdatedDependencies.push(pkg);
      }
    });

    return outdatedDependencies;
  } catch (err) {
    throw new AppError(Errors.CANNOT_GET_REGISTRY_METADATA, 400);
  }
}

interface IGetRegistryMetaDataOptions {
  dependencies: IDependency[];
  registry: Enums.DependencyRegistries;
}
async function getRegistryMetaData(options: IGetRegistryMetaDataOptions) {
  const registryDependenciesMetaData: IRegistryDependency[] = [];
  let promises;

  switch (options.registry) {
    case Enums.DependencyRegistries.JAVASCRIPT:
      promises = options.dependencies.map(async (dep) => {
        return getNPMDependency(dep);
      });
      break;
    case Enums.DependencyRegistries.PHP:
      promises = options.dependencies.map(async (dep) => {
        return getComposerDependency(dep);
      });
      break;
  }

  const responses = await Promise.all(promises);

  responses.forEach((registryDep) => {
    if (!(registryDep instanceof Error)) {
      registryDependenciesMetaData.push(registryDep as unknown as IRegistryDependency);
    }
  });

  return registryDependenciesMetaData;
}

async function getNPMDependency(dependency: IDependency) {
  const { data } = await axios.get(`${Consts.NPM_REGISTRY_BASE_URL}/${dependency.name}/latest`);

  return { ...dependency, latestVersion: data.version };
}

async function getComposerDependency(dependency: IDependency) {
  const { data } = await axios.get(`${Consts.COMPOSER_REGISTRY_BASE_URL}/p2/${dependency.name}.json`);

  return { ...dependency, latestVersion: data.packages[dependency.name][0]['version_normalized'] };
}

interface ICompareVersionsOptions {
  currentVersion: string;
  latestVersion: string;
}
function compareVersions(options: ICompareVersionsOptions) {
  const current = options.currentVersion.split('.').map(Number);
  const latest = options.latestVersion.split('.').map(Number);

  const maxLength = Math.max(current.length, latest.length);
  for (let i = 0; i < maxLength; i++) {
    const currentSegment = current[i] || 0;
    const latestSegment = latest[i] || 0;

    if (latestSegment > currentSegment) {
      return true;
    } else if (latestSegment < currentSegment) {
      return false;
    }
  }

  return false;
}
