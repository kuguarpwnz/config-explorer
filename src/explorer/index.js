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
    this.placeholder.innerHTML = '';
    this.placeholder.appendChild(
      this._generate(
        document.createElement('pre'),
        utils.escapeJSON(state),
        1
      )
    );

    return this;
  }

  enums(value = {}) {
    this._enums = value;

    return this;
  }

  onNodeClick(fn) {
    this._onNodeClick = fn;

    return this;
  }


  onEnumChange(fn) {
    this._onEnumChange = fn;

    return this;
  }

  _generate(target, value, depth = 1, path = '') {
    return utils.isObjectLike(value) ?
      this._generateObjectLike(target, value, depth, path) :
      this._generatePrimitive(target, value, path);
  }

  _generateObjectLike(target, object, depth, path) {
    const [openBrace, closeBrace] = this._getBraces(object);

    target.appendChild(openBrace);
    this._generateNode(target, object, depth, path);
    target.appendChild(closeBrace);

    return target;
  }

  _generateNode(target, object, depth, path) {
    const keys = Object.keys(object);
    const valuesCount = keys.length;

    if (valuesCount) {
      const node = this.constructor._wrap('', 'collapsible');
      target.appendChild(node);

      keys.forEach((key, index) => this._generateNodeValue(object, key, node, path, index, depth, valuesCount));

      node.appendChild(document.createTextNode('\n'));
      node.appendChild(this._spaces(depth - 1));
    }
  }

  _generateNodeValue(object, key, node, path, index, depth, valuesCount) {
    const value = object[key];
    node.appendChild(document.createTextNode('\n'));
    node.appendChild(this._spaces(depth));

    if (!utils.isArray(object)) {
      path = path ? `${path}.${key}` : key;
      this._generateNodeValueKey(value, key, node, path);
    }

    this._generate(node, value, depth + 1, path);
    valuesCount - 1 !== index && node.appendChild(this.constructor._wrap(',', 'comma'));
  }

  _generateNodeValueKey(value, key, node, path) {
    const isClickable = utils.isObjectLike(value) && Object.keys(value).length;
    const keyClassNames = ['key'].concat(isClickable ? ['opened', 'clickable'] : []);
    const nodeKey = this.constructor._wrap(key, ...keyClassNames);
    nodeKey.dataset.path = path;

    nodeKey.onclick = utils.isFunction(this._onNodeClick) ? this._onNodeClick : null;

    node.appendChild(nodeKey);
    node.appendChild(this.constructor._wrap(':', 'colon'));
    node.appendChild(document.createTextNode(' '));
  }

  _getBraces(object) {
    return (utils.isArray(object) ? '[]' : '{}')
      .split('').map((brace) => this.constructor._wrap(brace, 'brace'));
  }

  _spaces(count = 0) {
    count *= this.indent;
    let result = "";
    for (let i = 0; i < count; ++i) {
      result = result + (i % this.indent ? ' ' : '|');
    }

    return this.constructor._wrap(result, 'space');
  }

  _generatePrimitive(target, value, path) {

    const enums = this._enums && this._enums[path];
    if (enums) {
      const { length } = enums;

      target.appendChild(this.constructor._wrap('(', 'brace'));

      enums.map((enumValue, index) => {

        const enumElement = this.constructor._wrap(
          utils.isString(enumValue) ? `"${enumValue}"` : enumValue,
          'value',
          'enum',
          this.constructor._getPrimitiveClass(enumValue),
          ...value === enumValue ? ['selected'] : []
        );

        enumElement.dataset.value = JSON.stringify(enumValue);
        enumElement.onclick = utils.isFunction(this._onEnumChange) ?
          (event) => this._onEnumChange(path, JSON.parse(event.target.dataset.value)) :
          null;

        target.appendChild(enumElement);

        length - 1 !== index && target.appendChild(this.constructor._wrap(', ', 'comma'));
      });

      target.appendChild(this.constructor._wrap(')', 'brace'));

    } else {
      value = utils.isString(value) ? `"${value}"` : value;
      target.appendChild(this.constructor._wrap(value, 'value', this.constructor._getPrimitiveClass(value)));
    }

    return target;
  }

  static _getPrimitiveClass(value) {
    return (typeof value).toLowerCase();
  }

  static _wrap(value, ...classNames) {
    const span = document.createElement('span');
    span.className = classNames.join(' ');
    span.innerHTML = value;

    return span;
  }
}