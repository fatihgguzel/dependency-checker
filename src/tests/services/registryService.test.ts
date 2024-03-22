import axios from 'axios';
import * as registryService from '../../services/registryService';
import { Errors } from '../../types/Errors';
import * as Enums from '../../types/enums';
import { AppError } from '../../errors/AppError';

jest.mock('axios');

describe('registryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOutdatedDependencies', () => {
    it('should return outdated dependencies', async () => {
      const dependencies = [
        { name: 'dependency1', version: '1.0.0' },
        { name: 'dependency2', version: '2.0.0' },
      ];
      const registry = Enums.DependencyRegistries.JAVASCRIPT;

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: { version: '1.1.0' } });
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: { version: '2.0.0' } });

      const result = await registryService.getOutdatedDependencies({ dependencies, registry });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: 'dependency1', version: '1.0.0', latestVersion: '1.1.0' });
    });

    it('should throw AppError.CANNOT_GET_REGISTRY_METADATA if failed to get registry metadata', async () => {
      const dependencies = [{ name: 'dependency1', version: '1.0.0' }];
      const registry = Enums.DependencyRegistries.PHP;

      (axios.get as jest.Mock).mockRejectedValueOnce(new AppError(Errors.CANNOT_GET_REGISTRY_METADATA, 400));

      await expect(registryService.getOutdatedDependencies({ dependencies, registry })).rejects.toThrow(
        new AppError(Errors.CANNOT_GET_REGISTRY_METADATA, 400),
      );
    });
  });
});
