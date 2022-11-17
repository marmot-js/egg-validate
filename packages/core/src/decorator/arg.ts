import { SchemaType } from '../model/ajv';
import { MetadataClass } from '../util/metadata/metadataUtil';
import { ObjectUtil } from '../util/objectUtil';
import { SchemaUtil } from '../util/schemaUtil';
import { TypeUtil } from '../util/typeUtil';

export interface IArgOptions {
  name?: string;
  type?: SchemaType | SchemaType[] | MetadataClass;
  default?: any;
}

export const Arg = (options: IArgOptions = {}) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    let { name, type, default: defaultValue } = options;
    const schema = SchemaUtil.getOrInitMethodSchema(target.constructor, propertyKey);
    if (!name) {
      name = ObjectUtil.getMethodArgName(target[propertyKey], parameterIndex);
    }
    if (!type) {
      // guess type from metadata
      const reflectTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
      type = TypeUtil.from(reflectTypes[parameterIndex]);
      if (!type) {
        throw new Error(`Please specify the type of ${name} in function ${target.constructor.name}#${propertyKey}`);
      }
    }
    SchemaUtil.getOrInitMethodArgumentName(target.constructor, propertyKey).set(parameterIndex, name);
    if (!schema.required!.includes(name)) {
      schema.required!.push(name);
    }
    if (typeof type === 'string' || Array.isArray(type)) {
      schema.properties![name] = { type, default: defaultValue };
      return;
    }
    schema.properties![name] = SchemaUtil.getObjectSchema(type)!;
    if (defaultValue) {
      schema.properties![name].default = defaultValue;
    }
  };
};
