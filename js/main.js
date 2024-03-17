'use strict';

const convertFile = require('./convertFile');

const args = process.argv.slice(2);
const inputPath = args[0];

const outputPathArg = args.find(arg => arg.startsWith('--out='));
const outputPath = outputPathArg ? outputPathArg.split('=')[1] : null;

const formatArg = args.find(arg => arg.startsWith('--format='));
const format = formatArg ? formatArg.split('=')[1] : (outputPath ? 'html' : 'ansi');

convertFile(inputPath, outputPath, format);
