# @marmot/node-validate

基于 [ajv](https://github.com/ajv-validator/ajv) 的装饰器版 node 校验工具。

## 安装

```bash
npm i --save @marmot/node-validate
```

## 准备

tsconfig.json 需要开启装饰器特性及元信息。

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 使用

### 模型定义

对于复杂的对象参数，使用 class 定义参数对象类型，并使用 Schema 及 Prop 等等装饰器标注每个属性的校验规则。

```typescript
import {
  EnumProp,
  Nullable,
  NullableProp,
  Prop,
  Schema,
} from '@marmot/node-validate';

export enum FilterType {
  All = 'ALL',
  Search = 'SEARCH',
}

@Schema()
export class Req {
  // 必填 number 类型参数
  @Prop()
  pageNumber: number;

  // 非必填 number 类型参数
  @NullableProp()
  pageSize?: number;

  // 非必填枚举类型参数
  @Nullable()
  @EnumProp({ values: Object.values(FilterType) })
  type?: FilterType;

  // 默认值为 '' 的 string 类型参数
  @Prop({ default: '' })
  filter: string;

  // 参数类型比较复杂时，无法自动推导类型，需要手动指定参数类型
  @Prop({ type: ['string', 'number'] })
  mixed: string | number;
}
```

### 参数校验

对需要做参数校验的函数，使用 Validate 装饰器对该函数进行标注，并通过 Arg 装饰器标注需要进行校验的函数参数。

```typescript
import { Arg, MaximumArg, Minimumm, Nullable, Validate } from '@marmot/node-validate';

class Runner {
  @Validate()
  async run(
    // 复杂对象参数，Arg 装饰器搭配[模型定义]章节中申明的 Req 类使用
    @Arg() req: Req,
    // 基础类型参数，直接使用 Arg 装饰器
    @Minimum(10) @MaximumArg({ maximum: 100 }) size: number,
    @Nullable() @Arg() type?: string,
    // 直接解构等特殊场景，无法自动获取参数名时，可手动指定参数名，便于排查问题
    @Arg({ name: 'customName' }) { filter }: Req = {},
    // 参数类型比较复杂时，无法自动推导类型，需要手动指定参数类型
    @Arg({ type: ['number', 'string'] }) mixed?: string | number,
    // 未使用 Arg 装饰器标注的参数不会进行校验
    extra?: boolean,
  ) {
    // 函数逻辑
  ...
  }
}

const runner = new Runner();
try {
  runner.run({});
} catch (e) {
  // 参数校验失败时，抛出异常
}
```

## 详细说明

### Prop 装饰器

用于定义复杂对象每个属性的校验规则，与 Schema 装饰器配合使用。

注意：使用 XXXProp 可以看作是同时使用 XXX 装饰器与 Prop 装饰器的 alias。对于需要设置多个条件的函数参数，请务必只使用一次 Prop 装饰器。

```typescript
// 例如长度小于 10 的非必填函数参数，下列用法 1, 用法 2 以及用法 3 等价，用法 4 和用法 5 是错误的。
@Schema()
class DemoSchema {
  // 用法 1
  @Nullable()
  @MaxLength(10)
  @Prop()
  param1?: string;
  // 用法 2
  @MaxLength(10)
  @NullableProp()
  param2?: string;
  // 用法 3
  @Nullable()
  @MaxLengthProp({ maxLength: 10 })
  param3?: string;
  // ❌ 用法 4，错误示例
  @NullableArg()
  @MaxLengthProp({ maxLength: 10 })
  param4?: string;
  // ❌ 用法 5，错误示例
  @Nullable()
  @MaxLengthProp({ maxLength: 10 })
  @Arg()
  param5?: string;
}
```

<table>
<thead>
<tr>
<th>装饰器</th>
<th>说明</th>
<th>装饰器参数类型</th>
<th>示例</th>
</tr>
</thead>

<tbody>
<tr>
<td>Prop</td>
<td>标注属性为必填参数</td>
<td>IPropOptions</td>
<td>

```typescript
@Schema()
class Req {
  // 基础用法
  @Prop()
  param1: number;
  // 其他由 Schema & Prop 标注的 class 类型
  @Prop()
  param2: OtherReq;
  // 指定参数
  @Prop({
    default: true,
    message: 'invalid param3 message',
  })
  param3: boolean;
}
```

</td>
</tr>

<tr>
<td>Nullable, NullableProp</td>
<td>标注属性为非必填参数</td>
<td>无</td>
<td>

```typescript
@Schema()
class Req {
  // 可空
  @NullableProp()
  param1?: number;
  // 空或 'forever'
  @Nullable()
  @ConstProp({ value: 'forever' })
  param2?: string;
}
```

</td>
</tr>

<tr>
<td>Const, ConstProp</td>
<td>

标注属性为[常量参数](https://ajv.js.org/json-schema.html#const)

</td>
<td>any</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且只能为 1
  @ConstProp({ value: 1 })
  param1: number;
  // 只能为 'forever' 或空
  @Const('forever')
  @NullableProp()
  param2: string;
}
```

</td>
</tr>

<tr>
<td>Enum, EnumProp</td>
<td>

标注属性取值范围[常量列表](https://ajv.js.org/json-schema.html#enum)

</td>
<td>any[]</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且取值为 1, '1' 或 true
  @EnumProp({
    type: ['number', 'string', 'boolean'],
    values: [1, '1', true],
  })
  param1: 1 | '1' | true;
  // 取值为空，'one' 或 'two'
  @Enum(['one', 'two'])
  @NullableProp()
  param2: string;
}
```

</td>
</tr>

<tr>
<td>Maximum, MaximumProp</td>
<td>

标注 number 类型属性[最大值（包含最大值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且小于等于 100
  @MaximumProp({ maximum: 100 })
  param1: number;
  // 必填且取值在 80 与 90 之间（包含边界值）
  @Maximum(90)
  @MinimumProp({ minimum: 80 })
  param2: number;
}
```

</td>
</tr>

<tr>
<td>Minimum, MinimumProp</td>
<td>

标注 number 类型属性[最小值（包含最小值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且大于等于 100
  @MinimumProp({ minimum: 100 })
  param1: number;
  // 必填且取值在 80 与 90 之间（包含边界值）
  @Minimum(80)
  @MaximumProp({ maximum: 90 })
  param2: number;
}
```

</td>
</tr>

<tr>
<td>ExclusiveMaximum, ExclusiveMaximumProp</td>
<td>

标注 number 类型属性[最大值（不包含最大值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且小于 100
  @ExclusiveMaximumProp({
    exclusiveMaximum: 100,
  })
  param1: number;
  // 必填且取值在 80 与 90 之间（不包含 90）
  @ExclusiveMaximum(90)
  @MinimumProp({ minimum: 80 })
  param2: number;
}
```

</td>
</tr>

<tr>
<td>ExclusiveMinimum, ExclusiveMinimumProp</td>
<td>

标注 number 类型属性[最小值（不包含最小值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且大于 90
  @ExclusiveMinimumProp({
    exclusiveMinimum: 90,
  })
  param1: number;
  // 必填且取值在 80 与 90 之间（不包含 80）
  @ExclusiveMinimum(80)
  @MaximumProp({ maximum: 90 })
  param2: number;
}
```

</td>
</tr>

<tr>
<td>MultipleOf, MultipleOfProp</td>
<td>

标注 number 类型属性为某个数的[倍数](https://ajv.js.org/json-schema.html#multipleof)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且为 2 的倍数
  @MultipleOfProp({ multipleOf: 2 })
  param1: number;
  // 必填且取值为 90 以内 3 的倍数
  @MultipleOf(3)
  @MaximumProp({ maximum: 90 })
  param2: number;
}
```

</td>
</tr>

<tr>
<td>MaxLength, MaxLengthProp</td>
<td>

标注 string 类型属性的[最大长度](https://ajv.js.org/json-schema.html#maxlength-minlength)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且长度最大为 10
  @MaxLengthProp({ maxLength: 10 })
  param1: string;
  // 必填且长度在 2 到 10 之间
  @MaxLength(10)
  @MinLengthProp({ minLength: 2 })
  param2: string;
}
```

</td>
</tr>

<tr>
<td>MinLength, MinLengthProp</td>
<td>

标注 string 类型属性的[最小长度](https://ajv.js.org/json-schema.html#maxlength-minlength)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且长度最小为 10
  @MinLengthProp({ minLength: 10 })
  param1: string;
  // 必填且长度在 2 到 10 之间
  @MinLength(2)
  @MaxLengthProp({ maxLength: 10 })
  param2: string;
}
```

</td>
</tr>

<tr>
<td>Pattern, PatternProp</td>
<td>

标注 string 类型的[正则规则](https://ajv.js.org/json-schema.html#pattern)

</td>
<td>string</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且包含数字
  @PatternProp({ pattern: '\\d+' })
  param1: string;
  // 必填且长度在 10 以内的数字字符串
  @Pattern('^\\d+$')
  @MaxLengthProp({ maxLength: 10 })
  param2: string;
}
```

</td>
</tr>

<tr>
<td>Format, FormatProp</td>
<td>

标注 string 类型的[预设规则](https://ajv.js.org/json-schema.html#format)

</td>
<td>

参考 [ajv-formats](https://github.com/ajv-validator/ajv-formats#formats)

</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且满足 ipv4 格式
  @FormatProp({ format: 'ipv4' })
  param1: string;
  // 必填且长度在 20 以内的域名
  @Format('hostname')
  @MaxLengthProp({ maxLength: 20 })
  param2: string;
}
```

</td>
</tr>

<tr>
<td>MaxItems, MaxItemsProp</td>
<td>

标注数组类型的[最大元素个数](https://ajv.js.org/json-schema.html#maxitems-minitems)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且最多包含 5 个元素
  @MaxItemsProp({ maxItems: 5 })
  param1: string[];
  // 必填且元素个数在 2 到 5 之间
  @MaxItems(5)
  @MinItemsProp({ minItems: 2 })
  param2: number[];
}
```

</td>
</tr>

<tr>
<td>MinItems, MinItemsProp</td>
<td>

标注数组类型的[最小元素个数](https://ajv.js.org/json-schema.html#maxitems-minitems)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且最少包含 5 个元素
  @MinItemsProp({ minItems: 5 })
  param1: string[];
  // 必填且元素个数在 2 到 5 之间
  @MinItems(2)
  @MaxItemsProp({ maxItems: 5 })
  param2: number[];
}
```

</td>
</tr>

<tr>
<td>ArrayItem, ArrayItemProp</td>
<td>

标注数组类型包含元素的校验类型

</td>
<td>SchemaType, MetadataClass, Array&lt;SchemaType | MetadataClass&gt;</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且数组元素均为字符串
  @ArrayItemProp({ items: 'string' })
  param1: string[];
  // 必填且数组元素均为 OtherSchema 类型
  @ArrayItemProp({ items: OtherSchema })
  param2: OtherSchema[];
  // 非必填且数组元素为 OtherSchema 或字符串类型
  @ArrayItem(['string', OtherSchema])
  @NullableProp()
  param3: Array<string | OtherSchema>;
}
```

</td>
</tr>

<tr>
<td>ArrayTuple, ArrayTupleProp</td>
<td>

标注元组类型包含元素的校验类型

</td>
<td>Array&lt;SchemaType, MetadataClass, Array&lt;SchemaType | MetadataClass&gt;&gt;</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且为 [字符串，数组] 格式二元组
  @ArrayTupleProp({ items: ['string', 'number'] })
  param1: string[];
  // 非必填且为 [数组，字符串，OtherSchema] 格式三元组
  @ArrayTuple(['number', 'string', OtherSchema])
  @NullableProp()
  param2: OtherSchema[];
}
```

</td>
</tr>

<tr>
<td>Trim, TrimProp</td>
<td>移除 string 类型属性前后的空白字符</td>
<td>无</td>
<td>

```typescript
@Schema()
class Req {
  // 基础用法
  @TrimProp()
  param1: string;
  // 移除前后的空白字符后，最大长度为 10
  @Trim()
  @MaxLengthProp({ maxLength: 10 })
  param2: string;
}
```

</td>
</tr>

<tr>
<td>TrimStart, TrimStartProp</td>
<td>移除 string 类型属性前面的空白字符</td>
<td>无</td>
<td>

```typescript
@Schema()
class Req {
  // 基础用法
  @TrimStartProp()
  param1: string;
  // 移除前面的空白字符后，最大长度为 10
  @TrimStart()
  @MaxLengthProp({ maxLength: 10 })
  param2: string;
}
```

</td>
</tr>

<tr>
<td>TrimEnd, TrimEndProp</td>
<td>移除 string 类型属性后面的空白字符</td>
<td>无</td>
<td>

```typescript
@Schema()
class Req {
  // 基础用法
  @TrimEndProp()
  param1: string;
  // 移除后面的空白字符后，最大长度为 10
  @TrimEnd()
  @MaxLengthProp({ maxLength: 10 })
  param2: string;
}
```

</td>
</tr>

<tr>
<td>ToLowerCase, ToLowerCaseProp</td>
<td>将 string 类型属性转换为小写字母</td>
<td>无</td>
<td>

```typescript
@Schema()
class Req {
  @ToLowerCaseProp()
  param1: string;

  @ToLowerCase()
  @MaxLengthProp({ maxLength: 10 })
  param2: string;
}
```

</td>

<tr>
<td>ToUpperCase, ToUpperCaseProp</td>
<td>将 string 类型属性转换为大写字母</td>
<td>无</td>
<td>

```typescript
@Schema()
class Req {
  @ToUpperCaseProp()
  param1: string;

  @ToUpperCase()
  @MaxLengthProp({ maxLength: 10 })
  param2: string;
}
```

</td>
</tr>
</tbody>
</table>

### Arg 装饰器

用于标注需要进行参数校验的函数参数，与 Validate 装饰器配合使用。

注意：使用 XXXArg 可以看作是同时使用 XXX 装饰器与 Arg 装饰器的 alias。对于需要设置多个条件的函数参数，请务必只使用一次 Arg 装饰器。

```typescript
// 例如长度小于 10 的非必填函数参数，下列用法 1, 用法 2 以及用法 3 等价，用法 4 和用法 5 是错误的。
class Runner {
  @Validate()
  async run(
    // 用法 1
    @Nullable()
    @MaxLength(10)
    @Arg()
      param1?: string,
    // 用法 2
    @MaxLength(10)
    @NullableArg()
      param2?: string,
    // 用法 3
    @Nullable()
    @MaxLengthArg({ maxLength: 10 })
      param3?: string,
    // ❌ 用法 4，错误示例
    @NullableArg()
    @MaxLengthArg({ maxLength: 10 })
      param4?: string,
    // ❌ 用法 5，错误示例
    @Nullable()
    @MaxLengthArg({ maxLength: 10 })
    @Arg()
      param5?: string,
  ) {...
  }
}
```

<table>
<thead>
<tr>
<th>装饰器</th>
<th>说明</th>
<th>装饰器参数类型</th>
<th>示例</th>
</tr>
</thead>

<tbody>
<tr>
<td>Arg</td>
<td>标注函数参数为必填参数</td>
<td>IArgOptions</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 基础用法
    @Arg() param1: number,
    // 其他由 Schema & Prop 标注的 class 类型
    @Arg() param2: OtherReq,
    // 指定参数
    @Arg({
      name: 'customName',
      default: true,
    }) param3: boolean,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Nullable, NullableArg</td>
<td>标注函数参数为非必填</td>
<td>无</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 可空
    @NullableArg() param1?: number,
    // 空或 'forever'
    @Nullable()
    @ConstArg({ value: 'forever' })
      param2?: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Const, ConstArg</td>
<td>

标注函数参数为[常量参数](https://ajv.js.org/json-schema.html#const)

</td>
<td>any</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且只能为 1
    @ConstArg({ value: 1 })
      param1: number,
    // 只能为 'forever' 或空
    @Const('forever')
    @NullableArg()
      param2?: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Enum, EnumArg</td>
<td>

标注函数参数取值范围[常量列表](https://ajv.js.org/json-schema.html#enum)

</td>
<td>any[]</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且取值为 1, '1' 或 true
    @EnumArg({
      type: ['number', 'string', 'boolean'],
      values: [1, '1', true],
    })
      param1: 1 | '1' | true,
    // 取值为空，'one' 或 'two'
    @Enum(['one', 'two'])
    @NullableArg()
      param2?: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Maximum, MaximumArg</td>
<td>

标注 number 类型函数参数[最大值（包含最大值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且小于等于 100
    @MaximumArg({ maximum: 100 })
      param1: number,
    // 必填且取值在 80 与 90 之间（包含边界值）
    @Maximum(90)
    @MinimumArg({ minimum: 80 })
      param2: number,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Minimum, MinimumArg</td>
<td>

标注 number 类型函数参数[最小值（包含最小值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且大于等于 100
    @MinimumArg({ minimum: 100 })
      param1: number,
    // 必填且取值在 80 与 90 之间（包含边界值）
    @Minimum(80)
    @MaximumArg({ maximum: 90 })
      param2: number,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>ExclusiveMaximum, ExclusiveMaximumArg</td>
<td>

标注 number 类型函数参数[最大值（不包含最大值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且小于 100
    @ExclusiveMaximumArg({
      exclusiveMaximum: 100,
    })
      param1: number,
    // 必填且取值在 80 与 90 之间（不包含 90）
    @ExclusiveMaximum(90)
    @MinimumArg({ minimum: 80 })
      param2: number,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>ExclusiveMinimum, ExclusiveMinimumArg</td>
<td>

标注 number 类型函数参数[最小值（不包含最小值）](https://ajv.js.org/json-schema.html#maximum-minimum-and-exclusivemaximum-exclusiveminimum)

</td>
<td>number</td>
<td>

```typescript
@Schema()
class Req {
  // 必填且大于 90
  @ExclusiveMinimumArg({
    exclusiveMinimum: 90,
  })
  param1: number;
  // 必填且取值在 80 与 90 之间（不包含 80）
  @ExclusiveMinimum(80)
  @MaximumArg({ maximum: 90 })
  param2: number;
}
```

</td>
</tr>

<tr>
<td>MultipleOf, MultipleOfArg</td>
<td>

标注 number 类型函数参数为某个数的[倍数](https://ajv.js.org/json-schema.html#multipleof)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且为 2 的倍数
    @MultipleOfArg({ multipleOf: 2 })
      param1: number,
    // 必填且取值为 90 以内 3 的倍数
    @MultipleOf(3)
    @MaximumArg({ maximum: 90 })
      param2: number,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>MaxLength, MaxLengthArg</td>
<td>

标注 string 类型函数参数的[最大长度](https://ajv.js.org/json-schema.html#maxlength-minlength)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且长度最大为 10
    @MaxLengthArg({ maxLength: 10 })
      param1: string,
    // 必填且长度在 2 到 10 之间
    @MaxLength(10)
    @MinLengthArg({ minLength: 2 })
      param2: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>MinLength, MinLengthArg</td>
<td>

标注 string 类型函数参数的[最小长度](https://ajv.js.org/json-schema.html#maxlength-minlength)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且长度最小为 10
    @MinLengthArg({ minLength: 10 })
      param1: string,
    // 必填且长度在 2 到 10 之间
    @MinLength(2)
    @MaxLengthArg({ maxLength: 10 })
      param2: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Pattern, PatternArg</td>
<td>

标注 string 类型函数参数的[正则规则](https://ajv.js.org/json-schema.html#pattern)

</td>
<td>string</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且包含数字
    @PatternArg({ pattern: '\\d+' })
      param1: string,
    // 必填且长度在 10 以内的数字字符串
    @Pattern('^\\d+$')
    @MaxLengthArg({ maxLength: 10 })
      param2: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Format, FormatArg</td>
<td>

标注 string 类型函数参数的[预设规则](https://ajv.js.org/json-schema.html#format)

</td>
<td>

参考 [ajv-formats](https://github.com/ajv-validator/ajv-formats#formats)

</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且满足 ipv4 格式
    @FormatArg({ format: 'ipv4' })
      param1: string,
    // 必填且长度在 20 以内的域名
    @Format('hostname')
    @MaxLengthArg({ maxLength: 20 })
      param2: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>MaxItems, MaxItemsArg</td>
<td>

标注数组类型函数参数的[最大元素个数](https://ajv.js.org/json-schema.html#maxitems-minitems)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且最多包含 5 个元素
    @MaxItemsArg({ maxItems: 5 })
      param1: string[],
    // 必填且元素个数在 2 到 5 之间
    @MaxItems(5)
    @MinItemsArg({ minItems: 2 })
      param2: number[],
  ) {...}
}
```

</td>
</tr>

<tr>
<td>MinItems, MinItemsArg</td>
<td>

标注数组类型函数参数的[最小元素个数](https://ajv.js.org/json-schema.html#maxitems-minitems)

</td>
<td>number</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且最少包含 5 个元素
    @MinItemsArg({ minItems: 5 })
      param1: string[],
    // 必填且元素个数在 2 到 5 之间
    @MinItems(2)
    @MaxItemsArg({ maxItems: 5 })
      param2: number[],
  ) {...}
}
```

</td>
</tr>

<tr>
<td>ArrayItem, ArrayItemArg</td>
<td>

标注数组类型函数参数包含元素的校验类型

</td>
<td>SchemaType, MetadataClass, Array&lt;SchemaType | MetadataClass&gt;</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且数组元素均为字符串
    @ArrayItemArg({ items: 'string' })
      param1: string[],
    // 必填且数组元素均为 OtherSchema 类型
    @ArrayItemArg({ items: OtherSchema })
      param2: OtherSchema[],
    // 非必填且数组元素为 OtherSchema 或字符串类型
    @ArrayItem(['string', OtherSchema])
    @NullableArg()
      param3: Array<string | OtherSchema>,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>ArrayTuple, ArrayTupleArg</td>
<td>

标注元组类型函数参数包含元素的校验类型

</td>
<td>Array&lt;SchemaType, MetadataClass, Array&lt;SchemaType | MetadataClass&gt;&gt;</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 必填且为 [字符串，数组] 格式二元组
    @ArrayTupleArg({ items: ['string', 'number'] })
      param1: string[],
    // 非必填且为 [数组，字符串，OtherSchema] 格式三元组
    @ArrayTuple(['number', 'string', OtherSchema])
    @NullableArg()
      param2: OtherSchema[],
  ) {...}
}
```

</td>
</tr>

<tr>
<td>Trim, TrimArg</td>
<td>移除 string 类型函数参数前后的空白字符</td>
<td>无</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 基础用法
    @TrimArg()
      param1: string,
    // 移除前后的空白字符后，最大长度为 10
    @Trim()
    @MaxLengthArg({ maxLength: 10 })
      param2: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>TrimStart, TrimStartArg</td>
<td>移除 string 类型函数参数前面的空白字符</td>
<td>无</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 基础用法
    @TrimStartArg()
      param1: string,
    // 移除前面的空白字符后，最大长度为 10
    @TrimStart()
    @MaxLengthArg({ maxLength: 10 })
      param2: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>TrimEnd, TrimEndArg</td>
<td>移除 string 类型函数参数后面的空白字符</td>
<td>无</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    // 基础用法
    @TrimEndArg()
      param1: string,
    // 移除后面的空白字符后，最大长度为 10
    @TrimEnd()
    @MaxLengthArg({ maxLength: 10 })
      param2: string,
  ) {...}
}
```

</td>
</tr>

<tr>
<td>ToLowerCase, ToLowerCaseArg</td>
<td>将 string 类型函数参数转换为小写字母</td>
<td>无</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    @ToLowerCaseArg()
      param1: string,

    @ToLowerCase()
    @MaxLengthArg({ maxLength: 10 })
      param2: string,
  ) {...}
}
```

</td>

<tr>
<td>ToUpperCase, ToUpperCaseArg</td>
<td>将 string 类型函数参数转换为大写字母</td>
<td>无</td>
<td>

```typescript
class Runner {
  @Validate()
  async run(
    @ToUpperCaseArg()
      param1: string,

    @ToUpperCase()
    @MaxLengthArg({ maxLength: 10 })
      param2: string,
  ) {...}
}
```

</td>
</tr>
</tbody>
</table>

### Validate 装饰器

标注需要进行参数校验的函数，与 Arg 装饰器配合使用。

#### 参数说明

```typescript
export interface IValidateOptions {
  // 当校验失败时，自定义错误处理逻辑，默认逻辑为直接抛出异常
  onError?: (error: IValidateError[]) => void;
}
```

### 类型说明

#### SchemaType
```typescript
export type SchemaType = 'number' | 'integer' | 'string' | 'boolean' | 'array' | 'object' | 'null' | string;
```

### MetadataClass

由 Schema & Prop 装饰器标注的模型 class

#### IPropOptions

```typescript
interface IPropOptions {
  // 参数类型，基础类型可从定义中自动推导，特殊场景可手动指定类型
  type?: SchemaType | SchemaType[] | MetadataClass;
  // 参数默认值
  default?: any;
  // 指定校验失败时的错误信息
  message?: string;
}
```

#### IArgOptions

```typescript
interface IArgOptions {
  // 参数名，直接解构等特殊场景，无法自动获取参数名时，可手动指定参数名，便于排查问题
  name?: string;
  // 参数类型，基础类型可从定义中自动推导，特殊场景可手动指定类型
  type?: SchemaType | SchemaType[] | MetadataClass;
  // 参数默认值
  default?: any;
}
```

#### IValidateError

```typescript
interface IValidateError {
  // 校验失败字段
  field: string;
  // 校验失败原因
  message?: string;
}
```
