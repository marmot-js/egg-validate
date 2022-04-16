export class ObjectUtil {
  static getMethodArgNameList(func: Function): string[] {
    if (func.length === 0) {
      return [];
    }
    let sourcecode = func.toString();
    sourcecode = sourcecode
      // Remove /* ... */
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove //
      .replace(/\/\/(.)*/g, '')
      // Remove { ... }
      .replace(/{[\s\S]*}/, '')
      // Remove =>
      .replace(/=>/g, '')
      .trim();
    let argsString = sourcecode.substring(sourcecode.indexOf('(') + 1, sourcecode.length - 1);
    // Remove =(...,...)
    argsString = argsString.replace(/=\([\s\S]*\)/g, '');
    const args = argsString.split(',');
    const argNames = args.map(arg => {
      // Remove default value
      return arg.replace(/=[\s\S]*/g, '').trim();
    }).filter(arg => arg.length);
    return argNames;
  }

  static getMethodArgName(func: Function, parameterIndex: number): string {
    const argNames = this.getMethodArgNameList(func);
    return argNames[parameterIndex] || `arg${parameterIndex}`;
  }
}
