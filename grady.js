(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Grady = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _canvas = require('./canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _svg = require('./svg');

var _svg2 = _interopRequireDefault(_svg);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

function Builder(input, options) {
  var parser = options.parser;

  if (!parser) throw 'No parser supplied';

  var gradients = parser(input);

  if (!gradients.length) throw 'No gradients supplied: ' + input;

  return {
    'canvas': (0, _canvas2['default'])(gradients),
    'svg': (0, _svg2['default'])(gradients),
    'css': (0, _css2['default'])(gradients)
  };
}

exports['default'] = function (input, options) {
  return new Builder(input, options);
};

;
module.exports = exports['default'];

},{"./canvas":2,"./css":3,"./svg":6}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('./utils');

var document = global.document;

exports['default'] = function (gradients) {
  if (!document.createElement('canvas').getContext) {
    return function () {
      throw 'Client does not support canvas.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  //todo: account for backing store ratio
  return function (canvas) {
    var gradient = gradients[0];
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    var retval = undefined;

    if (gradient.type === 'linear') {
      (function () {
        var coords = (0, _utils.endPointsFromAngle)(gradient.angle, width, height);

        var lg = ctx.createLinearGradient.apply(ctx, coords.map(Math.floor));
        gradient.stops.forEach(function (stop) {
          lg.addColorStop(stop.position, stop.color);
        });

        retval = lg;
      })();
    }

    return retval;
  };
};

;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":7}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var document = global.document;

var agent = (function () {
  var retval = undefined;
  ['webkit', 'moz', 'o', 'ms'].forEach(function (prefix) {
    if (document.body && typeof document.body.style[prefix + 'BorderRadius'] !== 'undefined') {
      retval = prefix;
    }
  });
  return retval;
})();

exports['default'] = function (gradients) {
  if (!agent || !document) {
    return function () {
      throw 'Client not supported.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  return function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var gradient = gradients[0];
    var retval = undefined;
    var inline = !options.selector && options.inline === true;
    var selector = options.selector;

    if (gradient.type === 'linear') {
      var angle = gradient.angle;
      var angleLegacy = (90 - angle + 360) % 360;
      var stops = gradient.stops.map(function (stop) {
        return stop.color + ' ' + parseFloat((stop.position * 100).toFixed(2)) + '%';
      }).join(',');

      retval = selector ? selector + ' {' : '';

      if (inline) {
        retval += '-' + agent + '-linear-gradient(' + angleLegacy + 'deg, ' + stops + ')';
      } else {
        retval += ['background-color: ' + gradient.stops[0].color, 'background: -webkit-linear-gradient(' + angleLegacy + 'deg, ' + stops + ')', 'background: -moz-linear-gradient(' + angleLegacy + 'deg, ' + stops + ')', 'background: -o-linear-gradient(' + angleLegacy + 'deg, ' + stops + ')', 'background: linear-gradient(' + angle + 'deg, ' + stops + ')'].join(';');
      }

      retval += selector ? '}' : '';
    }

    return retval;
  };
};

;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var Grady = function Grady(input) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options.parser = options.parser || _parser2['default'];
  return (0, _builder2['default'])(input, options);
};

exports['default'] = Grady;
module.exports = exports['default'];

},{"./builder":1,"./parser":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _hexColorRegex = require('hex-color-regex');

var _hexColorRegex2 = _interopRequireDefault(_hexColorRegex);

function parseLinearGradient(def) {
  var regexAngle = /^(\-?\d+deg)|^(to\b (?:top|bottom|left|right)$)|^(to\b (?:left|right) (?:top|bottom)$)/;
  var regexPosition = /^([\d\.]+)\%$/;
  var angleMap = {
    'top': 0,
    'bottom': 180,
    'right': 90,
    'left': 270
  };

  if (def.length < 2) throw 'Invalid definition: ' + def;

  var angle = undefined,
      stops = undefined;

  if (def.length === 2) {
    stops = def;
    angle = 180;
  } else {
    stops = def.slice(1);
    var match = def[0].match(regexAngle);

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
      var dir = (match[2] || match[3]).split(' ');

      angle = angleMap[dir[1]];

      if (dir[2] === 'top') {
        angle += 45;
      } else if (dir[2] === 'bottom') {
        angle -= 45;
      }
    }
  }

  if (stops.length < 2) throw 'Invalid stops: ' + def;

  var globalPosition = 0;
  var interval = 1 / (stops.length - 1);

  stops = stops.map(function (stop, i) {
    var split = stop.split(' ');
    var color = split[0];
    var position = globalPosition;

    globalPosition += interval;

    if (!(0, _hexColorRegex2['default'])({ 'strict': true }).test(color)) throw 'Invalid stop: ' + stop;

    if (split[1]) {
      var match = split[1].match(regexPosition);
      if (match) {
        position = match[1] / 100;
      }
    }

    position = parseFloat(position.toFixed(8));

    return {
      'color': color,
      'position': position
    };
  });

  return {
    'angle': angle,
    'stops': stops
  };
}

exports['default'] = function (input) {
  // Output should conform to the following:
  // [{type, angle, repeating, stops: [{color, position}, {color, position}+]}+]
  // type is either "linear" or "radial"
  // angle is an integer from 0 to 359
  // color is a hex value
  // position is a float between 0 and 1
  // repeating is a boolean

  var gradient = {};
  var regex = /^(linear|radial)\-gradient\((.*)\);?$/;

  var match = input.match(regex);

  if (!match || match.length !== 3) throw 'Invalid input: ' + input;

  var type = match[1];
  var def = match[2].split(',').map(function (s) {
    return s.trim();
  });
  var pdef = undefined;

  if (type === 'linear') {
    pdef = parseLinearGradient(def);
  } else {
    'Gradient type not supported: ' + type;
  }

  gradient.angle = pdef.angle;
  gradient.stops = pdef.stops;
  gradient.type = type;
  gradient.repeating = false;

  return [gradient];
};

;
module.exports = exports['default'];

},{"hex-color-regex":8}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utils = require('./utils');

var SVG_NS = 'http://www.w3.org/2000/svg';
var document = global.document;

var svgSupport = !!document.createElementNS(SVG_NS, 'svg').createSVGRect;

exports['default'] = function (gradients) {
  if (!svgSupport) {
    return function () {
      throw 'Client does not support SVG.';
    };
  }

  if (!gradients.length) throw 'No gradients supplied';

  return function (svg) {
    if (!svg) throw 'SVG reference not supplied';
    if (!svg.width || !svg.height || !svg.viewBox) throw 'No SVG dimensions available';

    var gradient = gradients[0];
    var id = 'grady-' + Number(new Date()).toString(36);

    var aspectRatio = 1;
    var retval = undefined;

    if (svg.width && svg.height) {
      aspectRatio = svg.width / svg.height;
    } else if (svg.viewBox) {
      var viewBox = svg.viewBox.split(' ').map(Number);
      // assumes min-x and min-y are 0
      aspectRatio = viewBox[2] / viewBox[3];
    }

    if (gradient.type === 'linear') {
      (function () {
        var angle = gradient.angle;
        var coords = (0, _utils.endPointsFromAngle)(angle, 1, 1);

        var lg = document.createElementNS(SVG_NS, 'linearGradient');
        lg.setAttribute('id', id);
        lg.setAttribute('x1', coords[0]);
        lg.setAttribute('x2', coords[2]);
        lg.setAttribute('y1', coords[1]);
        lg.setAttribute('y2', coords[3]);

        gradient.stops.forEach(function (stop) {
          var el = document.createElementNS(SVG_NS, 'stop');
          el.setAttribute('offset', stop.position);
          el.setAttribute('stop-color', stop.color);
          lg.appendChild(el);
        });

        retval = lg;
      })();
    }

    return retval;
  };
};

;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":7}],7:[function(require,module,exports){
//Ported from Chromium
//todo: simplify + optimize
//todo: jsdoc
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.endPointsFromAngle = endPointsFromAngle;

function endPointsFromAngle(angle, width, height) {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  var rad = angle * (Math.PI / 180);

  var x1 = undefined,
      y1 = undefined,
      x2 = undefined,
      y2 = undefined;

  if (angle === 0) {
    x1 = 0;
    y1 = height;
    x2 = 0;
    y2 = 0;
  } else if (angle === 90) {
    x1 = 0;
    y1 = 0;
    x2 = width;
    y2 = 0;
  } else if (angle === 180) {
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = height;
  } else if (angle === 270) {
    x1 = width;
    y1 = 0;
    x2 = 0;
    y2 = 0;
  } else {
    var slope = Math.tan((90 - angle) * (Math.PI / 180));
    var pslope = -1 / slope;
    var midx = width / 2;
    var midy = height / 2;

    var corner = undefined;

    if (angle < 90) {
      corner = [midx, midy];
    } else if (angle < 180) {
      corner = [midx, -midy];
    } else if (angle < 270) {
      corner = [-midx, -midy];
    } else {
      corner = [-midx, midy];
    }

    var intercept = corner[1] - pslope * corner[0];
    var endx = intercept / (slope - pslope);
    var endy = pslope * endx + intercept;

    x1 = midx - endx;
    y1 = midy + endy;
    x2 = midx + endx;
    y2 = midy - endy;
  }

  return [x1, y1, x2, y2];
}

;

},{}],8:[function(require,module,exports){
/*!
 * hex-color-regex <https://github.com/regexps/hex-color-regex>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

module.exports = function hexColorRegex (opts) {
  opts = opts && typeof opts === 'object' ? opts : {}

  return opts.strict ? /^#([a-f0-9]{6}|[a-f0-9]{3})\b$/i : /#([a-f0-9]{6}|[a-f0-9]{3})\b/gi
}

},{}]},{},[4])(4)
});