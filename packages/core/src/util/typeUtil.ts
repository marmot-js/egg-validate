import { Identifier } from '../constant/identifier';
import { MetadataClass, MetadataUtil } from './metadata/metadataUtil';
import { SchemaType } from '../model/ajv';

export class TypeUtil {
  static from(type: any) {
    switch (type) {
      case String:
        return 'string';
      case Boolean:
        return 'boolean';
      case Number:
        return 'number';
      case Array:
        return 'array';
      default:
        return this.getSchemaType(type);
    }
  }

  static isNumber(type?: SchemaType | SchemaType[]) {
    return this.is('number', type);
  }

  static isString(type?: SchemaType | SchemaType[]) {
    return this.is('string', type);
  }

  static isArray(type?: SchemaType | SchemaType[]) {
    return this.is('array', type);
  }

  private static is(name: string, type?: SchemaType | SchemaType[]) {
    if (Array.isArray(type)) {
      return type.includes(name);
    }
    return type === name;
  }

  private static getSchemaType(clazz?: MetadataClass) {
    if (clazz && MetadataUtil.hasMetadata(Identifier.ObjectSchema, clazz)) {
      return clazz;
    }
    return undefined;
  }
}
