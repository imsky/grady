import deg2xy from './deg2xy';

let ctx;

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

  return function (width, height) {
    const gradient = gradients[0];
    const xy = deg2xy(gradient.angle);
    let retval;

    if (gradient.type === 'linear') {
      let x = xy[0];
      let y = xy[1];
      let mx = width / 2;
      let my = height / 2;
      let dx = (width * x) - mx;
      let dy = (height * y) - my;

      let args = [width * x, height * y, mx - dx, my - dy].map(Math.floor);

      let lg = ctx.createLinearGradient.apply(ctx, args);

      gradient.stops.forEach(stop => {
        lg.addColorStop(stop.position, stop.color);
      });

      retval = lg;
    }

    return retval;
  };
};