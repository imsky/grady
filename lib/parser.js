import hexColorRegex from 'hex-color-regex';

function parseLinearGradient(def) {
  const regexAngle = /^(\-?\d+deg)|^(to\b (?:top|bottom|left|right)$)|^(to\b (?:left|right) (?:top|bottom)$)/;
  const regexPosition = /^([\d\.]+)\%$/;
  const angleMap = {
    'top': 0,
    'bottom': 180,
    'right': 90,
    'left': 270
  };

  if (def.length < 2) throw 'Invalid definition: ' + def;

  let angle, stops;

  if (def.length === 2) {
    stops = def;
    angle = 180;
  } else {
    stops = def.slice(1);
    let match = def[0].match(regexAngle);

    if (!match) throw 'Invalid definition: ' + def;

    if (match[1]) {
      angle = parseInt(match[1].replace('deg', ''), 10);

      if (angle < 0) {
        angle += 360;
      } else if (angle > 360) {
        angle = angle % 360;
      }

      if (angle < 0 || angle > 360) throw 'Invalid angle: ' + match[1];

    } else {
      let dir = (match[2] || match[3]).split(' ');

      angle = angleMap[dir[1]];

      if (dir[2] === 'top') {
        angle += 45;
      } else if (dir[2] === 'bottom') {
        angle -= 45;
      }
    }
  }

  if (stops.length < 2) throw 'Invalid stops: ' + def;

  let globalPosition = 0;
  let interval = 1 / (stops.length - 1);

  stops = stops.map((stop, i) => {
    let split = stop.split(' ');
    let color = split[0];
    let position = globalPosition;

    globalPosition += interval;

    if (!hexColorRegex({'strict': true}).test(color)) throw 'Invalid stop: ' + stop;

    if (split[1]) {
      let match = split[1].match(regexPosition);
      if (match) {
        position = (match[1] / 100);
      }
    }

    position = parseFloat(position.toFixed(8));

    return {
      'color': color,
      'position': position
    }
  });

  return {
    'angle': angle,
    'stops': stops
  };
}

export default function (input) {
  // Output should conform to the following:
  // [{type, angle, repeating, stops: [{color, position}, {color, position}+]}+]
  // type is either "linear" or "radial"
  // angle is an integer from 0 to 359
  // color is a hex value
  // position is a float between 0 and 1
  // repeating is a boolean

  const gradient = {};
  const regex = /^(linear|radial)\-gradient\((.*)\);?$/;

  let match = input.match(regex);
  let pdef;

  if (!match || match.length !== 3) throw 'Invalid input: ' + input;

  let type = match[1];
  let def = match[2].split(',').map(s => s.trim());

  if (type === 'linear') {
    pdef = parseLinearGradient(def);
  } else {
    'Gradient type not supported: ' + type
  }

  gradient.angle = pdef.angle;
  gradient.stops = pdef.stops;
  gradient.type = type;
  gradient.repeating = false;

  return [gradient];
};