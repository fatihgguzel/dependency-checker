import { AppError } from '../../errors/AppError';
import * as Enums from '../../types/enums';
import { IGetDependenciesMetaData } from '../../clients';
import * as RegistryService from '../../services/registryService';
import * as MailService from '../../services/mailService';
import * as GitService from '../../services/gitService';
import { GitHubProvider } from '../../clients';
import { Errors } from '../../types/Errors';

jest.mock('../../clients', () => ({
  GitHubProvider: {
    getDependenciesMetaData: jest.fn(),
  },
}));

jest.mock('../../services/registryService', () => ({
  getOutdatedDependencies: jest.fn(),
}));

jest.mock('../../services/mailService', () => ({
  sendMail: jest.fn(),
}));

describe('checkDependencies', () => {
  it('should call GitHubProvider.getDependenciesMetaData() and process dependencies', async () => {
    const repository = 'example/repository';
    const sendTo = ['test@example.com'];
    const dependenciesMetaData: IGetDependenciesMetaData = {
      content: JSON.stringify({
        dependencies: {
          package1: '^1.0.0',
          package2: '~2.0.0',
        },
      }),
      registry: Enums.DependencyRegistries.JAVASCRIPT,
      dependencyFile: Enums.DependencyFilePaths.JAVASCRIPT,
    };

    (GitHubProvider.getDependenciesMetaData as jest.Mock).mockResolvedValueOnce(dependenciesMetaData);

    (RegistryService.getOutdatedDependencies as jest.Mock).mockResolvedValueOnce([]);

    await GitService.checkDependencies({ repository, sendTo, provider: Enums.GitProviders.GITHUB });

    expect(GitHubProvider.getDependenciesMetaData).toHaveBeenCalledWith({ repository });
    expect(RegistryService.getOutdatedDependencies).toHaveBeenCalledWith({
      dependencies: [
        { name: 'package1', version: '1.0.0' },
        { name: 'package2', version: '2.0.0' },
      ],
      registry: Enums.DependencyRegistries.JAVASCRIPT,
    });
    expect(MailService.sendMail).toHaveBeenCalled();
  });

  it('should throw AppError.DEPENDENCY_FILE_NOT_FOUND when GitHubProvider.getDependenciesMetaData() fails', async () => {
    (GitHubProvider.getDependenciesMetaData as jest.Mock).mockRejectedValueOnce(
      new AppError(Errors.DEPENDENCY_FILE_NOT_FOUND),
    );

    await expect(
      GitService.checkDependencies({
        repository: 'example/repository',
        sendTo: ['test@example.com'],
        provider: Enums.GitProviders.GITHUB,
      }),
    ).rejects.toThrow(new AppError(Errors.DEPENDENCY_FILE_NOT_FOUND, 404));
  });

  it('should throw AppError.DEPENDENCY_FILE_IS_INVALID when getDependencies() fails', async () => {
    const repository = 'example/repository';
    const sendTo = ['test@example.com'];
    const dependenciesMetaData: IGetDependenciesMetaData = {
      content: JSON.stringify({
        unknownKey: {
          package1: '^1.0.0',
          package2: '~2.0.0',
        },
        someOtherUnknownKey: {
          package1: '^1.0.0',
          package2: '~2.0.0',
        },
      }),
      registry: Enums.DependencyRegistries.JAVASCRIPT,
      dependencyFile: Enums.DependencyFilePaths.JAVASCRIPT,
    };

    (GitHubProvider.getDependenciesMetaData as jest.Mock).mockResolvedValueOnce(dependenciesMetaData);

    expect(GitHubProvider.getDependenciesMetaData).toHaveBeenCalledWith({ repository });
    await expect(
      GitService.checkDependencies({ repository, sendTo, provider: Enums.GitProviders.GITHUB }),
    ).rejects.toThrow(new AppError(Errors.DEPENDENCY_FILE_IS_INVALID, 400));
  });
});
