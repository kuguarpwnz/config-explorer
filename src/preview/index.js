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


const show = ['state.entities.show.geo.$in'];
const configExplorer = new ConfigExplorer(document.getElementById('placeholder'));

configExplorer
  .enums({
    'state.time.value': ['2014', '2015', '2016', '2017']
  })
  .onEnumChange((path, value) => changeObject(state, path, value) && configExplorer.print(state, show))
  .print(state, show);