import { HTTPMethod, HTTPMethodParams } from '@eggjs/tegg';
import { Validate, IValidateOptions } from '@marmot/node-validate';

export type ValidateHTTPMethodParams = HTTPMethodParams & IValidateOptions;
export const ValidateHTTPMethod = ({ onError, ...options }: ValidateHTTPMethodParams) => {
  const httpMethod = HTTPMethod(options);
  const validate = Validate({ onError });
  return (target: any, propertyKey: string, descriptor: any) => {
    httpMethod(target, propertyKey);
    validate(target, propertyKey, descriptor);
  };
};
