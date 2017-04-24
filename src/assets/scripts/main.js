require('element-closest');
require('classlist-polyfill');
require('core-js/fn/array/from');
require('core-js/fn/array/for-each');
const iFrameResize = require('iframe-resizer/js/iframeResizer');

import sgTabs from '../components/molecules/sg-tabs';
import codeHighlight from './code-highlight';
import sgVariant from '../components/molecules/sg-variant';
import isolated from './isolated';

sgTabs();
codeHighlight();
sgVariant();
isolated();

iFrameResize({ log: false }, '.sg-variant__component iframe');
