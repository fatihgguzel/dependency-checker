import { Job, Queue, Worker } from 'bullmq';
import * as Enums from '../types/enums';
import * as GitService from './gitService';
import { AppError } from '../errors/AppError';
import { Errors } from '../types/Errors';

interface IJobData {
  repository: string;
  sendTo: string[];
  provider: Enums.GitProviders;
  waitFor: number;
}

const connection = {
  host: process.env.REDIS_HOST || '',
  port: parseInt(process.env.REDIS_PORT || '') || 6379,
};

export const checkDependencyQueue = new Queue('dependencyQueue', {
  connection,
});

export const checkDependencyWorker = new Worker(
  'dependencyQueue',
  async (job: Job<IJobData>) => {
    await GitService.checkDependencies({
      repository: job.data.repository,
      sendTo: job.data.sendTo,
      provider: job.data.provider,
    });

    await addProcess({ metadata: job.data });
  },
  { connection },
);

interface IAddProcessOptions {
  metadata: IJobData;
}
export async function addProcess(options: IAddProcessOptions) {
  try {
    await checkDependencyQueue.add(
      options.metadata.repository,
      { ...options.metadata, waitFor: options.metadata.waitFor },
      {
        delay: options.metadata.waitFor,
      },
    );
  } catch (err) {
    throw new AppError(Errors.INTERNAL_SERVER_ERROR, 500);
  }
}

export async function clearQueue() {
  await checkDependencyQueue.obliterate({ force: true });
}
