import { ValidateFunction } from 'ajv';
import clone from 'lodash.clonedeep';
import { MetadataClass, MetadataUtil } from './metadata/metadataUtil';
import { ISchema } from '../model/ajv';
import { Identifier } from '../constant/identifier';
import { MapUtil } from './mapUtil';
import { ArrayItem, ArrayItems } from '../model/common';

export class SchemaUtil {
  static getObjectSchema(clazz: MetadataClass) {
    return MetadataUtil.getOwnMetadata<ISchema>(Identifier.ObjectSchema, clazz);
  }

  static getOrInitObjectSchema(clazz: MetadataClass) {
    const ownMetaData = MetadataUtil.getOwnMetadata<ISchema>(Identifier.ObjectSchema, clazz);
    if (!ownMetaData) {
      const parentValue = MetadataUtil.getMetadata<ISchema>(Identifier.ObjectSchema, clazz);
      const ownDefaultValue = parentValue ? clone(parentValue) : { type: 'object', properties: {}, required: [] };
      MetadataUtil.defineMetadata(Identifier.ObjectSchema, ownDefaultValue, clazz);
    }
    return MetadataUtil.getOwnMetadata<ISchema>(Identifier.ObjectSchema, clazz)!;
  }

  static getMethodSchema(clazz:  MetadataClass, propertyKey: string) {
    return MetadataUtil.getOwnMetadata<Map<string, ISchema>>(Identifier.MethodSchema, clazz)?.get(propertyKey);
  }

  static getOrInitMethodSchema(clazz:  MetadataClass, propertyKey: string) {
    const schemaMap = MetadataUtil.initOwnMapMetadata<string, ISchema>(Identifier.MethodSchema, clazz, new Map());
    return MapUtil.getOrStore(schemaMap, propertyKey, {
      type: 'object',
      properties: {},
      required: [],
    });
  }

  static getMethodArgumentName(clazz: MetadataClass, propertyKey: string) {
    return MetadataUtil.getOwnMetadata<Map<string, Map<number, string>>>(Identifier.MethodArgument, clazz)?.get(propertyKey);
  }

  static getOrInitMethodArgumentName(clazz: MetadataClass, propertyKey: string) {
    const map = MetadataUtil.initOwnMapMetadata<string, Map<number, string>>(Identifier.MethodArgument, clazz, new Map());
    return MapUtil.getOrStore<string, Map<number, string>>(map, propertyKey, new Map());
  }

  static getObjectSchemaValidate(clazz: MetadataClass) {
    return MetadataUtil.getOwnMetadata<ValidateFunction>(Identifier.ObjectSchemaValidate, clazz);
  }

  static getArrayItemSchema(items: ArrayItems): ISchema | ISchema[] {
    if (Array.isArray(items)) {
      return items.map(item => this.arrayItemSchema(item));
    }
    return this.arrayItemSchema(items);
  }

  private static arrayItemSchema(item: ArrayItem): ISchema {
    switch (typeof item) {
      case 'string':
        return { type: item };
      case 'object':
        return item.items ? { ...item, items: this.arrayItemSchema(item.items) } : item as ISchema;
      default:
        const schema = SchemaUtil.arrayItemSchema(item);
        return schema ?? { type: 'object' };
    }
  }
}
