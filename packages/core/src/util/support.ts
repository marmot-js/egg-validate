import { SchemaType } from '../model/ajv';
import { TypeUtil } from './typeUtil';

export class Support {
  static const(_?: SchemaType | SchemaType[]) {
    return true;
  }

  static arrayItem(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isArray(type);
  }

  static arrayTuple(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isArray(type);
  }

  static maximum(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isNumber(type);
  }

  static minimum(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isNumber(type);
  }

  static exclusiveMaximum(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isNumber(type);
  }

  static exclusiveMinimum(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isNumber(type);
  }

  static multipleOf(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isNumber(type);
  }

  static maxLength(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isString(type);
  }

  static minLength(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isString(type);
  }

  static pattern(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isString(type);
  }

  static format(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isString(type);
  }

  static maxItems(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isArray(type);
  }

  static minItems(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isArray(type);
  }

  static transform(type?: SchemaType | SchemaType[]) {
    return TypeUtil.isString(type);
  }
}
