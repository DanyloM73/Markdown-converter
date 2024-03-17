'use strict';

const convertFile = require('./convertFile');

const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;

convertFile(inputPath, outputPath);