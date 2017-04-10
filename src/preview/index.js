import Formatter from '../formatter';
import state from './state';

const f = new Formatter(document.getElementById('placeholder'), state);
f.format();