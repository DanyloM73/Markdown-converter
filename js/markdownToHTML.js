'use strict';

const isPreBlock = (line) => line.startsWith('```');

const isEmptyLine = (line) => line.trim() === '';

const shouldStartParagraph = (line, inParagraph) => !inParagraph && /^[a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ]/.test(line);

const formatLine = (line) => {
    const boldRegex = /(?<![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])\*\*(.*?)\*\*(?![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])/g;
    const italicRegex = /(?<![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])_(.*?)_(?![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])/g;
    const codeRegex = /(?<![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])\`(.*?)\`(?![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])/g;

    return line
        .replace(boldRegex, '<b>$1</b>')
        .replace(italicRegex, '<i>$1</i>')
        .replace(codeRegex, '<tt>$1</tt>');
}

const joinLines = (lines) => {
    let result = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '</p>' && i > 0) {
            result = result.trim() + lines[i] + '\n';
        } else {
            result += lines[i] + '\n';
        }
    }
    return result.trim();
}

const checkSpecialChars = (htmlString) => {
    const specialChars = ['\\*\\*', '_', '`'];
    for (let char of specialChars) {
        let regex = new RegExp(`(?<![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])(${char})([a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])`, 'g');
        if (regex.test(htmlString) || htmlString.includes('><')) {
            console.error(`Invalid markdown in line: ${htmlString}`);
            process.exit(1);
        }
    }
    return htmlString;
}

const markdownToHtml = (markdown) => {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');
  const lines = normalizedMarkdown.split('\n');

  let inPreBlock = false;
  let inParagraph = false;
  let htmlArray = lines.map(line => {
      if (isPreBlock(line)) {
          inPreBlock = !inPreBlock;
          return inPreBlock ? '<pre>' : '</pre>';
      }
      if (inPreBlock) {
          return line;
      }
      if (isEmptyLine(line)) {
          inParagraph = false;
          return '</p>';
      }
      if (shouldStartParagraph(line, inParagraph)) {
          inParagraph = true;
          return '<p>' + checkSpecialChars(formatLine(line));
      }
      return checkSpecialChars(formatLine(line));
  });
  if (inParagraph) {
      htmlArray.push('</p>');
  }
  return joinLines(htmlArray);
}

module.exports = markdownToHtml;