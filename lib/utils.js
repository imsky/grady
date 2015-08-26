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

/* sketch for next implementation:
1. calculate the mod 90 degrees in one destructured step:
   [f(angle, 270), f(angle(0), f(angle, 90), f(angle, 180)]
2. get the relevant corner (45 deg = top right from origin) 
3. get line equation for line that goes through corner (LC) with slope perpendicular to line that goes through origin (LO)
4. get intersection of LC and LO
5. reflect intersection across origin to be the starting point
*/