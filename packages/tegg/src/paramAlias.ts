import {
  HTTPBody,
  HTTPQueriesParams,
  HTTPQueries,
  HTTPQueryParams,
  HTTPQuery,
  HTTPParamParams,
  HTTPParam,
} from '@eggjs/tegg';
import { IArgOptions, ArgAlias } from '@marmot/node-validate';

export type HTTPBodyArgParams = IArgOptions;
export const HTTPBodyArg = (options?: HTTPBodyArgParams) => ArgAlias(HTTPBody, void 0, options);

export type HTTPQueriesArgParams = HTTPQueriesParams & IArgOptions;
export const HTTPQueriesArg = ({ name, type, ...options }: HTTPQueriesArgParams) => {
  ArgAlias(HTTPQueries, { ...options, name }, { name, type });
};

export type HTTPQueryArgParams = HTTPQueryParams & IArgOptions;
export const HTTPQueryArg = ({ name, type, ...options }: HTTPQueryArgParams) => {
  ArgAlias(HTTPQuery, { name, ...options }, { name, type });
};

export type HTTPParamArgParams = HTTPParamParams & IArgOptions;
export const HTTPParamArg = ({ name, type, ...options }: HTTPParamArgParams) => {
  ArgAlias(HTTPParam, { name, ...options }, { name, type });
};
