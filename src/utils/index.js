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
  const hasNotClass = result.length === classes.length;
  hasNotClass && result.push(toggleClass);
  element.className = result.join(' ');
  return hasNotClass;
};

export const hasClass = (element, search) => ~element.className.split(' ').indexOf(search);

export const removeChildrenClass = (element, className) => {
  const sibling = element.nextElementSibling;
  if (sibling && hasClass(sibling, className)) {
    removeChildrenClass(sibling, className);
  }

  if (element.hasChildNodes()) {
    element.childNodes.forEach((node) => node.nodeType === 1 && removeChildrenClass(node, className));
  }

  hasClass(element, className) && toggleClass(element, className);
};