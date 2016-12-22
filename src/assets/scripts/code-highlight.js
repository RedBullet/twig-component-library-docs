import hljs from 'highlight.js';

export default function init() {
  [...document.querySelectorAll('pre code')].forEach((block) => {
    hljs.highlightBlock(block);
  });
}
