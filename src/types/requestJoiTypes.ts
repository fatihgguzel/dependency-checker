import { Errors } from './Errors';
import * as ENUMS from './enums';

export interface postDependencyBody {
  repository: string;
  sendTo: string[];
  provider: ENUMS.GitProviders;
}
