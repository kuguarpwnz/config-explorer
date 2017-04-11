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
        utils.escapeJSON(state)
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
    const [openBrace, closeBrace] = this._getBraces(object);
    const keys = Object.keys(object);
    const valuesCount = keys.length;

    target.appendChild(document.createTextNode(openBrace));

    if (valuesCount) {
      const node = document.createElement('span');
      node.className = this._getClass('collapsible');
      target.appendChild(node);

      keys.forEach((key, i) => {
        const value = object[key];
        node.appendChild(document.createTextNode('\n'));
        node.appendChild(this._withClass(this._spaces(depth), 'space'));

        if (!utils.isArray(object)) {
          const keyClassNames = ['key'].concat(Object.keys(value).length ? ['opened', 'collapsible'] : []);
          const nodeKey = this._withClass(key, ...keyClassNames);
          nodeKey.onclick = utils.isFunction(this._onNodeClick) ? this._onNodeClick : null;
          node.appendChild(nodeKey);
          node.appendChild(document.createTextNode(': '));
        }

        this._generate(node, value, depth + 1);
        node.appendChild(document.createTextNode(valuesCount - 1 === i ? '' : ','));

      });

      node.appendChild(document.createTextNode('\n'));
      node.appendChild(this._withClass(this._spaces(depth - 1), 'space'));
    }

    target.appendChild(document.createTextNode(closeBrace));

    return target;
  }

  onNodeClick(fn) {
    this._onNodeClick = fn;
    return this;
  }

  _getBraces(object) {
    return utils.isArray(object) ? '[]' : '{}';
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