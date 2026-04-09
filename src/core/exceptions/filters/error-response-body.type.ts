import { Extension } from '../domain-exceptions';
import { EDomainExceptionCode } from '../domain-exception-codes';

export type TErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: EDomainExceptionCode;
};
