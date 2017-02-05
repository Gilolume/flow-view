'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inferno = require('inferno');

var _inferno2 = _interopRequireDefault(_inferno);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _notDefined = require('not-defined');

var _notDefined2 = _interopRequireDefault(_notDefined);

var _Frame = require('./components/Frame');

var _Frame2 = _interopRequireDefault(_Frame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars

var randomString = require('./utils/randomString')(3);

var createVNode = _inferno2.default.createVNode;

var Canvas = function (_EventEmitter) {
  _inherits(Canvas, _EventEmitter);

  function Canvas(containerId, options) {
    _classCallCheck(this, Canvas);

    var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));

    _this.container = null;

    // Check that containerId is a string.
    if (typeof containerId !== 'string') {
      throw new TypeError('containerId must be a string', containerId);
    }

    // If we are in browser context, get the document element containing
    // the canvas or create it.
    if (typeof document !== 'undefined') {
      var container = document.getElementById(containerId);

      if (container === null) {
        container = document.createElement('div');
        container.id = containerId;

        container.setAttribute('style', 'display: inline-block; height: 400px; width: 100%;');

        document.body.appendChild(container);
      }

      _this.container = container;

      _this.options = options;
    }
    return _this;
  }

  /**
   * Render to SVG.
   *
   * @param {Object} view
   * @param {Object} [model]
   * @param {Function} [callback] run server side
   */

  _createClass(Canvas, [{
    key: 'render',
    value: function render(view, model, callback) {
      var _this2 = this;

      var container = this.container;

      var custom = this.options;

      var height = void 0;
      var width = void 0;

      // Get height and width from container, if any.
      if (container) {
        var border = 1; // TODO could be configurable in style prop
        var rect = container.getBoundingClientRect();

        height = rect.height - 2 * border;
        width = rect.width - 2 * border;
      }

      view = Object.assign({}, {
        height: height,
        link: {},
        node: {},
        width: width
      }, view);

      var createInputPin = function createInputPin(nodeId, pin) {
        var ins = view.node[nodeId].ins;

        if ((0, _notDefined2.default)(ins)) view.node[nodeId].ins = ins = [];

        var position = ins.length;

        if ((0, _notDefined2.default)(pin)) pin = 'in' + position;

        _this2.emit('createInputPin', nodeId, position, pin);

        view.node[nodeId].ins.push(pin);
      };

      var createOutputPin = function createOutputPin(nodeId, pin) {
        var outs = view.node[nodeId].outs;

        if ((0, _notDefined2.default)(outs)) view.node[nodeId].outs = outs = [];

        var position = outs.length;

        if ((0, _notDefined2.default)(pin)) pin = 'out' + position;

        _this2.emit('createOutputPin', nodeId, position, pin);

        view.node[nodeId].outs.push(pin);
      };

      var selectLink = function selectLink(id) {
        _this2.emit('selectLink', id);
      };

      var selectNode = function selectNode(id) {
        _this2.emit('selectNode', id);
      };

      function generateId() {
        var id = randomString();

        return view.link[id] || view.node[id] ? generateId() : id;
      }

      var createLink = function createLink(link) {
        var from = link.from;
        var to = link.to;

        var id = generateId();

        // Do not fire createLink event if it is a dragging link.
        if ((0, _notDefined2.default)(to)) {
          view.link[id] = { from: from };
        } else {
          view.link[id] = { from: from, to: to };

          _this2.emit('createLink', { from: from, to: to }, id);
        }

        return id;
      };

      var createNode = function createNode(node) {
        var id = generateId();

        view.node[id] = node;

        _this2.emit('createNode', node, id);

        return id;
      };

      var deleteLink = function deleteLink(id) {
        _this2.emit('deleteLink', id);

        delete view.link[id];
      };

      var deleteNode = function deleteNode(id) {
        // delete links connected to given node.
        Object.keys(view.link).forEach(function (linkId) {
          var from = view.link[linkId].from;
          var to = view.link[linkId].to;

          if (from && from[0] === id) {
            deleteLink(linkId);
          }

          if (to && to[0] === id) {
            deleteLink(linkId);
          }
        });

        delete view.node[id];

        _this2.emit('deleteNode', id);
      };

      var dragItems = function dragItems(dragginDelta, draggedItems) {
        Object.keys(view.node).filter(function (id) {
          return draggedItems.indexOf(id) > -1;
        }).forEach(function (id) {
          view.node[id].x += dragginDelta.x;
          view.node[id].y += dragginDelta.y;
        });
      };

      var deleteInputPin = function deleteInputPin(nodeId, position) {
        var ins = view.node[nodeId].ins;

        if ((0, _notDefined2.default)(ins)) return;
        if (ins.length === 0) return;

        if ((0, _notDefined2.default)(position)) position = ins.length - 1;

        // Look for connected links and delete them.

        Object.keys(view.link).forEach(function (id) {
          var to = view.link[id].to;

          if ((0, _notDefined2.default)(to)) return;

          if (to[0] === nodeId && to[1] === position) {
            deleteLink(id);
          }
        });

        _this2.emit('deleteInputPin', nodeId, position);

        view.node[nodeId].ins.splice(position, 1);
      };

      var endDragging = function endDragging(selectNodes) {
        var nodesCoordinates = {};

        selectNodes.forEach(function (id) {
          nodesCoordinates.id = {};
          nodesCoordinates.id.x = view.node[id].x;
          nodesCoordinates.id.y = view.node[id].y;
        });

        _this2.emit('endDragging', nodesCoordinates);
      };

      var deleteOutputPin = function deleteOutputPin(nodeId, position) {
        var outs = view.node[nodeId].outs;

        if ((0, _notDefined2.default)(outs)) return;
        if (outs.length === 0) return;

        if ((0, _notDefined2.default)(position)) position = outs.length - 1;

        // Look for connected links and delete them.

        Object.keys(view.link).forEach(function (id) {
          var from = view.link[id].from;

          if ((0, _notDefined2.default)(from)) return;

          if (from[0] === nodeId && from[1] === position) {
            deleteLink(id);
          }
        });

        _this2.emit('deleteOutputPin', nodeId, position);

        view.node[nodeId].outs.splice(position, 1);
      };

      // TODO this is not used buy now.
      var renameNode = function renameNode(nodeId, text) {
        view.node[nodeId].text = text;
      };

      var updateLink = function updateLink(id, link) {
        var to = link.to;
        var from = link.from;

        // Trigger a createLink event if it is a connected link.
        if ((0, _notDefined2.default)(from)) {
          view.link[id].to = to;

          _this2.emit('createLink', view.link[id], id);
        }
      };

      var component = createVNode(16, _Frame2.default, {
        'container': container,
        'createInputPin': createInputPin,
        'createOutputPin': createOutputPin,
        'createLink': createLink,
        'createNode': createNode,
        'custom': custom,
        'deleteLink': deleteLink,
        'deleteInputPin': deleteInputPin,
        'deleteNode': deleteNode,
        'deleteOutputPin': deleteOutputPin,
        'dragItems': dragItems,
        'endDragging': endDragging,
        'model': model,
        'renameNode': renameNode,
        'selectLink': selectLink,
        'selectNode': selectNode,
        'updateLink': updateLink,
        'view': view
      });

      if (container) {
        // Client side rendering.
        _inferno2.default.render(component, container);
      } else {
        // Server side rendering.
        var jsx = createVNode(16, _Frame2.default, {
          'custom': custom,
          'view': view
        });

        var outputSVG = require('svgx')(require('inferno-server').renderToString)(jsx, { doctype: true, xmlns: true });

        if (typeof callback === 'function') {
          callback(null, outputSVG);
        }
      }
    }
  }]);

  return Canvas;
}(_events2.default);

exports.default = Canvas;