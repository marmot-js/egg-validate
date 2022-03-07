import { Context } from 'egg';
import { MetadataClass } from '@marmot/node-validate/dist/util/metadata/metadataUtil';
import { SchemaUtil } from '@marmot/node-validate/dist/util/schemaUtil';
import { MessageUtil } from '@marmot/node-validate/dist/util/messageUtil';

const DEFAULT_DATA_GETTER = (ctx: Context) => ctx.request.body;

export type SchemaClass = MetadataClass;

export const Validate = (clazz: SchemaClass, data: (ctx: Context) => any = DEFAULT_DATA_GETTER) => {
  return (_: any, __: string, descriptor: any) => {
    const fn = descriptor.value!;
    const validate = SchemaUtil.getObjectSchemaValidate(clazz);
    if (!validate) {
      console.warn(`[egg-validate] Can not find validate for ${clazz.name}`);
      return;
    }
    descriptor.value = function(...args: any[]) {
      const { ctx } = this;
      if (!validate(data(ctx))) {
        return ctx.throw(422, 'Validation Failed', {
          code: 'invalid_param',
          errors: MessageUtil.convertErrors(validate.errors),
        });
      }
      return fn.apply(this, args);
    };
  };
};
