export default function (gradient) {
  //todo: account for backing store ratio

  let deg = gradient.angle;

  if (deg < 0) {
    deg += 360;
  } else if (deg > 360) {
    deg = deg % 360;
  }

  if (deg < 0 || deg > 360) throw 'Invalid angle: ' + deg;

  let rad = deg * (Math.PI / 180);

  return function (ctx, width, height) {
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