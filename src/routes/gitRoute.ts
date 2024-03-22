import { Request, Response, Router } from 'express';
import * as RequestJoiTypes from '../helpers/joi/requestJoiTypes';
import * as ResponseJoiTypes from '../helpers/joi/responseJoiTypes';
import * as RequestTypes from '../types/requestJoiTypes';
import validate from '../middlewares/validator';
import j2s from 'joi-to-swagger';
import * as Helpers from '../helpers';
import * as GitService from '../services/gitService';
import * as QueueService from '../services/queueService';
import * as Consts from '../consts';

const router = Router();

export const swGitRouter = {
  '/api/git/dependency': {
    post: {
      summary: 'Checks the outdated dependencies in the git repo and sends a mail that contains outdated dependencies',
      tags: ['Git'],
      requestBody: {
        content: {
          'application/json': {
            schema: j2s(RequestJoiTypes.postDependencyBody).swagger,
          },
        },
      },
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: j2s(ResponseJoiTypes.defaultResponse).swagger,
            },
          },
        },
      },
    },
  },
};

router.post(
  '/dependency',
  validate({ body: RequestJoiTypes.postDependencyBody }),
  async (req: Request, res: Response) => {
    try {
      const body = req.body as RequestTypes.postDependencyBody;

      const metadata = {
        repository: body.repository,
        sendTo: body.sendTo,
        provider: body.provider,
      };

      await GitService.checkDependencies({ ...metadata });

      await QueueService.addProcess({
        metadata: { ...metadata, waitFor: Consts.CONTROL_PERIOD_IN_MS },
      });

      Helpers.response(res, {
        message: 'Outdated dependencies report will be sent every 24 hours.',
      });
    } catch (err) {
      Helpers.error(res, err);
    }
  },
);

export default router;
