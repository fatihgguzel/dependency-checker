import * as Enums from '../types/enums';

export interface IGetDependenciesMetaData {
  content: string;
  registry: Enums.DependencyRegistries;
  dependencyFile: Enums.DependencyFilePaths;
}

export interface IDependency {
  name: string;
  version: string;
}

export interface IRegistryDependency extends IDependency {
  latestVersion: string;
}
