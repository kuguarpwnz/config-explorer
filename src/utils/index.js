const _is = (value, type) => typeof value === type;

export const isObjectLike = (value) => value !== null && _is(value, 'object');

export const isArray = (value) => ({}).toString.call(value) === '[object Array]';

export const isString = (value) => _is(value, 'string');

export const isFunction = (value) => _is(value, 'function');

export const escapeJSON = (value) => JSON.parse(JSON.stringify(value));