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
    // this.placeholder.innerHTML = `<pre>${this._generate(state)}</pre>`;
    this.placeholder.appendChild(
      this._generate(document.createElement('pre'), state)
    );

    return this;
  }

  _generate(target, value, depth = 1) {
    return this.constructor._isObjectLike(value) ?
      this._generateObjectLike(target, value, depth) :
      this._generatePrimitive(target, value);
  }

  _generateObjectLike(target, object, depth) {
    const [openBrace, closeBrace] = (this.constructor._isArray(object) ? '[]' : '{}').split('');
    const keys = Object.keys(object);
    const { length: keysLength } = keys;
    const spaces = keysLength ? this._spaces(depth - 1) : '';
    const newLine = keysLength ? '\n' : '';
    const isArray = this.constructor._isArray(object);

    target.appendChild(document.createTextNode(openBrace));
    target.appendChild(document.createTextNode(newLine));

    keys.forEach((objectKey, i) => {
      const indent = i ? '\n' : '';
      const key = isArray ? '' : `${this._withClass('key', objectKey)}: `;
      const spaces = this._spaces(depth);
      const comma = keysLength - 1 === i ? '' : ',';


      target.appendChild(document.createTextNode(`${indent}${spaces}`));
      if (key) {
        target.appendChild(this._withClass('key', objectKey));
        target.appendChild(document.createTextNode(': '));
      }
      this._generate(target, object[objectKey], depth + 1);
      target.appendChild(document.createTextNode(comma));
      
    });

    target.appendChild(document.createTextNode(`${newLine}${spaces}${closeBrace}`));

    return target;
  }

  _withClass(className = '', value) {
    // return `<span class="${this._getClass(className)}">${value}</span>`;
    const span = document.createElement('span');
    span.className = this._getClass(className);
    span.innerHTML = value;
    return span;
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

  _generatePrimitive(target, value) {
    target.appendChild(
      this._withClass(
        this.constructor._getPrimitiveClass(value),
        this.constructor._isString(value) ? `"${value}"` : value
      )
    );
    return target;
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