export type SchemaType = 'number' | 'integer' | 'string' | 'boolean' | 'array' | 'object' | 'null' | string;

export interface ISchema {
  type: SchemaType | SchemaType[];
  default?: any;
  properties?: Record<string, Partial<ISchema>>;
  items?: ISchema | ISchema[];
  nullable?: boolean;
  required?: string[];
  enum?: any[];
  const?: any;
  maximum?: number;
  minimum?: number;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  multipleOf?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  format?: string;
  maxItems?: number;
  minItems?: number;
  oneOf?: ISchema[];
  anyOf?: ISchema[];
  transform?: Array<'trim' | 'trimStart' | 'trimEnd' | 'toLowerCase' | 'toUpperCase'>;
  errorMessage?: {
    properties: Record<string, string>;
  };
}

export type SchemaAttribute =
  'const' |
  'maximum' |
  'minimum' |
  'exclusiveMaximum' |
  'exclusiveMinimum' |
  'multipleOf' |
  'maxLength' |
  'minLength' |
  'pattern' |
  'format' |
  'maxItems' |
  'minItems';
