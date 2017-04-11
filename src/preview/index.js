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

ConfigExplorer.create(document.getElementById('placeholder'))
  .onNodeClick((e) => {
    const collapsible = e.currentTarget.nextElementSibling;
    if (collapsible) {

      const classNames = collapsible.className.split(' ');
      if (classNames.includes('_c-e-collapsible')) {
        const { style, style: { display } } = collapsible;
        style.display = display === 'none' ? 'inline' : 'none';
        toggleClass(e.currentTarget, '_c-e-opened');
        toggleClass(e.currentTarget, '_c-e-closed');
      }
    }
  })
  .print(state);