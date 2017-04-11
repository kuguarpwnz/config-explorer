import ConfigExplorer from '../formatter';
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

ConfigExplorer.create(document.getElementById('placeholder'))
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
  .print(state);