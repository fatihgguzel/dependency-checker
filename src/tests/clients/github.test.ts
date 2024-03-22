import axios from 'axios';
import { GitHubProvider } from '../../clients';
import * as Consts from '../../consts';
import { decodeBase64 } from '../../services/utils';
import { AppError } from '../../errors/AppError';
import { Errors } from '../../types/Errors';
import * as Enums from '../../types/enums';

jest.mock('axios');
jest.mock('../../services/utils');

describe('getDependenciesMetaData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return dependencies metadata', async () => {
    const options = { repository: 'user/repo' };
    const dependenciesFileInfo = {
      dependencyFile: 'package.json',
      registry: Enums.DependencyRegistries.JAVASCRIPT,
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [{ name: 'package.json' }] });

    const encodedContent = 'aGVsbG8gd29ybGQ=';
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { content: encodedContent } });

    const expectedResult = {
      content: 'hello world',
      registry: Enums.DependencyRegistries.JAVASCRIPT,
      dependencyFile: Enums.DependencyFilePaths.JAVASCRIPT,
    };

    (decodeBase64 as jest.Mock).mockReturnValueOnce('hello world');

    const result = await GitHubProvider.getDependenciesMetaData(options);

    expect(axios.get).toHaveBeenCalledWith(`${Consts.GITHUB_BASE_URL}/repos/${options.repository}/contents`);
    expect(axios.get).toHaveBeenCalledWith(
      `${Consts.GITHUB_BASE_URL}/repos/${options.repository}/contents/${dependenciesFileInfo.dependencyFile}`,
    );
    expect(decodeBase64).toHaveBeenCalledWith({ encodedString: encodedContent });
    expect(result).toEqual(expectedResult);
  });

  it('should throw an AppError if dependency file not found', async () => {
    const options = { repository: 'user/repo' };

    (axios.get as jest.Mock).mockRejectedValueOnce(new AppError(Errors.DEPENDENCY_FILE_NOT_FOUND, 404));

    await expect(GitHubProvider.getDependenciesMetaData(options)).rejects.toThrow(
      new AppError(Errors.DEPENDENCY_FILE_NOT_FOUND, 404),
    );
    expect(axios.get).toHaveBeenCalledWith(`${Consts.GITHUB_BASE_URL}/repos/${options.repository}/contents`);
  });
});
