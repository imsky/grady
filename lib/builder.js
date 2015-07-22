import canvas from './canvas';

function Builder (input, options) {
  const parser = options.parser;

  if (!parser) throw 'No parser supplied';

  let gradients = parser(input);

  if (!gradients.length) throw 'No gradients supplied: ' + input;

  return {
    'canvas': canvas(gradients)
  };
}

export default function (input, options) {
  return new Builder(input, options);
};