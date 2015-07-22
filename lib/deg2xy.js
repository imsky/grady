/**
 * Given a degree, find the coordinates
 * where a ray starting from the center
 * of a unit square would intersect its edges
 * @param deg
 */
export default function (deg) {
  deg = deg % 360;
  if (deg < 0) deg += 360;

  let rad = deg * (Math.PI / 180);
  let cos = Math.cos(rad);
  let sin = Math.sin(rad);
  let x = 0.5;
  let y = x;

  let t1 = x / cos;
  let t2 = y / sin;

  let ta = [t1, t2, -t1, -t2];

  let m = Infinity;

  for(let i = 0, l = ta.length; i < l; i++)
    if (ta[i] > 0 && ta[i] < m) m = ta[i];

  return [x + m * cos, y + m * sin];
};