'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inferno = require('inferno');

var _inferno2 = _interopRequireDefault(_inferno);

var _infernoComponent = require('inferno-component');

var _infernoComponent2 = _interopRequireDefault(_infernoComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


var hidden = { display: 'none', overflow: 'hidden' };
var visible = { display: 'inline', overflow: 'visible' };

var createVNode = _inferno2.default.createVNode;

var Selector = function (_Component) {
  _inherits(Selector, _Component);

  function Selector(props) {
    _classCallCheck(this, Selector);

    var _this = _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this, props));

    _this.state = { text: '' };
    return _this;
  }

  _createClass(Selector, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          createNode = _props.createNode,
          height = _props.height,
          nodeList = _props.nodeList,
          pointer = _props.pointer,
          show = _props.show,
          width = _props.width;


      var text = this.state.text;

      var onChange = function onChange(e) {
        var text = e.target.value;

        _this2.setState({ text: text });
      };

      var onKeyPress = function onKeyPress(e) {
        var text = e.target.value.trim();
        var pointer = _this2.props.pointer;

        var pressedEnter = e.key === 'Enter';
        var textIsNotBlank = text.length > 0;

        if (pressedEnter) {
          if (textIsNotBlank) {
            createNode({
              ins: [],
              outs: [],
              text: text,
              x: pointer.x,
              y: pointer.y
            });
          }

          _this2.setState({ text: '' });
        }
      };

      return createVNode(2, 'foreignObject', {
        'height': height,
        'style': show ? visible : hidden,
        'width': width,
        'x': pointer ? pointer.x : 0,
        'y': pointer ? pointer.y : 0
      }, [createVNode(512, 'input', {
        'list': 'nodes',
        'type': 'text',
        'style': { outline: 'none' },
        'value': text
      }, null, {
        'onChange': onChange,
        'onKeyPress': onKeyPress
      }, null, function (input) {
        if (input !== null) input.focus();
      }), nodeList ? createVNode(2, 'datalist', {
        'id': 'nodes'
      }, nodeList.map(function (item, i) {
        return createVNode(2, 'option', {
          'value': item
        }, null, null, i);
      }), {
        'onChange': onChange
      }) : null]);
    }
  }]);

  return Selector;
}(_infernoComponent2.default);

exports.default = Selector;