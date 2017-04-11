import * as utils from '../utils';

export default class {
  constructor(placeholder, indent = 2) {
    this.placeholder = placeholder;
    this.indent = indent;
    this._classNamePrefix = '_c-e-';
  }

  static create(...args) {
    return new this(...args);
  }

  print(state) {
    this.placeholder.appendChild(
      this._generate(
        document.createElement('pre'),
        JSON.parse(JSON.stringify(state))
      )
    );

    return this;
  }

  _generate(target, value, depth = 1) {
    return utils.isObjectLike(value) ?
      this._generateObjectLike(target, value, depth) :
      this._generatePrimitive(target, value);
  }

  _generateObjectLike(target, object, depth) {
    const [openBrace, closeBrace] = utils.isArray(object) ? '[]' : '{}';
    const keys = Object.keys(object);
    const { length: keysLength } = keys;
    const spaces = keysLength ? this._spaces(depth - 1) : '';
    const newLine = keysLength ? '\n' : '';
    const isArray = utils.isArray(object);

    target.appendChild(document.createTextNode(openBrace));

    if (keysLength) {
      const node = document.createElement('span');
      node.className = this._getClass('collapsible');

      target.appendChild(node);
      node.appendChild(document.createTextNode(newLine));

      keys.forEach((objectKey, i) => {
        const indent = i ? '\n' : '';
        const spaces = this._spaces(depth);
        const comma = keysLength - 1 === i ? '' : ',';

        node.appendChild(document.createTextNode(`${indent}${spaces}`));

        if (!isArray) {
          const keyClassNames = ['key', 'opened', ...(utils.isObjectLike(object[objectKey]) ? ['collapsible'] : [])];
          const key = this._withClass(objectKey, ...keyClassNames);
          key.onclick = utils.isFunction(this._onNodeClick) ? this._onNodeClick : null;
          node.appendChild(key);
          node.appendChild(document.createTextNode(': '));
        }

        this._generate(node, object[objectKey], depth + 1);
        node.appendChild(document.createTextNode(comma));

      });

      node.appendChild(document.createTextNode(`${newLine}${spaces}`));
    }
    target.appendChild(document.createTextNode(closeBrace));

    return target;
  }

  onNodeClick(fn) {
    this._onNodeClick = fn;
    return this;
  }

  _withClass(value, ...classNames) {
    const span = document.createElement('span');
    span.className = classNames.map((className) => this._getClass(className)).join(' ');
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
      result = result + (i % this.indent ? ' ' : '|');
    }
    return result;
  }

  _generatePrimitive(target, value) {
    target.appendChild(
      this._withClass(
        utils.isString(value) ? `"${value}"` : value,
        (typeof value).toLowerCase()
      )
    );
    return target;
  }
}