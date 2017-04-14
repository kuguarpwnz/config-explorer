const _is = (value, type) => typeof value === type;

export const isObjectLike = (value) => value !== null && _is(value, 'object');

export const isArray = (value) => ({}).toString.call(value) === '[object Array]';

export const isString = (value) => _is(value, 'string');

export const isFunction = (value) => _is(value, 'function');

export const isObject = (value) => isObjectLike(value) && !isArray(value);

export const escapeJSON = (value) => JSON.parse(JSON.stringify(value));

export const toggleClass = (element, toggleClass) => {
  const classes = element.className.split(' ');
  const result = classes.filter((value) => value !== toggleClass);
  result.length === classes.length && result.push(toggleClass);
  element.className = result.join(' ');
};

export const hasClass = (element, search) => ~element.className.split(' ').indexOf(search);