import Ajv from 'ajv/dist/core';
import AjvDefault from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvKeywords from 'ajv-keywords';
import ajvErrors from 'ajv-errors';

export class AjvInstance {
  private static ajv: Ajv = AjvInstance.createInstance();

  public static set(custom: Ajv) {
    this.ajv = custom;
  }

  public static get() {
    return this.ajv;
  }

  private static createInstance() {
    const ajv = new AjvDefault({ allErrors: true, allowUnionTypes: true, useDefaults: true });
    ajvFormats(ajv);
    ajvKeywords(ajv, 'transform');
    ajvErrors(ajv);
    return ajv;
  }
}
