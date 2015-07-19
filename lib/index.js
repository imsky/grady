import builder from './builder';
import parser from './parser';

let Grady = function (input, options = {}) {
  options.parser = options.parser || parser;
  return builder(input, options);
};

export {
  Grady as default
};