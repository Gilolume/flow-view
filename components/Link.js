'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inferno = require('inferno');

var _inferno2 = _interopRequireDefault(_inferno);

var _infernoComponent = require('inferno-component');

var _infernoComponent2 = _interopRequireDefault(_infernoComponent);

var _ignoreEvent = require('../utils/ignoreEvent');

var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


var createVNode = _inferno2.default.createVNode;

var Link = function (_Component) {
  _inherits(Link, _Component);

  function Link() {
    _classCallCheck(this, Link);

    return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
  }

  _createClass(Link, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          deleteLink = _props.deleteLink,
          from = _props.from,
          onCreateLink = _props.onCreateLink,
          startDraggingLinkTarget = _props.startDraggingLinkTarget,
          selected = _props.selected,
          selectLink = _props.selectLink,
          sourceSelected = _props.sourceSelected,
          targetSelected = _props.targetSelected,
          theme = _props.theme,
          to = _props.to,
          x1 = _props.x1,
          y1 = _props.y1,
          x2 = _props.x2,
          y2 = _props.y2;
      var darkPrimaryColor = theme.darkPrimaryColor,
          primaryColor = theme.primaryColor,
          linkColor = theme.linkColor,
          lineWidth = theme.lineWidth,
          pinSize = theme.pinSize;


      var onSourceMouseDown = function onSourceMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        onCreateLink({ from: from, to: null });
      };

      var onTargetMouseDown = function onTargetMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        startDraggingLinkTarget(id);
      };

      var startX = x1 + pinSize / 2;
      var startY = y1 + pinSize / 2;
      var endX = x2 + pinSize / 2;
      var endY = y2 + pinSize / 2;

      var midPointY = (startY + endY) / 2;

      var controlPointX1 = startX;
      var controlPointY1 = to ? midPointY : startY;
      var controlPointX2 = endX;
      var controlPointY2 = to ? midPointY : endY;

      return createVNode(2, 'g', null, [createVNode(2, 'path', {
        'd': 'M ' + startX + ' ' + startY + ' C ' + controlPointX1 + ' ' + controlPointY1 + ', ' + controlPointX2 + ' ' + controlPointY2 + ' ,' + endX + ' ' + endY,
        'fill': 'transparent',
        'stroke': selected ? primaryColor : linkColor,
        'strokeWidth': lineWidth
      }, null, {
        'onMouseDown': function onMouseDown() {
          if (selected) deleteLink(id);
        },
        'onMouseUp': selectLink
      }), createVNode(2, 'rect', {
        'fill': selected || sourceSelected ? darkPrimaryColor : linkColor,
        'height': pinSize,
        'width': pinSize,
        'x': x1,
        'y': y1
      }, null, {
        'onMouseDown': onSourceMouseDown
      }), to ? createVNode(2, 'rect', {
        'fill': selected || targetSelected ? darkPrimaryColor : linkColor,
        'height': pinSize,
        'width': pinSize,
        'x': x2,
        'y': y2
      }, null, {
        'onMouseDown': onTargetMouseDown
      }) : null], {
        'onClick': _ignoreEvent2.default,
        'onDoubleClick': _ignoreEvent2.default
      });
    }
  }]);

  return Link;
}(_infernoComponent2.default);

exports.default = Link;