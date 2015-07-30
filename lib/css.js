export default function (gradients) {
  if (!gradients.length) throw 'No gradients supplied';

  return (selector) = {
    const gradient = gradients[0];
    let retval;

    if (gradient.type === 'linear') {
      const angle = gradient.angle;
      const angleLegacy = (90 - angle + 360) % 360;
      const stops = gradient.stops.map(function (stop) {
        return stop.color + ' ' + stop.position;
      }).join(',');

      retval = selector ? selector + ' {' : '';

      retval += [
        'background-color: ${gradient.stops[0].color}',
        'background: -webkit-linear-gradient(${angleLegacy}, ${stops})',
        'background: -moz-linear-gradient(${angleLegacy}, ${stops})',
        'background: -o-linear-gradient(${angleLegacy}, ${stops})',
        'background: linear-gradient(${angle}, ${stops})'
        ].join(';');

      retval += selector ? '}' : '';
    }

    return retval;
  };
};