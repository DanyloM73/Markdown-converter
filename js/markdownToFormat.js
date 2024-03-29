'use strict';

const formatTags = require('./formatTags');

const isPreBlock = (line) => line.startsWith('```');

const isEmptyLine = (line) => line.trim() === '';

const shouldStartParagraph = (line, inParagraph) => !inParagraph && /^[a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ]/.test(line);

const formatLine = (line, format) => {
    const boldRegex = /(?<![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])\*\*([^_\`]*)\*\*(?![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])/g;
    const italicRegex = /(?<![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])_([^\*\`]*)_(?![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])/g;
    const codeRegex = /(?<![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])\`([^\*_]*)\`(?![a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ])/g;

    return line
        .replace(boldRegex, `${formatTags[format].bold[0]}$1${formatTags[format].bold[1]}`)
        .replace(italicRegex, `${formatTags[format].italic[0]}$1${formatTags[format].italic[1]}`)
        .replace(codeRegex, `${formatTags[format].code[0]}$1${formatTags[format].code[1]}`);
}

const joinLines = (lines, format) => {
    let result = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === `${formatTags[format].p[1]}` && i > 0) {
            result = result.trim() + lines[i] + '\n';
        } else {
            result += lines[i] + '\n';
        }
    }
    return result.trim();
}

const checkNestedSpecialChars = (line) => {
    const specialChars = ['**', '_', '`'];
    for (let i = 0; i < line.length - 1; i++) {
        if (specialChars.includes(line[i]) && specialChars.includes(line[i + 1])) {
            throw `Invalid markdown in line: ${line}`;
        }
    }
    return checkNoEndSpecialChars(line);
}

const checkNoEndSpecialChars = (line) => {
    const specialChars = ['**', '_', '`'];
    for (let char of specialChars) {
        let index = line.indexOf(char);
        while (index !== -1) {
            if ((index === 0 || line[index - 1] === ' ') && /[a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ]/.test(line[index + char.length])) {
                if (line.indexOf(char, index + char.length) === -1) {
                    throw `Invalid markdown in line: ${line}`;
                }
            }
            index = line.indexOf(char, index + char.length);
        }
    }
    return line;
}

const markdownToFormat = (markdown, format) => {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');
  const lines = normalizedMarkdown.split('\n');

  let inPreBlock = false;
  let inParagraph = false;
  let formatLinesArray = lines.map(line => {
      if (isPreBlock(line)) {
          inPreBlock = !inPreBlock;
          return inPreBlock ? `${formatTags[format].pre[0]}` : `${formatTags[format].pre[1]}`;
      }
      if (inPreBlock) {
          return line;
      }
      if (isEmptyLine(line)) {
          inParagraph = false;
          return `${formatTags[format].p[1]}`;
      }
      if (shouldStartParagraph(line, inParagraph)) {
          inParagraph = true;
          return `${formatTags[format].p[0]}` + formatLine(checkNestedSpecialChars(line), format);
      }
      return formatLine(checkNestedSpecialChars(line), format);
  });
  if (inParagraph) {
      formatLinesArray.push(`${formatTags[format].p[1]}`);
  }
  return joinLines(formatLinesArray, format);
}

module.exports = markdownToFormat;
