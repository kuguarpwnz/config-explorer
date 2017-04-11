import * as utils from '../utils';

export default class {
  constructor(placeholder, indent = 2) {
    this.placeholder = placeholder;
    this.indent = indent;
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

    target.appendChild(document.createTextNode(openBrace));
    this._generateNode(target, object, depth);
    target.appendChild(document.createTextNode(closeBrace));

    return target;
  }

  onNodeClick(fn) {
    this._onNodeClick = fn;

    return this;
  }

  _generateNode(target, object, depth) {
    const keys = Object.keys(object);
    const valuesCount = keys.length;

    if (valuesCount) {
      const node = document.createElement('span');
      node.className = 'collapsible';
      target.appendChild(node);

      keys.forEach((key, index) => this._generateChildNode(object, key, node, index, depth, valuesCount));

      node.appendChild(document.createTextNode('\n'));
      node.appendChild(this._spaces(depth - 1));
    }
  }

  _generateChildNode(object, key, node, index, depth, valuesCount) {
    const value = object[key];
    node.appendChild(document.createTextNode('\n'));
    node.appendChild(this._spaces(depth));

    !utils.isArray(object) && this._generateChildNodeKeys(value, key, node);

    this._generate(node, value, depth + 1);
    node.appendChild(document.createTextNode(valuesCount - 1 === index ? '' : ','));
  }

  _generateChildNodeKeys(value, key, node) {
    const isClickable = utils.isObjectLike(value) && Object.keys(value).length;
    const keyClassNames = ['key'].concat(isClickable ? ['opened', 'clickable'] : []);
    const nodeKey = this._withClass(key, ...keyClassNames);

    nodeKey.onclick = utils.isFunction(this._onNodeClick) ? this._onNodeClick : null;

    node.appendChild(nodeKey);
    node.appendChild(document.createTextNode(': '));
  }

  _getBraces(object) {
    return utils.isArray(object) ? '[]' : '{}';
  }

  _withClass(value, ...classNames) {
    const span = document.createElement('span');
    span.className = classNames.join(' ');
    span.innerHTML = value;

    return span;
  }

  _spaces(count = 0) {
    count *= this.indent;
    let result = "";
    for (let i = 0; i < count; ++i) {
      result = result + (i % this.indent ? ' ' : '|');
    }

    return this._withClass(result, 'space');
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