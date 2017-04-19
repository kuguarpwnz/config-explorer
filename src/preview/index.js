import ConfigExplorer from '../explorer';
import state from './state';


const changeObject = (object, path, value) => {
  path = path.split('.');

  while (true) {
    const { length } = path;
    const key = path.shift();

    if (length === 1) {
      if (object[key] !== value) {
        object[key] = value;
        return true;
      }
      return false;
    }

    if (!object.hasOwnProperty(key)) return false;

    object = object[key];
  }
};


function toggleClass(element, toggleClass) {
  const classes = element.className.split(' ');
  const result = classes.filter(function (value) { return value !== toggleClass; });
  const hasNotClass = result.length === classes.length;
  hasNotClass && result.push(toggleClass);
  element.className = result.join(' ');
  return hasNotClass;
}

function removeChildrenClass(element, className) {
  const sibling = element.nextElementSibling;
  if (sibling && hasClass(sibling, className)) {
    removeChildrenClass(sibling, className);
  }

  if (element.hasChildNodes()) {
    element.childNodes.forEach(function (node) {
      return node.nodeType === 1 && removeChildrenClass(node, className)
    });
  }

  hasClass(element, className) && toggleClass(element, className);
}

let show = ['state.entities.show.geo.$in'];
const configExplorer = new ConfigExplorer(document.getElementById('placeholder'));

configExplorer
  .enums({
    'state.time.value': ['2014', '2015', '2016', '2017']
  })
  .onNodeClick((event, path, collapsible) => {
    const added = toggleClass(event.currentTarget, 'opened');

    if (!toggleClass(collapsible, 'opened')) {
      removeChildrenClass(collapsible, 'opened');
    }

    if (added && !~show.indexOf(path)) {
      show.push(path);
    } else {
      show = show.filter(function(showPath) {
        return showPath !== path && showPath.lastIndexOf(path) !== 0;
      });
    }
  })
  .onEnumChange((path, value) => changeObject(state, path, value) && configExplorer.print(state, show))
  .print(state, show);