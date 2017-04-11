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
    const collapsibleClass = '_c-e-collapsible';
    const ct = e.currentTarget;
    const collapsible = ct.nextElementSibling;

    if (collapsible && hasClass(ct, collapsibleClass) && hasClass(collapsible, collapsibleClass)) {
      toggle(collapsible);
      toggleClass(ct, '_c-e-opened');
      toggleClass(ct, '_c-e-closed');
    }
  })
  .print(state);