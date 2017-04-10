export default class Formatter {
  constructor(placeholder, state = {}, spaces = 2) {
    this.placeholder = placeholder;
    this.state = state;
    this.spaces = spaces;
  }

  format() {
    this.placeholder.innerHTML = `<pre>${this.constructor._generate(this.state)}</pre>`;
  }

  static _generate(value, depth = 1) {
    return this._isObjectLike(value) ?
      this._generateObjectLike(value, depth) :
      this._generatePrimitive(value);
  }

  static _generateObjectLike(objectValue, depth) {
    return this._withBraces(
      objectValue,
      Object.keys(objectValue).reduce((result, objectKey, i) => {
        const indent = i ? '\n' : '';
        const key = this._isArray(objectValue) ? '' : `${objectKey}: `;
        const value = this._generate(objectValue[objectKey], depth + 1);
        const spaces = this._spaces(depth);
        const comma = Object.keys(objectValue).length - 1 === i ? '' : ',';
        
        return result = `${result}${indent}${spaces}${key}${value}${comma}`;
      }, ''),
      depth - 1
    );
  }

  static _spaces(value = 0) {
    value *= 2;
    let result = "";
    for (let i = 0; i < value; ++i) {
      result = `${result} `;
    }
    return result;
  }

  static _generatePrimitive(value) {
    return this._isString(value) ? `"${value}"` : `${value}`;
  }

  static _withBraces(initialValue, formatted, depth) {
    return Array.isArray(initialValue) ? `[\n${formatted}\n${this._spaces(depth)}]` : `{\n${formatted}\n${this._spaces(depth)}}`;
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

  static _isObject(value) {
    return this._isObjectLike(value) && !this._isArray(value);
  }

  set state(value) {
    this._state = JSON.parse(JSON.stringify(value));
  }

  get state() {
    return this._state;
  }
}