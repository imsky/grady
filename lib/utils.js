/**
 * Given a degree, find the coordinates
 * where a ray starting from the center
 * of a unit square would intersect its edges
 * @param deg
 */
export function angleIntersect (deg = 0) {
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


/**
 * Scales a point on a unit square to a given rectangle
 * and provides the opposite point to form a line through 
 * the the rectangle's centroid
 * @param x X coordinate on unit square
 * @param y Y coordinate on unit square
 * @param width
 * @param height
 */
export function gradientLine (x, y, width, height) {
  let nx = x * width, ny = y * height;
  let mx = width / 2, my = height / 2;

  return [nx, ny, width - nx, height - ny];
};

//Ported from Chromium
//todo: simplify + optimize
//todo: jsdoc
export function endPointsFromAngle (angle, width, height) {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  const rad = angle * (Math.PI / 180);

  let x1, y1, x2, y2;

  if (angle === 0) {
    [x1, y1] = [0, height];
    [x2, y2] = [0, 0];
  } else if (angle === 90) {
    [x1, y1] = [0, 0];
    [x2, y2] = [width, 0];
  } else if (angle === 180) {
    [x1, y1] = [0, 0];
    [x2, y2] = [0, height];
  } else if (angle === 270) {
    [x1, y1] = [width, 0];
    [x2, y2] = [0, 0];
  } else {
    const slope = Math.tan((90 - angle) * (Math.PI / 180));
    const pslope = -1 / slope;
    const midx = width / 2;
    const midy = height / 2;

    let corner;

    if (angle < 90) {
      corner = [midx, midy];
    } else if (angle < 180) {
      corner = [midx, -midy];
    } else if (angle < 270) {
      corner = [-midx, -midy];
    } else {
      corner = [-midx, midy];
    }

    const intercept = corner[1] - pslope * corner[0];
    const endx = intercept / (slope - pslope);
    const endy = pslope * endx + intercept;

    [x1, y1] = [midx - endx, midy + endy];
    [x2, y2] = [midx + endx, midy - endy];
  }

  return [x1, y1, x2, y2];
};