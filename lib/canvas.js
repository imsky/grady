import angleIntersect from './angleIntersect';

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
      x *= width;
      y *= height;
      let mx = width / 2;
      let my = height / 2;
      let dx = x - mx;
      let dy = y - my;

      let args = [x, y, mx - dx, my - dy].map(Math.floor);

      let lg = ctx.createLinearGradient.apply(ctx, args);

      gradient.stops.forEach(stop => {
        lg.addColorStop(stop.position, stop.color);
      });

      retval = lg;
    }

    return retval;
  };
};