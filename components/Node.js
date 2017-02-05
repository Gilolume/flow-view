'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inferno = require('inferno');

var _inferno2 = _interopRequireDefault(_inferno);

var _infernoComponent = require('inferno-component');

var _infernoComponent2 = _interopRequireDefault(_infernoComponent);

var _notDefined = require('not-defined');

var _notDefined2 = _interopRequireDefault(_notDefined);

var _computeNodeWidth = require('../utils/computeNodeWidth');

var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

var _ignoreEvent = require('../utils/ignoreEvent');

var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

var _xOfPin = require('../utils/xOfPin');

var _xOfPin2 = _interopRequireDefault(_xOfPin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


var minus = function minus(pinSize) {
  return 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' Z';
};

var plus = function plus(pinSize) {
  return 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z';
};

var createVNode = _inferno2.default.createVNode;

var Node = function (_Component) {
  _inherits(Node, _Component);

  function Node() {
    _classCallCheck(this, Node);

    return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
  }

  _createClass(Node, [{
    key: 'getBody',
    value: function getBody() {
      var _props = this.props,
          theme = _props.theme,
          text = _props.text;
      var fontSize = theme.fontSize,
          pinSize = theme.pinSize;


      var bodyHeight = this.getBodyHeight();

      // Heuristic value, based on Courier font.
      var margin = fontSize * 0.2;

      return createVNode(2, 'text', {
        'x': pinSize,
        'y': bodyHeight + pinSize - margin
      }, createVNode(2, 'tspan', null, text));
    }
  }, {
    key: 'getBodyHeight',
    value: function getBodyHeight() {
      var _props2 = this.props,
          bodyHeight = _props2.bodyHeight,
          theme = _props2.theme;


      return bodyHeight || theme.nodeBodyHeight;
    }
  }, {
    key: 'getComputedWidth',
    value: function getComputedWidth() {
      var _props3 = this.props,
          ins = _props3.ins,
          outs = _props3.outs,
          text = _props3.text,
          theme = _props3.theme,
          width = _props3.width;
      var fontSize = theme.fontSize,
          pinSize = theme.pinSize;


      var bodyHeight = this.getBodyHeight();

      var computedWidth = (0, _computeNodeWidth2.default)({
        bodyHeight: bodyHeight,
        pinSize: pinSize,
        fontSize: fontSize,
        node: { ins: ins, outs: outs, text: text, width: width }
      });

      return computedWidth;
    }
  }, {
    key: 'getDeleteButton',
    value: function getDeleteButton() {
      var _props4 = this.props,
          deleteNode = _props4.deleteNode,
          id = _props4.id,
          multiSelection = _props4.multiSelection,
          selected = _props4.selected,
          theme = _props4.theme;
      var primaryColor = theme.primaryColor,
          pinSize = theme.pinSize;


      if (selected === false || multiSelection) return null;

      return createVNode(2, 'path', {
        'd': 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
        'fill': primaryColor,
        'transform': 'translate(' + pinSize / 2 + ',' + pinSize / 2 + ') rotate(45) translate(' + -3 * pinSize / 2 + ',' + pinSize / 2 + ')'
      }, null, {
        'onMouseDown': function onMouseDown() {
          return deleteNode(id);
        }
      });
    }
  }, {
    key: 'getInputMinus',
    value: function getInputMinus() {
      var _props5 = this.props,
          deleteInputPin = _props5.deleteInputPin,
          id = _props5.id,
          ins = _props5.ins,
          multiSelection = _props5.multiSelection,
          selected = _props5.selected,
          theme = _props5.theme;
      var primaryColor = theme.primaryColor,
          pinSize = theme.pinSize;


      if ((0, _notDefined2.default)(ins) || selected === false || multiSelection) return null;

      var computedWidth = this.getComputedWidth();
      var disabled = ins.length === 0;

      return createVNode(2, 'path', {
        'd': minus(pinSize),
        'fill': disabled ? 'transparent' : primaryColor,
        'stroke': primaryColor,
        'transform': 'translate(' + (computedWidth + 2) + ',0)'
      }, null, {
        'onMouseDown': function onMouseDown() {
          if (disabled) return;else deleteInputPin(id);
        }
      });
    }
  }, {
    key: 'getInputPlus',
    value: function getInputPlus() {
      var _props6 = this.props,
          createInputPin = _props6.createInputPin,
          id = _props6.id,
          ins = _props6.ins,
          multiSelection = _props6.multiSelection,
          selected = _props6.selected,
          theme = _props6.theme;
      var primaryColor = theme.primaryColor,
          pinSize = theme.pinSize;


      if ((0, _notDefined2.default)(ins) || selected === false || multiSelection) return null;

      var computedWidth = this.getComputedWidth();

      return createVNode(2, 'path', {
        'd': plus(pinSize),
        'fill': primaryColor,
        'stroke': primaryColor,
        'transform': 'translate(' + (computedWidth + 4 + pinSize) + ',0)'
      }, null, {
        'onMouseDown': function onMouseDown() {
          return createInputPin(id);
        }
      });
    }
  }, {
    key: 'getOutputMinus',
    value: function getOutputMinus() {
      var _props7 = this.props,
          deleteOutputPin = _props7.deleteOutputPin,
          id = _props7.id,
          multiSelection = _props7.multiSelection,
          outs = _props7.outs,
          selected = _props7.selected,
          theme = _props7.theme;
      var primaryColor = theme.primaryColor,
          pinSize = theme.pinSize;


      if ((0, _notDefined2.default)(outs) || selected === false || multiSelection) return null;

      var bodyHeight = this.getBodyHeight();
      var computedWidth = this.getComputedWidth();
      var disabled = outs.length === 0;

      return createVNode(2, 'path', {
        'd': minus(pinSize),
        'fill': disabled ? 'transparent' : primaryColor,
        'stroke': primaryColor,
        'transform': 'translate(' + (computedWidth + 2) + ',' + (bodyHeight + pinSize) + ')'
      }, null, {
        'onMouseDown': function onMouseDown() {
          if (disabled) return;else deleteOutputPin(id);
        }
      });
    }
  }, {
    key: 'getOutputPlus',
    value: function getOutputPlus() {
      var _props8 = this.props,
          createOutputPin = _props8.createOutputPin,
          id = _props8.id,
          multiSelection = _props8.multiSelection,
          outs = _props8.outs,
          selected = _props8.selected,
          theme = _props8.theme;
      var primaryColor = theme.primaryColor,
          pinSize = theme.pinSize;


      if ((0, _notDefined2.default)(outs) || selected === false || multiSelection) return null;

      var bodyHeight = this.getBodyHeight();
      var computedWidth = this.getComputedWidth();

      return createVNode(2, 'path', {
        'd': plus(pinSize),
        'fill': primaryColor,
        'stroke': primaryColor,
        'transform': 'translate(' + (computedWidth + 4 + pinSize) + ',' + (bodyHeight + pinSize) + ')'
      }, null, {
        'onMouseDown': function onMouseDown() {
          return createOutputPin(id);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props9 = this.props,
          dragging = _props9.dragging,
          draggedLinkId = _props9.draggedLinkId,
          id = _props9.id,
          ins = _props9.ins,
          onCreateLink = _props9.onCreateLink,
          outs = _props9.outs,
          selected = _props9.selected,
          selectNode = _props9.selectNode,
          theme = _props9.theme,
          updateLink = _props9.updateLink,
          x = _props9.x,
          y = _props9.y;
      var darkPrimaryColor = theme.darkPrimaryColor,
          nodeBarColor = theme.nodeBarColor,
          pinColor = theme.pinColor,
          pinSize = theme.pinSize,
          primaryColor = theme.primaryColor;


      var bodyContent = this.getBody();
      var bodyHeight = this.getBodyHeight();
      var computedWidth = this.getComputedWidth();

      return createVNode(2, 'g', {
        'style': {
          cursor: dragging ? 'pointer' : 'default'
        },
        'transform': 'translate(' + x + ',' + y + ')'
      }, [this.getDeleteButton(), this.getInputMinus(), this.getInputPlus(), this.getOutputMinus(), this.getOutputPlus(), createVNode(2, 'rect', {
        'fillOpacity': 0,
        'height': bodyHeight + 2 * pinSize,
        'stroke': selected ? primaryColor : nodeBarColor,
        'strokeWidth': 1,
        'width': computedWidth
      }), createVNode(2, 'rect', {
        'fill': selected ? primaryColor : nodeBarColor,
        'height': pinSize,
        'width': computedWidth
      }), ins && ins.map(function (pin, i, array) {
        var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

        var onMouseUp = function onMouseUp(e) {
          e.preventDefault();
          e.stopPropagation();

          if (draggedLinkId) {
            updateLink(draggedLinkId, { to: [id, i] });
          }
        };

        return createVNode(2, 'rect', {
          'fill': selected ? darkPrimaryColor : pinColor,
          'height': pinSize,
          'transform': 'translate(' + x + ',0)',
          'width': pinSize
        }, null, {
          'onMouseDown': _ignoreEvent2.default,
          'onMouseUp': onMouseUp
        }, i);
      }), bodyContent, createVNode(2, 'rect', {
        'fill': selected ? primaryColor : nodeBarColor,
        'height': pinSize,
        'transform': 'translate(0,' + (pinSize + bodyHeight) + ')',
        'width': computedWidth
      }), outs && outs.map(function (pin, i, array) {
        var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

        var onMouseDown = function onMouseDown(e) {
          e.preventDefault();
          e.stopPropagation();

          onCreateLink({ from: [id, i], to: null });
        };

        return createVNode(2, 'rect', {
          'fill': selected ? darkPrimaryColor : pinColor,
          'height': pinSize,
          'transform': 'translate(' + x + ',' + (pinSize + bodyHeight) + ')',
          'width': pinSize
        }, null, {
          'onClick': _ignoreEvent2.default,
          'onMouseLeave': _ignoreEvent2.default,
          'onMouseDown': onMouseDown
        }, i);
      })], {
        'onDoubleClick': _ignoreEvent2.default,
        'onMouseDown': selectNode
      });
    }
  }]);

  return Node;
}(_infernoComponent2.default);

exports.default = Node;