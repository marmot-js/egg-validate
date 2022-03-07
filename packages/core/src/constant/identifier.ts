export class Identifier {
  static ObjectSchema = Symbol.for('validation#schema#object');
  static MethodSchema = Symbol.for('validation#schema#method');
  static MethodArgument = Symbol.for('validation#schema#method#argument');
  static ObjectSchemaValidate = Symbol.for('validation#schema#object#validate');
  static MethodSchemaValidate = Symbol.for('validation#schema#method#validate');
}
