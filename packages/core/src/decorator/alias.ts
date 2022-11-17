import { IPropOptions, Prop } from './prop';
import {
  Nullable,
  Enum,
  Const,
  Maximum,
  Minimum,
  ExclusiveMaximum,
  ExclusiveMinimum,
  MultipleOf,
  MaxLength,
  MinLength,
  Pattern,
  Format,
  MaxItems,
  MinItems,
  Trim,
  TrimStart,
  TrimEnd,
  ToLowerCase,
  ToUpperCase,
  ArrayItem,
  ArrayTuple,
} from './attribute';
import { Arg, IArgOptions } from './arg';
import { ArrayItems, ArrayItem as ArrayItemType } from '../model/common';

export type PropDecorator<T> = (options: T) => (target: any, propertyKey: string) => void;
export const PropAlias = <T>(Decorator: PropDecorator<T>, attr: T, options?: IPropOptions) => {
  const prop = Prop(options);
  const decorator = Decorator(attr);
  return (target: any, propertyKey: string) => {
    prop(target, propertyKey);
    decorator(target, propertyKey);
  };
};

export type NullablePropOptions = IPropOptions;
export const NullableProp = (options?: NullablePropOptions) => PropAlias(Nullable, void 0, options);

export type EnumPropOptions<T extends Array<any>> = IPropOptions & { values: T };
export const EnumProp = <T extends Array<any>> ({ values, ...options }: EnumPropOptions<T>) => PropAlias<T>(Enum, values, options);

export type ArrayItemPropOptions = IPropOptions & { items: ArrayItems };
export const ArrayItemProp = ({ items, ...options }: ArrayItemPropOptions) => PropAlias<ArrayItems>(ArrayItem, items, options);

export type ArrayTuplePropOptions = IPropOptions & { items: ArrayItemType[] };
export const ArrayTupleProp = ({ items, ...options }: ArrayTuplePropOptions) => PropAlias<ArrayItemType[]>(ArrayTuple, items, options);

export type ConstPropOptions<T> = IPropOptions & { value: T };
export const ConstProp = <T> ({ value, ...options }: ConstPropOptions<T>) => PropAlias(Const, value, options);

export type MaximumPropOptions = IPropOptions & { maximum: number };
export const MaximumProp = ({ maximum, ...options }: MaximumPropOptions) => PropAlias(Maximum, maximum, options);

export type MinimumPropOptions = IPropOptions & { minimum: number };
export const MinimumProp = ({ minimum, ...options }: MinimumPropOptions) => PropAlias(Minimum, minimum, options);

export type ExclusiveMaximumPropOptions = IPropOptions & { exclusiveMaximum: number };
export const ExclusiveMaximumProp = ({ exclusiveMaximum, ...options }: ExclusiveMaximumPropOptions) => PropAlias(ExclusiveMaximum, exclusiveMaximum, options);

export type ExclusiveMinimumPropOptions = IPropOptions & { exclusiveMinimum: number };
export const ExclusiveMinimumProp = ({ exclusiveMinimum, ...options }: ExclusiveMinimumPropOptions) => PropAlias(ExclusiveMinimum, exclusiveMinimum, options);

export type MultipleOfPropOptions = IPropOptions & { multipleOf: number };
export const MultipleOfProp = ({ multipleOf, ...options }: MultipleOfPropOptions) => PropAlias(MultipleOf, multipleOf, options);

export type MaxLengthPropOptions = IPropOptions & { maxLength: number };
export const MaxLengthProp = ({ maxLength, ...options }: MaxLengthPropOptions) => PropAlias(MaxLength, maxLength, options);

export type MinLengthPropOptions = IPropOptions & { minLength: number };
export const MinLengthProp = ({ minLength, ...options }: MinLengthPropOptions) => PropAlias(MinLength, minLength, options);

export type PatternPropOptions = IPropOptions & { pattern: string };
export const PatternProp = ({ pattern, ...options }: PatternPropOptions) => PropAlias(Pattern, pattern, options);

export type FormatPropOptions = IPropOptions & { format: string };
export const FormatProp = ({ format, ...options }: FormatPropOptions) => PropAlias(Format, format, options);

export type MaxItemsPropOptions = IPropOptions & { maxItems: number };
export const MaxItemsProp = ({ maxItems, ...options }: MaxItemsPropOptions) => PropAlias(MaxItems, maxItems, options);

export type MinItemsPropOptions = IPropOptions & { minItems: number };
export const MinItemsProp = ({ minItems, ...options }: MinItemsPropOptions) => PropAlias(MinItems, minItems, options);

export type TrimPropOptions = IPropOptions;
export const TrimProp = (options?: TrimPropOptions) => PropAlias(Trim, void 0, options);

export type TrimStartPropOptions = IPropOptions;
export const TrimStartProp = (options?: TrimStartPropOptions) => PropAlias(TrimStart, void 0, options);

export type TrimEndPropOptions = IPropOptions;
export const TrimEndProp = (options?: TrimEndPropOptions) => PropAlias(TrimEnd, void 0, options);

export type ToLowerCasePropOptions = IPropOptions;
export const ToLowerCaseProp = (options?: ToLowerCasePropOptions) => PropAlias(ToLowerCase, void 0, options);

export type ToUpperCasePropOptions = IPropOptions;
export const ToUpperCaseProp = (options?: ToUpperCasePropOptions) => PropAlias(ToUpperCase, void 0, options);

export type ArgDecorator<T> = (options: T) => (target: any, propertyKey: string, parameterIndex: number) => void;
export const ArgAlias = <T>(Decorator: ArgDecorator<T>, attr: T, options?: IArgOptions) => {
  const arg = Arg(options);
  const decorator = Decorator(attr);
  return (target: any, propertyKey: string, parameterIndex: number) => {
    arg(target, propertyKey, parameterIndex);
    decorator(target, propertyKey, parameterIndex);
  };
};

export type NullableArgOptions = IArgOptions;
export const NullableArg = (options?: NullableArgOptions) => ArgAlias(Nullable, void 0, options);

export type EnumArgOptions<T extends Array<any>> = IArgOptions & { values: T };
export const EnumArg = <T extends Array<any>> ({ values, ...options }: EnumArgOptions<T>) => ArgAlias<T>(Enum, values, options);

export type ArrayItemArgOptions = IArgOptions & { items: ArrayItems };
export const ArrayItemArg = ({ items, ...options }: ArrayItemArgOptions) => ArgAlias<ArrayItems>(ArrayItem, items, options);

export type ArrayTupleArgOptions = IArgOptions & { items: ArrayItemType[] };
export const ArrayTupleArg = ({ items, ...options }: ArrayTupleArgOptions) => ArgAlias<ArrayItemType[]>(ArrayTuple, items, options);

export type ConstArgOptions<T> = IArgOptions & { value: T };
export const ConstArg = <T> ({ value, ...options }: ConstArgOptions<T>) => ArgAlias(Const, value, options);

export type MaximumArgOptions = IArgOptions & { maximum: number };
export const MaximumArg = ({ maximum, ...options }: MaximumArgOptions) => ArgAlias(Maximum, maximum, options);

export type MinimumArgOptions = IArgOptions & { minimum: number };
export const MinimumArg = ({ minimum, ...options }: MinimumArgOptions) => ArgAlias(Minimum, minimum, options);

export type ExclusiveMaximumArgOptions = IArgOptions & { exclusiveMaximum: number };
export const ExclusiveMaximumArg = ({ exclusiveMaximum, ...options }: ExclusiveMaximumArgOptions) => ArgAlias(ExclusiveMaximum, exclusiveMaximum, options);

export type ExclusiveMinimumArgOptions = IArgOptions & { exclusiveMinimum: number };
export const ExclusiveMinimumArg = ({ exclusiveMinimum, ...options }: ExclusiveMinimumArgOptions) => ArgAlias(ExclusiveMinimum, exclusiveMinimum, options);

export type MultipleOfArgOptions = IArgOptions & { multipleOf: number };
export const MultipleOfArg = ({ multipleOf, ...options }: MultipleOfArgOptions) => ArgAlias(MultipleOf, multipleOf, options);

export type MaxLengthArgOptions = IArgOptions & { maxLength: number };
export const MaxLengthArg = ({ maxLength, ...options }: MaxLengthArgOptions) => ArgAlias(MaxLength, maxLength, options);

export type MinLengthArgOptions = IArgOptions & { minLength: number };
export const MinLengthArg = ({ minLength, ...options }: MinLengthArgOptions) => ArgAlias(MinLength, minLength, options);

export type PatternArgOptions = IArgOptions & { pattern: string };
export const PatternArg = ({ pattern, ...options }: PatternArgOptions) => ArgAlias(Pattern, pattern, options);

export type FormatArgOptions = IArgOptions & { format: string };
export const FormatArg = ({ format, ...options }: FormatArgOptions) => ArgAlias(Format, format, options);

export type MaxItemsArgOptions = IArgOptions & { maxItems: number };
export const MaxItemsArg = ({ maxItems, ...options }: MaxItemsArgOptions) => ArgAlias(MaxItems, maxItems, options);

export type MinItemsArgOptions = IArgOptions & { minItems: number };
export const MinItemsArg = ({ minItems, ...options }: MinItemsArgOptions) => ArgAlias(MinItems, minItems, options);

export type TrimArgOptions = IArgOptions;
export const TrimArg = (options?: TrimArgOptions) => ArgAlias(Trim, void 0, options);

export type TrimStartArgOptions = IArgOptions;
export const TrimStartArg = (options?: TrimStartArgOptions) => ArgAlias(TrimStart, void 0, options);

export type TrimEndArgOptions = IArgOptions;
export const TrimEndArg = (options?: TrimEndArgOptions) => ArgAlias(TrimEnd, void 0, options);

export type ToLowerCaseArgOptions = IArgOptions;
export const ToLowerCaseArg = (options?: ToLowerCaseArgOptions) => ArgAlias(ToLowerCase, void 0, options);

export type ToUpperCaseArgOptions = IArgOptions;
export const ToUpperCaseArg = (options?: ToUpperCaseArgOptions) => ArgAlias(ToUpperCase, void 0, options);
