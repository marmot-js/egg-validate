import { SchemaUtil } from '../util/schemaUtil';
import { Support } from '../util/support';
import { ISchema, SchemaAttribute } from '../model/ajv';
import { ArrayItems, ArrayItem as ArrayItemType } from '../model/common';

const getSchemaInfo = (target: any, propertyKey: string, parameterIndex?: number) => {
  if (parameterIndex === undefined) {
    const schema = SchemaUtil.getOrInitObjectSchema(target.constructor);
    const key = propertyKey;
    if (!schema?.properties?.[key]) {
      throw new Error(`Please decorate property ${propertyKey} with Prop`);
    }
    return { schema, key };
  }
  const schema = SchemaUtil.getOrInitMethodSchema(target.constructor, propertyKey);
  const key = SchemaUtil.getOrInitMethodArgumentName(target.constructor, propertyKey).get(parameterIndex)!;
  if (!schema?.properties?.[key]) {
    throw new Error(`Please decorate argument ${key} with Arg`);
  }
  return { schema, key };
};

export const Nullable = () => {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    const { schema, key } = getSchemaInfo(target, propertyKey, parameterIndex);
    schema.properties![key].nullable = true;
    const index = schema.required!.indexOf(key);
    if (index > -1) {
      schema.required!.splice(index, 1);
    }
  };
};

export const Enum = <T extends Array<any>> (values: T) => {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    const { schema, key } = getSchemaInfo(target, propertyKey, parameterIndex);
    schema.properties![key].enum = values;
  };
};

export const ArrayItem = (items: ArrayItems) => {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    const { schema, key } = getSchemaInfo(target, propertyKey, parameterIndex);
    if (!Support.arrayItem(schema.properties![key].type)) {
      const keyPath = parameterIndex === undefined
        ? `${target.constructor.name}#${key}`
        : `${target.constructor.name}#${propertyKey}#${key}`;
      console.warn(`[ArrayItem] ${keyPath} not supported`);
      return;
    }
    const itemSchema = SchemaUtil.getArrayItemSchema(items);
    if (Array.isArray(itemSchema)) {
      schema.properties![key].items = { anyOf: itemSchema } as ISchema;
    } else {
      schema.properties![key].items = itemSchema;
    }
  };
};

export const ArrayTuple = (items: ArrayItemType[]) => {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    const { schema, key } = getSchemaInfo(target, propertyKey, parameterIndex);
    if (!Support.arrayTuple(schema.properties![key].type)) {
      const keyPath = parameterIndex === undefined
        ? `${target.constructor.name}#${key}`
        : `${target.constructor.name}#${propertyKey}#${key}`;
      console.warn(`[ArrayTuple] ${keyPath} not supported`);
      return;
    }
    const itemSchema = SchemaUtil.getArrayItemSchema(items) as ISchema[];
    schema.properties![key].items = itemSchema;
    schema.properties![key].minItems = itemSchema.length;
    schema.properties![key].maxItems = itemSchema.length;
  };
};

export const createAttributeDecorator = <T = number> (attribute: SchemaAttribute) => (value: T) => {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    const { schema, key } = getSchemaInfo(target, propertyKey, parameterIndex);
    if (!Support[attribute](schema.properties![key].type)) {
      const keyPath = parameterIndex === undefined
        ? `${target.constructor.name}#${key}`
        : `${target.constructor.name}#${propertyKey}#${key}`;
      console.warn(`[${attribute}] ${keyPath} not supported`);
      return;
    }
    schema.properties![key][attribute] = value;
  };
};

export const createTransformDecorator = (op: 'trim' | 'trimStart' | 'trimEnd' | 'toLowerCase' | 'toUpperCase') => () => {
  return (target: any, propertyKey: string, parameterIndex?: number) => {
    const { schema, key } = getSchemaInfo(target, propertyKey, parameterIndex);
    if (!Support.transform(schema.properties![key].type)) {
      const keyPath = parameterIndex === undefined
        ? `${target.constructor.name}#${key}`
        : `${target.constructor.name}#${propertyKey}#${key}`;
      console.warn(`[${op}] ${keyPath} not supported`);
      return;
    }
    if (!schema.properties![key].transform) {
      schema.properties![key].transform = [];
    }
    schema.properties![key].transform!.push(op);
  };
};

export const Const = <T> (value: T) => createAttributeDecorator<T>('const')(value);
export const Maximum = createAttributeDecorator('maximum');
export const Minimum = createAttributeDecorator('minimum');
export const ExclusiveMaximum = createAttributeDecorator('exclusiveMaximum');
export const ExclusiveMinimum = createAttributeDecorator('exclusiveMinimum');
export const MultipleOf = createAttributeDecorator('multipleOf');
export const MaxLength = createAttributeDecorator('maxLength');
export const MinLength = createAttributeDecorator('minLength');
export const Pattern = createAttributeDecorator<string>('pattern');
export const Format = createAttributeDecorator<string>('format');
export const MaxItems = createAttributeDecorator('maxItems');
export const MinItems = createAttributeDecorator('minItems');
export const Trim = createTransformDecorator('trim');
export const TrimStart = createTransformDecorator('trimStart');
export const TrimEnd = createTransformDecorator('trimEnd');
export const ToLowerCase = createTransformDecorator('toLowerCase');
export const ToUpperCase = createTransformDecorator('toUpperCase');
