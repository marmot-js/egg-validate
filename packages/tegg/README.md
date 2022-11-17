# @marmot/tegg-validate

基于 [ajv](https://github.com/ajv-validator/ajv) 的装饰器版 tegg 校验工具。

## 安装

```bash
npm i --save @marmot/tegg-validate
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

基于 [@eggjs/tsconfig](https://github.com/eggjs/tsconfig)，开启提交元信息即可。

```json
// tsconfig.json
{
  "extends": "@eggjs/tsconfig",
  "compilerOptions": {
    "emitDecoratorMetadata": true
  }
}
```

## 使用

### 定义模型

对于复杂的对象参数，使用 class 定义参数对象类型，并使用 Schema 及 Prop 等等装饰器标注每个参数属性的校验规则。更详细的 Prop 装饰器说明可查看 [Prop 装饰器详细说明](https://github.com/marmot-js/egg-validate/blob/main/packages/core/README.md#prop-装饰器)。

```typescript
import {
  EnumProp,
  Nullable,
  NullableProp,
  Prop,
  Schema,
} from '@marmot/tegg-validate';

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

给 controller 函数添加 ValidateHTTPMethod 装饰器 (Validate 装饰器与 tegg HTTPMethod 装饰器的聚合装饰器)，即可对请求参数进行校验。同时，通过 HTTPBodyArg, HTTPParamArg, HTTPQueryArg 以及 HTTPQueriesArg 装饰器标注需要进行校验的参数类型。

更详细的 Arg 装饰器说明可查看 [Arg 装饰器详细说明](https://github.com/marmot-js/egg-validate/blob/main/packages/core/README.md#arg-装饰器)。

```typescript
import { EggContext, Context } from '@eggjs/tegg';
import {
  Format,
  HTTPBodyArg,
  HTTPParamArg,
  HTTPQueryArg,
  ValidateHTTPMethod,
} from '@marmot/tegg-validate';

export default class DemoController {
  @ValidateHTTPMethod({
    path: '/api/create',
    method: HTTPMethodEnum.POST,
  })
  async createApp(
    @Context() ctx: EggContext,
    // 使用 HTTPBodyArg 装饰器标注该数据为请求 body 且需要校验
    @HTTPBodyArg() req: Req,
  ) {
    // 业务逻辑
    ...
  }

  @ValidateHTTPMethod({
    path: '/api/find-app/:appId',
    method: HTTPMethodEnum.GET,
  })
  async findOne(
    @Context() ctx: EggContext,
    // 使用 HTTPParamArg 装饰器标注该数据为 param 且需要校验
    // 同时使用 Format 装饰器标注 appId 需要为 uuid 格式
    @Format('uuid')
    @HTTPParamArg() appId: string,
    // 使用 HTTPParamArg 装饰器标注该数据为 query 且需要校验
    // 同时使用 Nullable 装饰器标注 filter 可为空
    @Nullable()
    @HTTPQueryArg() filter?: string,
  ) {
    // 业务逻辑
    ...
  }
}
```

当请求参数校验失败时，将抛出异常，业务代码中可以通过 egg 中间件来对该异常进行自定义处理。
