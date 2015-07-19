import canvas from './canvas';

function Builder (input, options) {
  const parser = options.parser;

  if (!parser) throw 'No parser supplied';

  let gradients = parser(input);

  if (!gradients.length) throw 'No gradients supplied: ' + input;

  let gradient = gradients[0];

  return {
    'canvas': canvas(gradient)
  };
}

export default function (input, options) {
  return new Builder(input, options);
};