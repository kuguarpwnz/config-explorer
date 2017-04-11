import ConfigExplorer from '../formatter';
import state from './state';

ConfigExplorer.create(document.getElementById('placeholder'))
  .onNodeClick((e) => {
    const collapsible = e.currentTarget.nextElementSibling;
    if (collapsible && collapsible.className.split(' ').includes('collapsible')) {
      const { style, style: { display } } = collapsible;
      style.display = display === 'none' ? 'inline' : 'none';
    }
  })
  .format(state);