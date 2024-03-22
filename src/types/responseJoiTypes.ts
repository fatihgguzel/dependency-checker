import { Errors } from './Errors';
import * as ENUMS from './enums';

export interface defaultResponse {
  data: Record<string, never> | null;
  message: string | Errors;
  code: number;
}
