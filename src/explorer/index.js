import * as utils from '../utils';

class ConfigExplorer {
  constructor(placeholder, indent = 2) {
    this.placeholder = placeholder;
    this.indent = indent;
  }

  static create(...args) {
    return new this(...args);
  }

  print(state, showPaths = []) {
    this.placeholder.innerHTML = '';
    this.placeholder.appendChild(
      this._generate(
        document.createElement('pre'),
        utils.escapeJSON(state),
        showPaths
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

  _generate(target, value, showPaths, depth = 1, path = '') {
    return utils.isObjectLike(value) ?
      this._generateObjectLike(target, value, showPaths, depth, path) :
      this._generatePrimitive(target, value, path);
  }

  _generateObjectLike(target, object, showPaths, depth, path) {
    const [openBrace, closeBrace] = this._getBraces(object);

    target.appendChild(openBrace);
    this._generateNode(target, object, showPaths, depth, path);
    target.appendChild(closeBrace);

    return target;
  }

  _generateNode(target, object, showPaths, depth, path) {
    const keys = Object.keys(object);
    const valuesCount = keys.length;

    if (valuesCount) {
      const nodeClassNames = ['collapsible', `depth-${depth}`];
      (this._pathHasEnums(path) || this._pathHasEnums(path, showPaths)) && nodeClassNames.push('opened');

      const node = this.constructor._wrap('', ...nodeClassNames);
      target.appendChild(node);

      keys.forEach((key, index) => this._generateNodeValue(
        object, key, node, showPaths, path, index, depth, valuesCount
      ));

      node.appendChild(document.createTextNode('\n'));
      node.appendChild(this._spaces(depth - 1));
    }
  }

  _generateNodeValue(object, key, node, showPaths, path, index, depth, valuesCount) {
    const value = object[key];
    node.appendChild(document.createTextNode('\n'));
    node.appendChild(this._spaces(depth));

    if (!utils.isArray(object)) {
      path = path ? `${path}.${key}` : key;
      this._generateNodeValueKey(value, key, showPaths, node, path);
    }

    this._generate(node, value, showPaths, depth + 1, path);
    valuesCount - 1 !== index && node.appendChild(this.constructor._wrap(',', 'comma'));
  }

  _generateNodeValueKey(value, key, showPaths, node, path) {
    const isClickable = utils.isObjectLike(value) && Object.keys(value).length;
    const keyClassNames = ['key'];

    isClickable && keyClassNames.push('clickable');
    (this._pathHasEnums(path) || this._pathHasEnums(path, showPaths)) && keyClassNames.push('opened');

    const nodeKey = this.constructor._wrap(key, ...keyClassNames);
    nodeKey.dataset.path = path;

    if (isClickable) {
      nodeKey.onclick = (event) => {
        const { currentTarget } = event;
        const collapsible = currentTarget.nextElementSibling.nextElementSibling.nextElementSibling;

        utils.toggleClass(currentTarget, 'opened');
        !utils.toggleClass(collapsible, 'opened') && utils.removeChildrenClass(collapsible, 'opened');
        utils.isFunction(this._onNodeClick) && this._onNodeClick(event, path, collapsible);
      };
    }

    node.appendChild(nodeKey);
    node.appendChild(this.constructor._wrap(':', 'colon'));
    node.appendChild(document.createTextNode(' '));
  }

  _getBraces(object) {
    return (utils.isArray(object) ? '[]' : '{}')
      .split('').map((brace) => this.constructor._wrap(brace, 'brace'));
  }

  _spaces(count = 0) {
    const spaces = this.constructor._wrap('', 'space');

    count *= this.indent;
    for (let i = 0; i < count; ++i) {
      spaces.appendChild(
        i % this.indent ?
          document.createTextNode(' ') :
          this.constructor._wrap('', 'delimiter')
      );
    }

    return spaces;
  }

  _generatePrimitive(target, value, path) {

    const enums = this._enums && this._enums[path];
    if (enums) {
      const { length } = enums;

      enums.map((enumValue, index) => {
        const enumElement = this.constructor._wrap(
          utils.isString(enumValue) ? `"${enumValue}"` : enumValue,
          'value',
          'enum',
          this.constructor._getPrimitiveClass(enumValue),
          ...value === enumValue ? ['selected'] : [],
          ...index ? [] : ['first'],
          ...length - 1 !== index ? [] : ['last']
        );

        enumElement.dataset.value = JSON.stringify(enumValue);
        enumElement.onclick = (event) => {
          if (utils.isFunction(this._onEnumChange)) {
            this._onEnumChange(path, JSON.parse(event.target.dataset.value))
          }
        };

        target.appendChild(enumElement);
      });

    } else {
      value = utils.isString(value) ? `"${value}"` : value;
      target.appendChild(this.constructor._wrap(value, 'value', this.constructor._getPrimitiveClass(value)));
    }

    return target;
  }

  _pathHasEnums(path, paths = this._enums) {
    return (
      utils.isArray(paths) ?
        paths :
        Object.keys(paths || {})
    ).some((enumPath) => ~enumPath.indexOf(path));
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

export default ConfigExplorer;
try {
  module.exports = ConfigExplorer;
} catch (e) {
}
