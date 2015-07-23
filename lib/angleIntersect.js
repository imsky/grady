/**
 * Given a degree, find the coordinates
 * where a ray starting from the center
 * of a unit square would intersect its edges
 * @param deg
 */
 //todo: compare with Chrome's endPointsFromAngle
//https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/css/CSSGradientValue.cpp&sq=package:chromium&type=cs&l=674&rcl=1437478890
export default function (deg = 0) {
  deg = deg % 360;
  if (deg < 0) deg += 360;

  const rad = deg * (Math.PI / 180);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const x = 0.5;
  const y = x;

  let t1 = x / cos;
  let t2 = y / sin;

  let ta = [t1, t2, -t1, -t2];

  let m = Infinity;

  for(let i = 0, l = ta.length; i < l; i++)
    if (ta[i] > 0 && ta[i] < m) m = ta[i];

  return [x + m * cos, y + m * sin];
};