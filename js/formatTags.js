'use strict';

module.exports = {
  html: {
    pre: ['<pre>', '</pre>'],
    p: ['<p>', '</p>'],
    bold: ['<b>', '</b>'],
    italic: ['<i>', '</i>'],
    code: ['<tt>', '</tt>'],
    invalid: ['><']
  },
  ansi: {
    pre: ['\x1b[7m', '\x1b[27m'],
    p: ['', '\n'],
    bold: ['\x1b[1m', '\x1b[22m'],
    italic: ['\x1b[3m', '\x1b[23m'],
    code: ['\x1b[7m', '\x1b[27m'],
    invalid: ['m_\x1b[', 'm`\x1b[', 'm**\x1b[']
  }
};
