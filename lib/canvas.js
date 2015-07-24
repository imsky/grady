import { angleIntersect, gradientLine } from './utils';

let canvas = document.createElement('canvas');
let ctx;

if (canvas.getContext) {
  ctx = canvas.getContext('2d');
}

export default function (gradients) {
  if (!ctx) {
    return () => {
      throw 'Client does not support canvas.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  //todo: account for backing store ratio
  return (width, height) => {
    const gradient = gradients[0];
    let retval;

    if (gradient.type === 'linear') {
      const angle = gradient.angle + 90;
      let x, y;
      [x, y] = angleIntersect(angle);
      let coords = gradientLine(x, y, width, height);

      let lg = ctx.createLinearGradient.apply(ctx, coords.map(Math.floor));
      gradient.stops.forEach(stop => {
        lg.addColorStop(stop.position, stop.color);
      });

      retval = lg;
    }

    return retval;
  };
};