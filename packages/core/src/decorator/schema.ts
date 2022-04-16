import { MetadataClass, MetadataUtil } from '../util/metadata/metadataUtil';
import { Identifier } from '../constant/identifier';
import { AjvInstance } from '../dependency/ajv';
import { SchemaUtil } from '../util/schemaUtil';

export const Schema = () => {
  return (clazz: MetadataClass) => {
    const schema = SchemaUtil.getObjectSchema(clazz);
    if (!schema) {
      console.warn(`[egg-validate] no schema found for ${clazz.name}`);
      return;
    }
    try {
      const validate = AjvInstance.get().compile(schema);
      MetadataUtil.defineMetadata(Identifier.ObjectSchemaValidate, validate, clazz);
    } catch (e) {
      console.warn(`[egg-validate] failed to compile validation schema for ${clazz.name}`, e);
    }
  };
};
