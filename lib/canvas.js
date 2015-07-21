import deg2xy from './deg2xy';

const ctx;

function noop () {
  return null;
};

export default function (gradients) {
  if (!gradients.length) throw 'No gradients supplied';

  //todo: consider using customizr
  if (!document.createElement('canvas').getContext) {
    return noop;
  }

  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d');
  }

  //todo: account for backing store ratio

  let xy = deg2xy(gradient.angle);

  return function () {
    const gradient = gradients[0];
    if (gradient.type === 'linear') {
      let lg = ctx.createLinearGradient(width/2, 0, width/2, height);

      gradient.stops.forEach(stop => {
        lg.addColorStop(stop.position, stop.color);
      });

      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, width, height);
    }
    return ctx;
  };
};