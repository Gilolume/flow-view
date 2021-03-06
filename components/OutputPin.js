'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

var _Pin = require('./Pin');

var _Pin2 = _interopRequireDefault(_Pin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OutputPin = function (_React$Component) {
  _inherits(OutputPin, _React$Component);

  function OutputPin() {
    var _this;

    _classCallCheck(this, OutputPin);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (OutputPin.__proto__ || Object.getPrototypeOf(OutputPin)).call(this)), _this), 'onMouseDown');
    return _this;
  }

  _createClass(OutputPin, [{
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      var _props = this.props,
          createLink = _props.createLink,
          nodeIdAndPinPosition = _props.nodeIdAndPinPosition;


      createLink({ from: nodeIdAndPinPosition });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Pin2.default, _extends({}, this.props, {
        onMouseDown: this.onMouseDown
      }));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _props2 = this.props,
          color = _props2.color,
          x = _props2.x,
          y = _props2.y;


      var colorChanged = color !== nextProps.color;
      var positionChanged = x !== nextProps.x || y !== nextProps.y;

      return colorChanged || positionChanged;
    }
  }]);

  return OutputPin;
}(_react2.default.Component);

OutputPin.defaultProps = {
  createLink: Function.prototype
};
exports.default = OutputPin;