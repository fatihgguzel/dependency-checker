import * as GitService from '../../services/gitService';
import * as QueueService from '../../services/queueService';
import * as Consts from '../../consts';
import request from 'supertest';
import { app, server } from '../../app';

jest.mock('../../services/gitService', () => ({
  checkDependencies: jest.fn(),
}));
jest.mock('../../services/queueService', () => ({
  addProcess: jest.fn(),
  clearQueue: jest.fn(),
}));
jest.mock('bullmq');

describe('gitRoute', () => {
  describe('POST /api/git/dependency', () => {
    it('should call GitService.checkDependencies and QueueService.addProcess with correct data', async () => {
      (GitService.checkDependencies as jest.Mock).mockResolvedValue(undefined);
      (QueueService.addProcess as jest.Mock).mockResolvedValue(undefined);
      (QueueService.clearQueue as jest.Mock).mockResolvedValue(undefined);

      const mockRequest = {
        repository: 'testRepo',
        sendTo: ['test@example.com'],
        provider: 'github',
      };

      const res = await request(app).post('/api/git/dependency').send(mockRequest);

      expect(res.status).toEqual(200);

      expect(GitService.checkDependencies).toHaveBeenCalledWith({
        repository: 'testRepo',
        sendTo: ['test@example.com'],
        provider: 'github',
      });

      expect(QueueService.addProcess).toHaveBeenCalledWith({
        metadata: {
          repository: 'testRepo',
          sendTo: ['test@example.com'],
          provider: 'github',
          waitFor: Consts.CONTROL_PERIOD_IN_MS,
        },
      });
    });

    afterAll((done) => {
      jest.restoreAllMocks();
      server.close(done);
    });
  });
});
