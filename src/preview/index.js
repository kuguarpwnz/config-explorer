import ConfigExplorer from '../explorer';
import state from './state';

const toggleClass = (element, toggleClass) => {
  const classes = element.className.split(' ');
  const result = classes.filter((value) => value !== toggleClass);
  if (result.length === classes.length) {
    result.push(toggleClass);
  }
  element.className = result.join(' ');
};

const toggle = (element, visible = 'inline') => {
  const { style, style: { display } } = element;
  style.display = display === 'none' ? visible : 'none';
};

const hasClass = (element, search) => ~element.className.split(' ').indexOf(search);


const changeObject = (object, path, value) => {
  path = path.split('.');

  while (true) {
    const { length } = path;
    const key = path.shift();

    if (length === 1) {
      object[key] = value;
      break;
    }

    if (!object.hasOwnProperty(key)) break;

    object = object[key];
  }
};


const configExplorer = new ConfigExplorer(document.getElementById('placeholder'));

configExplorer
  .onNodeClick((e) => {
    const ct = e.currentTarget;
    // TODO: replace with search in siblings by class
    const collapsible = ct.nextElementSibling.nextElementSibling.nextElementSibling;

    if (collapsible && hasClass(ct, 'clickable') && hasClass(collapsible, 'collapsible')) {
      toggle(collapsible);
      toggleClass(ct, 'opened');
      toggleClass(ct, 'closed');
    }
  })
  .enums({
    'state.time.value': ['2014', '2015', '2016', '2017']
  })
  .onEnumChange((path, value) => {
    changeObject(state, path, value);
    configExplorer.print(state);
  })
  .print(state);