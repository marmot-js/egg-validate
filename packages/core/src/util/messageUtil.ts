import { ErrorObject } from 'ajv';
import { IValidateError } from '../model/common';

export class MessageUtil {
  static convertErrors(list?: ErrorObject[] | null) {
    if (!list) {
      return [];
    }
    return list.map(e => this.convertError(e));
  }

  private static convertError(e: ErrorObject) {
    switch (e.keyword) {
      case 'required':
        return this.required(e);
      case 'enum':
        return this.error(e, `must be one of ${(e.params.allowedValues || []).join(',')}`);
      case 'maxLength':
        return this.error(e, `must have fewer than ${e.params.limit} characters`);
      case 'minLength':
        return this.error(e, `must have more than ${e.params.limit} characters`);
      case 'const':
        return this.error(e, `must be equal to ${e.params.allowedValue}`);
      case 'maximum':
        return this.error(e, `must be less than or equal to ${e.params.allowedValue}`);
      case 'minimum':
        return this.error(e, `must be greater than or equal to ${e.params.allowedValue}`);
      case 'exclusiveMaximum':
        return this.error(e, `must be less than ${e.params.allowedValue}`);
      case 'exclusiveMinimum':
        return this.error(e, `must be greater than ${e.params.allowedValue}`);
      case 'pattern':
        return this.error(e, 'does not match pattern');
      case 'maxItems':
        return this.error(e, `must have fewer than ${e.params.limit} items`);
      case 'minItems':
        return this.error(e, `must have more than ${e.params.limit} items`);
      default:
        return this.error(e);
    }
  }

  private static required(e: ErrorObject): IValidateError {
    const prefix = this.getFieldPath(e.instancePath);
    const key = e.params.missingProperty;
    const field = prefix ? `${prefix}.${key}` : key;
    return { field, message: 'required' };
  }

  private static error(e: ErrorObject, message?: string): IValidateError {
    return {
      field: this.getFieldPath(e.instancePath),
      message: message || e.message,
    };
  }

  private static getFieldPath(path: string) {
    return path?.slice(1).replace(/\//g, '.') || '';
  }
}
