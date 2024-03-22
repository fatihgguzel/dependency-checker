import * as genericJoi from './joiGeneric';
import * as Enums from '../../types/enums';

export const postDependencyBody = genericJoi
  .obj({
    repository: genericJoi.stringTrimmed.required(),
    sendTo: genericJoi.arr(genericJoi.email).required(),
    provider: genericJoi.stringEnum(Enums.GitProviders, 'GitProviders'),
  })
  .required()
  .label('postDependencyBody');
