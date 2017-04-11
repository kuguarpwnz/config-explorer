export default class {
  constructor(placeholder, indent = 2) {
    this.placeholder = placeholder;
    this.indent = indent;
    this._classNamePrefix = '_config-explorer-';
  }

  static create(...args) {
    return new this(...args);
  }

  format(state) {
    this.placeholder.innerHTML = `<pre>${this._generate(state)}</pre>`;
    return this;
  }

  _generate(value, depth = 1) {
    return this.constructor._isObjectLike(value) ?
      this._generateObjectLike(value, depth) :
      this._generatePrimitive(value);
  }

  _generateObjectLike(object, depth) {
    const [openBrace, closeBrace] = (this.constructor._isArray(object) ? '[]' : '{}').split('');
    const keys = Object.keys(object);
    const { length: keysLength } = keys;
    const spaces = keysLength ? this._spaces(depth - 1) : '';
    const newLine = keysLength ? '\n' : '';
    const isArray = this.constructor._isArray(object);

    const value = keys.reduce((result, objectKey, i) => {
      const indent = i ? '\n' : '';
      const key = isArray ? '' : `${this._withClass('key', objectKey)}: `;
      const jsonValue = this._generate(object[objectKey], depth + 1);
      const spaces = this._spaces(depth);
      const comma = keysLength - 1 === i ? '' : ',';

      return result = `${result}${indent}${spaces}${key}${jsonValue}${comma}`;
    }, '');

    const generated = keysLength ?
      this._withClass(
        'collapsible',
        `${newLine}${value}${newLine}${spaces}`
      ) : '';


    return `${openBrace}${generated}${closeBrace}`;
  }

  _withClass(className = '', value) {
    return `<span class="${this._getClass(className)}">${value}</span>`;
  }

  _getClass(className) {
    return this._classNamePrefix + className;
  }

  _spaces(count = 0) {
    count *= this.indent;
    let result = "";
    for (let i = 0; i < count; ++i) {
      result = `${result} `;
    }
    return result;
  }

  _generatePrimitive(value) {
    return this._withClass(
      this.constructor._getPrimitiveClass(value),
      this.constructor._isString(value) ? `"${value}"` : value
    );
  }

  static _getPrimitiveClass(value) {
    return (typeof value).toLowerCase();
  }

  static _isObjectLike(value) {
    return value !== null && typeof value === 'object';
  }

  static _isArray(value) {
    return {}.toString.call(value) === '[object Array]';
  }

  static _isString(value) {
    return typeof value === 'string';
  }

  _isObject(value) {
    return this._isObjectLike(value) && !this._isArray(value);
  }

  set state(value) {
    this._state = JSON.parse(JSON.stringify(value));
  }

  get state() {
    return this._state;
  }
}