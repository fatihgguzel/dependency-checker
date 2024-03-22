import * as joi from 'joi';
import * as genericJoi from './joiGeneric';
import { Errors } from '../../types/Errors';

const defaultResponseTemplate = {
  data: genericJoi.objNullable(),
  message: joi
    .string()
    .valid('', ...Object.values(Errors))
    .label('string | Errors'),
  code: genericJoi.num,
};

export const defaultResponse = genericJoi
  .obj({
    ...defaultResponseTemplate,
  })
  .label('defaultResponse');
