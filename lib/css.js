const document = global.document;

const agent = (() => {
  let retval;
  ['webkit', 'moz', 'o', 'ms'].forEach(prefix => {
    if (document.body && typeof document.body.style[prefix + 'BorderRadius'] !== 'undefined') {
      retval = prefix;
    }
  });
  return retval;
})();

export default function (gradients) {
  if (!document) {
    return () => {
      throw 'Client does not support CSS.';
    };
  }

  if (!agent) {
    return () => {
      throw 'Client not supported.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  return (options = {}) => {
    const gradient = gradients[0];
    let retval;
    let inline = !options.selector && options.inline === true;
    let selector = options.selector;

    if (gradient.type === 'linear') {
      const angle = gradient.angle;
      const angleLegacy = (90 - angle + 360) % 360;
      const stops = gradient.stops.map(function (stop) {
        return `${stop.color} ${parseFloat((stop.position * 100).toFixed(2))}%`;
      }).join(',');

      retval = selector ? selector + ' {' : '';

      if (inline) {
        retval += `-${agent}-linear-gradient(${angleLegacy}deg, ${stops})`;
      } else {
        retval += [
          `background-color: ${gradient.stops[0].color}`,
          `background: -webkit-linear-gradient(${angleLegacy}deg, ${stops})`,
          `background: -moz-linear-gradient(${angleLegacy}deg, ${stops})`,
          `background: -o-linear-gradient(${angleLegacy}deg, ${stops})`,
          `background: linear-gradient(${angle}deg, ${stops})`
          ].join(';');
      }

      retval += selector ? '}' : '';
    }

    return retval;
  };
};