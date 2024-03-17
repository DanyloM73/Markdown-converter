'use strict';

const fs = require('fs');
const markdownToFormat = require('./markdownToFormat');

const convertFile = (inputPath, outputPath = null, format) => {
  fs.readFile(inputPath, 'utf8', (err, data) => {
      if (err) {
          console.error(`Error reading file: ${err}`);
          process.exit(1);
      }

      try {
          const result = markdownToFormat(data, format);

          if (outputPath) {
              fs.writeFile(outputPath, result, (err) => {
                  if (err) {
                      console.error(`Error writing file: ${err}`);
                      process.exit(1);
                  }
              });
          } else {
              console.log(result);
          }
      } catch (err) {
          console.error(`Error converting markdown to ${format}: ${err}`);
          process.exit(1);
      }
  });
}

module.exports = convertFile;
