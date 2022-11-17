import { SchemaType } from '../model/ajv';
import { TypeUtil } from '../util/typeUtil';
import { MetadataClass } from '../util/metadata/metadataUtil';
import { SchemaUtil } from '../util/schemaUtil';

export interface IPropOptions {
  type?: SchemaType | SchemaType[] | MetadataClass;
  default?: any;
  message?: string;
}

export const Prop = (options: IPropOptions = {}) => {
  return (target: any, propertyKey: string) => {
    let { type, default: defaultValue, message } = options;
    const schema = SchemaUtil.getOrInitObjectSchema(target.constructor);
    if (!type) {
      // guess type from metadata
      const reflectType = Reflect.getMetadata('design:type', target, propertyKey);
      type = TypeUtil.from(reflectType);
      if (!type) {
        throw new Error(`Please specify the type of ${propertyKey} in class ${target.constructor.name}`);
      }
    }
    if (message) {
      if (!schema.errorMessage?.properties) {
        schema.errorMessage = { properties: {} };
      }
      schema.errorMessage.properties[propertyKey] = message;
    }
    if (!schema.required!.includes(propertyKey)) {
      schema.required!.push(propertyKey);
    }
    if (typeof type === 'string' || Array.isArray(type)) {
      schema.properties![propertyKey] = { type };
    } else {
      schema.properties![propertyKey] = SchemaUtil.getObjectSchema(type)!;
    }
    if (defaultValue !== undefined) {
      schema.properties![propertyKey].default = defaultValue;
    }
  };
};
