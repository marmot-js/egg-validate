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
export const HTTPQueriesArg = ({ name, ...options }: HTTPQueriesArgParams = {}) => {
  return ArgAlias(HTTPQueries, { name }, { name, ...options });
};

export type HTTPQueryArgParams = HTTPQueryParams & IArgOptions;
export const HTTPQueryArg = ({ name, ...options }: HTTPQueryArgParams = {}) => {
  return ArgAlias(HTTPQuery, { name }, { name, ...options });
};

export type HTTPParamArgParams = HTTPParamParams & IArgOptions;
export const HTTPParamArg = ({ name, ...options }: HTTPParamArgParams = {}) => {
  return ArgAlias(HTTPParam, { name }, { name, ...options });
};
