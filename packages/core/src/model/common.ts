import { ISchema, SchemaType } from './ajv';
import { MetadataClass } from '../util/metadata/metadataUtil';

export interface IArrayItemSchema extends Omit<ISchema, 'items'> {
  items?: IArrayItemSchema | SchemaType | MetadataClass;
}

export type ArrayItem = SchemaType | MetadataClass | IArrayItemSchema;
export type ArrayItems = ArrayItem | ArrayItem[];

export interface IValidateError {
  field: string;
  message?: string;
}
