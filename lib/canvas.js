import { endPointsFromAngle } from './utils';

const document = global.document;

export default function (gradients) {
  if (!document.createElement('canvas').getContext) {
    return () => {
      throw 'Client does not support canvas.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  //todo: account for backing store ratio
  return (canvas) => {
    const gradient = gradients[0];
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let retval;

    if (gradient.type === 'linear') {
      let coords = endPointsFromAngle(gradient.angle, width, height);

      let lg = ctx.createLinearGradient.apply(ctx, coords.map(Math.floor));
      gradient.stops.forEach(stop => {
        lg.addColorStop(stop.position, stop.color);
      });

      retval = lg;
    }

    return retval;
  };
};