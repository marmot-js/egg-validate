# @marmot/egg-validate

基于 [ajv](https://github.com/ajv-validator/ajv) 的装饰器版 egg 校验工具。

## 安装

```bash
npm i --save @marmot/egg-validate
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
} from '@marmot/egg-validate';

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

给 controller 函数添加 Validate 装饰器，即可对请求参数进行校验。

```typescript
import { Validate } from '@marmot/egg-validate';

export default class DemoController extends Controller {
  // 校验请求 body 是否满足 Req 定义的校验规则
  @Validate(Req)
  async findApp() {
    // 此时，req 一定满足要求
    const req = this.ctx.request.body as Req;
    // 业务逻辑
    ...
  }

  // 对于 get 请求等需要校验非 body 的情况，可使用第二个参数指定从 Context 中获取数据的逻辑
  @Validate(SomeReq, ctx => ctx.query)
  async findOne() {
    // 此时，req 一定满足要求
    const req = this.ctx.query as SomeReq;
    // 业务逻辑
  ...
  }
}
```

当请求参数校验失败时，与 [egg-validate](https://github.com/eggjs/egg-validate) 插件一样，将抛出异常。业务代码中也可以通过 egg 中间件来对该异常进行自定义处理。

```typescript
if (!validate(data(ctx))) {
  return ctx.throw(422, 'Validation Failed', {
    code: 'invalid_param',
    errors: MessageUtil.convertErrors(validate.errors),
  });
}
```
