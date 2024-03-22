import { response } from '../index';
import { Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (res: Response, err: any) {
  response(res, {
    message: err.message,
    code: typeof err.code === 'number' ? err.code || 500 : 500,
  });
}
