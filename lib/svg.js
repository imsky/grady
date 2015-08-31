import { endPointsFromAngle } from './utils';

const SVG_NS = 'http://www.w3.org/2000/svg';
const document = global.document;

let svgSupport = !!document.createElementNS(SVG_NS, 'svg').createSVGRect;

export default function (gradients) {
  if (!svgSupport) {
    return () => {
      throw 'Client does not support SVG.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  return (svg) => {
    if (!svg) throw 'SVG reference not supplied';

    const gradient = gradients[0];
    const id = 'grady-' + Number(new Date()).toString(36);
    const svgWidth = svg.getAttribute('width');
    const svgHeight = svg.getAttribute('height');
    const svgViewBox = svg.getAttribute('viewBox');

    if (!(svgWidth && svgHeight) && !svgViewBox) throw 'No SVG dimensions available';

    let aspectRatio = 1;
    let retval;

    if (svgWidth && svgHeight) {
      aspectRatio = parseFloat(svgWidth) / parseFloat(svgHeight);
    } else if (svgViewBox) {
      let viewBox = svgViewBox.split(' ').map(Number);
      // assumes min-x and min-y are 0
      aspectRatio = parseFloat(viewBox[2]) / parseFloat(viewBox[3]);
    }

    if (gradient.type === 'linear') {
      const angle = gradient.angle;
      let coords = endPointsFromAngle(angle, aspectRatio, 1);

      let lg = document.createElementNS(SVG_NS, 'linearGradient');
      lg.setAttribute('id', id);
      lg.setAttribute('y1', coords[0] / aspectRatio);
      lg.setAttribute('y2', coords[2] / aspectRatio);
      lg.setAttribute('x1', coords[1]);
      lg.setAttribute('x2', coords[3]);

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