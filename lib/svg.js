import { endPointsFromAngle } from './utils';

const SVG_NS = 'http://www.w3.org/2000/svg';
const document = global.document;

let _svg = document.createElementNS(SVG_NS, 'svg');
let svg;

if (_svg.createSVGRect) {
  svg = _svg;
}

export default function (gradients) {
  if (!svg) {
    return () => {
      throw 'Client does not support SVG.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  return (id = 'gradient') => {
    const gradient = gradients[0];
    let retval;

    if (gradient.type === 'linear') {
      const angle = gradient.angle;
      let coords = endPointsFromAngle(angle, 1, 1);

      let lg = document.createElementNS(SVG_NS, 'linearGradient');
      lg.setAttribute('id', id);
      lg.setAttribute('x1', coords[0]);
      lg.setAttribute('x2', coords[2]);
      lg.setAttribute('y1', coords[1]);
      lg.setAttribute('y2', coords[3]);

      gradient.stops.forEach(stop => {
        let el = document.createElementNS(SVG_NS, 'stop');
        el.setAttribute('offset', stop.position);
        el.setAttribute('stop-color', stop.color);
        lg.appendChild(el);
      });

      retval = lg;
    }

    return retval;
  };
};