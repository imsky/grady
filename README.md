# Grady

Grady creates gradients in CSS, SVG, and Canvas format from a standard syntax.

## Installing

* [npm](https://www.npmjs.com/package/grady): `npm install grady`
* RawGit: <https://cdn.rawgit.com/imsky/grady/master/grady.js>

## Usage

Include `grady.js` in your HTML:

```html
<script src="grady.js"></script>
```

Create a gradient with Grady using the standard syntax:

```js
var gradient = 'linear-gradient(to top right, #24c6dc, #514a9d)';
var grady = Grady(gradient);
var css = grady.css();
var svg = grady.svg();
var canvas = grady.canvas(300, 200);
```

## Browser support

* SVG: <http://caniuse.com/#search=svg>
* Canvas: <http://caniuse.com/#search=canvas>
* CSS: <http://caniuse.com/#search=gradient>
* Prefixed CSS:
  * Firefox: 3.6+
  * Webkit: Chrome 10+, Android 4.3-, iOS 6.1-, Safari 6
  * Opera: 11.10+

## License

Grady is provided under the [MIT license](http://opensource.org/licenses/MIT).

## Credits

Grady is a project by [Ivan Malopinsky](http://imsky.co).