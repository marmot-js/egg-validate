import { AjvInstance } from '../dependency/ajv';
import { SchemaUtil } from '../util/schemaUtil';
import { MessageUtil } from '../util/messageUtil';
import { IValidateError } from '../model/common';

export interface IValidateOptions {
  onError?: (error: any) => void;
}

const DEFAULT_ERROR_HANDLER = (errors: IValidateError[]) => {
  const err: any = new Error('Validation Failed');
  err.code = 'invalid_param';
  err.errors = errors;
  throw err;
};

export const Validate = (options?: IValidateOptions) => {
  const handleError = options?.onError || DEFAULT_ERROR_HANDLER;
  return (target: any, propertyKey: string, descriptor: any) => {
    const schema = SchemaUtil.getMethodSchema(target.constructor, propertyKey);
    const argumentMap = SchemaUtil.getMethodArgumentName(target.constructor, propertyKey);
    if (!schema || !argumentMap) {
      console.warn(`[egg-validate] no schema found for ${target.constructor.name}#${propertyKey}`);
      return;
    }
    try {
      const validate = AjvInstance.get().compile(schema);
      const fn = descriptor.value;
      descriptor.value = function(...args: any[]) {
        const value: Record<string, any> = {};
        argumentMap.forEach((name, index) => {
          value[name] = args[index];
        });
        if (!validate(value)) {
          return handleError(MessageUtil.convertErrors(validate.errors));
        }
        return fn.apply(this, args.map((origin, index) => {
          return argumentMap.has(index) ? value[argumentMap.get(index)!] : origin;
        }));
      };
    } catch (e) {
      console.warn(`[egg-validate] failed to compile validation schema for ${target.constructor.name}#${propertyKey}`, e);
    }
  };
};
