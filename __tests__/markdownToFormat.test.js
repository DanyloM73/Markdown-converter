const markdownToFormat = require('../js/markdownToFormat');

describe('markdownToFormat', () => {
  it('should convert markdown to HTML', () => {
    const markdown = '**bold** _italic_ `code`';
    const expectedHtml = '<b>bold</b> <i>italic</i> <tt>code</tt>';
    expect(markdownToFormat(markdown, 'html')).toBe(expectedHtml);
  });

  it('should convert markdown to ANSI', () => {
    const markdown = '**bold** _italic_ `code`';
    const expectedAnsi = '\x1b[1mbold\x1b[22m \x1b[3mitalic\x1b[23m \x1b[7mcode\x1b[27m';
    expect(markdownToFormat(markdown, 'ansi')).toBe(expectedAnsi);
  });

  it('should handle preformatted blocks', () => {
    const markdown = '```\npreformatted text\n```';
    const expectedHtml = '<pre>\npreformatted text\n</pre>';
    const expectedAnsi = '\x1b[7m\npreformatted text\n\x1b[27m';
    expect(markdownToFormat(markdown, 'html')).toBe(expectedHtml);
    expect(markdownToFormat(markdown, 'ansi')).toBe(expectedAnsi);
  });

  it('should handle paragraphs', () => {
    const markdown = 'paragraph 1\n\nparagraph 2';
    const expectedHtml = '<p>paragraph 1</p>\n<p>paragraph 2</p>';
    const expectedAnsi = 'paragraph 1\n\nparagraph 2';
    expect(markdownToFormat(markdown, 'html')).toBe(expectedHtml);
    expect(markdownToFormat(markdown, 'ansi')).toBe(expectedAnsi);
  });

  it('should handle invalid syntax', () => {
    const markdownNested = '**`_nested_`**';
    const markdownNoEnd = '_no end';
    const expectedNestedError = 'Invalid markdown in line: **`_nested_`**';
    const expectedNoEndError = 'Invalid markdown in line: _no end';
    expect(() => markdownToFormat(markdownNested, 'ansi')).toThrow(expectedNestedError);
    expect(() => markdownToFormat(markdownNoEnd, 'ansi')).toThrow(expectedNoEndError);
  })
});
