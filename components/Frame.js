'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

var _notDefined = require('not-defined');

var _notDefined2 = _interopRequireDefault(_notDefined);

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

var _RectangularSelection = require('./RectangularSelection');

var _RectangularSelection2 = _interopRequireDefault(_RectangularSelection);

var _Selector = require('./Selector');

var _Selector2 = _interopRequireDefault(_Selector);

var _computeNodeWidth = require('../utils/computeNodeWidth');

var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

var _randomString = require('../utils/randomString');

var _randomString2 = _interopRequireDefault(_randomString);

var _xOfPin = require('../utils/xOfPin');

var _xOfPin2 = _interopRequireDefault(_xOfPin);

var _theme = require('./theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowViewFrame = function (_React$Component) {
  _inherits(FlowViewFrame, _React$Component);

  function FlowViewFrame(props) {
    var _this;

    _classCallCheck(this, FlowViewFrame);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (FlowViewFrame.__proto__ || Object.getPrototypeOf(FlowViewFrame)).call(this, props)), _this), 'connectLinkToTarget', 'createLink', 'createNode', 'createInputPin', 'createOutputPin', 'deleteInputPin', 'deleteOutputPin', 'deleteLink', 'deleteNode', 'onDocumentKeydown', 'onDocumentKeyup', 'onDoubleClick', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseUp', 'onWindowScroll', 'selectorCreateNode', 'selectItem', 'startDraggingLinkTarget');

    var width = props.width,
        height = props.height,
        view = props.view;


    _this.state = {
      draggedLinkId: null,
      height: height,
      isMouseDown: false,
      isMouseDraggingItems: false,
      offset: { x: 0, y: 0 },
      pointer: null,
      rectangularSelection: null,
      scroll: { x: 0, y: 0 },
      showSelector: false,
      selectedItems: [],
      shiftPressed: false,
      view: view,
      width: width
    };

    _this.nodeRef = {};
    return _this;
  }

  _createClass(FlowViewFrame, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var container = _reactDom2.default.findDOMNode(this).parentNode;

      document.addEventListener('keydown', this.onDocumentKeydown);
      document.addEventListener('keyup', this.onDocumentKeyup);

      window.addEventListener('scroll', this.onWindowScroll);

      var offset = {
        x: container.offsetLeft,
        y: container.offsetTop
      };

      var scroll = {
        x: window.scrollX,
        y: window.scrollY
      };

      this.setState({ offset: offset, scroll: scroll });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.onDocumentKeydown);
      document.removeEventListener('keyup', this.onDocumentKeyup);

      window.removeEventListener('scroll', this.onWindowScroll);
    }
  }, {
    key: 'connectLinkToTarget',
    value: function connectLinkToTarget(linkId, target) {
      var view = Object.assign({}, this.state.view);

      view.link[linkId].to = target;

      this.setState({
        draggedLinkId: null,
        view: view
      });
    }
  }, {
    key: 'coordinatesOfLink',
    value: function coordinatesOfLink(_ref) {
      var from = _ref.from,
          to = _ref.to;
      var theme = this.props.theme;
      var _state = this.state,
          pointer = _state.pointer,
          view = _state.view;


      var fontSize = theme.frame.font.size;

      var nodeBodyHeight = theme.node.body.height;
      var pinSize = theme.node.pin.size;

      var x1 = void 0;
      var y1 = void 0;
      var x2 = void 0;
      var y2 = void 0;

      var nodeIds = Object.keys(view.node);
      var idEquals = function idEquals(x) {
        return function (id) {
          return id === x[0];
        };
      };
      var sourceId = from ? nodeIds.find(idEquals(from)) : null;
      var targetId = to ? nodeIds.find(idEquals(to)) : null;

      var computedWidth = null;

      if (sourceId) {
        var source = view.node[sourceId];

        if ((0, _notDefined2.default)(source.outs)) source.outs = {};

        computedWidth = (0, _computeNodeWidth2.default)({
          bodyHeight: nodeBodyHeight,
          pinSize: pinSize,
          fontSize: fontSize,
          node: source
        });

        x1 = source.x + (0, _xOfPin2.default)(pinSize, computedWidth, source.outs.length, from[1]);
        y1 = source.y + pinSize + nodeBodyHeight;
      }

      if (targetId) {
        var target = view.node[targetId];

        if ((0, _notDefined2.default)(target.ins)) target.ins = {};

        computedWidth = (0, _computeNodeWidth2.default)({
          bodyHeight: nodeBodyHeight,
          pinSize: pinSize,
          fontSize: fontSize,
          node: target
        });

        x2 = target.x + (0, _xOfPin2.default)(pinSize, computedWidth, target.ins.length, to[1]);
        y2 = target.y;
      } else {
        x2 = pointer ? pointer.x - pinSize / 2 : x1;
        y2 = pointer ? pointer.y - pinSize : y1;
      }

      return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }
  }, {
    key: 'createInputPin',
    value: function createInputPin(nodeId, pin) {
      var emit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var view = Object.assign({}, this.state.view);

      var ins = view.node[nodeId].ins || [];

      var position = ins.length;

      var nodeIdAndPinPosition = { nodeId: nodeId, position: position };

      if ((0, _notDefined2.default)(pin)) pin = { name: 'in' + position };

      ins.push(pin);

      view.node[nodeId].ins = ins;

      this.setState({ view: view });

      if (emit) {
        this.props.emit('createInputPin', nodeIdAndPinPosition, pin);
      }

      return Object.assign(pin, nodeIdAndPinPosition);
    }
  }, {
    key: 'createLink',
    value: function createLink(link) {
      var view = Object.assign({}, this.state.view);

      var id = this.generateId();

      var newLink = {};
      newLink[id] = link;

      view.link[id] = link;

      if (link.to) {
        this.setState({
          draggedLinkId: null,
          selectedItems: [],
          view: view
        });
        this.props.emitCreateLink(link, id);
      } else {
        this.setState({
          draggedLinkId: id,
          isMouseDown: true,
          selectedItems: [],
          view: view
        });
      }

      return id;
    }
  }, {
    key: 'createNode',
    value: function createNode(node) {
      var view = Object.assign({}, this.state.view);

      var id = this.generateId();

      view.node[id] = node;

      this.setState({ view: view });

      return id;
    }
  }, {
    key: 'createOutputPin',
    value: function createOutputPin(nodeId, pin) {
      var view = Object.assign({}, this.state.view);

      var outs = view.node[nodeId].outs || [];

      var position = view.node[nodeId].outs.length;

      if ((0, _notDefined2.default)(pin)) pin = 'out' + position;

      outs.push(pin);

      view.node[nodeId].outs = outs;

      this.setState({ view: view });
    }
  }, {
    key: 'deleteInputPin',
    value: function deleteInputPin(nodeId, position) {
      var _this2 = this;

      var view = Object.assign({}, this.state.view);

      var ins = view.node[nodeId].ins;

      if ((0, _notDefined2.default)(ins)) return;
      if (ins.length === 0) return;

      if ((0, _notDefined2.default)(position)) position = ins.length - 1;

      Object.keys(view.link).forEach(function (id) {
        var to = view.link[id].to;

        if ((0, _notDefined2.default)(to)) return;

        if (to[0] === nodeId && to[1] === position) {
          _this2.deleteLink(id);
        }
      });

      view.node[nodeId].ins.splice(position, 1);

      this.setState({ view: view });
    }
  }, {
    key: 'deleteOutputPin',
    value: function deleteOutputPin(nodeId, position) {
      var _this3 = this;

      var view = Object.assign({}, this.state.view);

      var outs = view.node[nodeId].outs;

      if ((0, _notDefined2.default)(outs)) return;
      if (outs.length === 0) return;

      if ((0, _notDefined2.default)(position)) position = outs.length - 1;

      Object.keys(view.link).forEach(function (id) {
        var from = view.link[id].from;

        if ((0, _notDefined2.default)(from)) return;

        if (from[0] === nodeId && from[1] === position) {
          _this3.deleteLink(id);
        }
      });

      view.node[nodeId].outs.splice(position, 1);

      this.setState({ view: view });
    }
  }, {
    key: 'deleteLink',
    value: function deleteLink(id) {
      var view = Object.assign({}, this.state.view);

      delete view.link[id];

      this.setState({ view: view });
    }
  }, {
    key: 'deleteNode',
    value: function deleteNode(id) {
      var _this4 = this;

      var view = Object.assign({}, this.state.view);

      Object.keys(view.link).forEach(function (linkId) {
        var from = view.link[linkId].from;
        var to = view.link[linkId].to;

        if (from && from[0] === id) {
          _this4.deleteLink(linkId);
        }

        if (to && to[0] === id) {
          _this4.deleteLink(linkId);
        }
      });

      delete view.node[id];
      delete this.nodeRef[id];

      this.setState({ view: view });
    }
  }, {
    key: 'dragItems',
    value: function dragItems(dragginDelta, draggedItems) {
      var view = Object.assign({}, this.state.view);

      Object.keys(view.node).filter(function (id) {
        return draggedItems.indexOf(id) > -1;
      }).forEach(function (id) {
        view.node[id].x += dragginDelta.x;
        view.node[id].y += dragginDelta.y;
      });

      this.setState({ view: view });
    }
  }, {
    key: 'emitUpdateNodesGeometry',
    value: function emitUpdateNodesGeometry() {
      this.props.emit('updateNodeGeometry', this.selectedNodes());
    }
  }, {
    key: 'generateId',
    value: function generateId() {
      var view = this.state.view;


      var id = (0, _randomString2.default)(3);

      return view.link[id] || view.node[id] ? this.generateId() : id;
    }
  }, {
    key: 'getCoordinates',
    value: function getCoordinates(event) {
      var _state2 = this.state,
          offset = _state2.offset,
          scroll = _state2.scroll;


      return {
        x: event.clientX - offset.x + scroll.x,
        y: event.clientY - offset.y + scroll.y
      };
    }
  }, {
    key: 'onDocumentKeydown',
    value: function onDocumentKeydown(event) {
      var _this5 = this;

      var code = event.code;
      var _state3 = this.state,
          selectedItems = _state3.selectedItems,
          shiftPressed = _state3.shiftPressed,
          view = _state3.view;


      var isArrowCode = code.substring(0, 5) === 'Arrow';

      var selectedLinks = this.selectedLinks();
      var thereAreSelectedLinks = selectedLinks.length > 0;

      var selectedNodeIds = this.selectedNodeIds();
      var thereAreSelectedNodes = selectedNodeIds.length > 0;

      var draggingDelta = { x: 0, y: 0 };
      var unit = shiftPressed ? 1 : 10;

      switch (code) {
        case 'ArrowDown':
          if (thereAreSelectedNodes) draggingDelta.y = unit;
          break;

        case 'ArrowLeft':
          if (thereAreSelectedNodes) draggingDelta.x = -unit;
          break;

        case 'ArrowRight':
          if (thereAreSelectedNodes) draggingDelta.x = unit;
          break;

        case 'ArrowUp':
          if (thereAreSelectedNodes) draggingDelta.y = -unit;
          break;

        case 'Backspace':
          if (thereAreSelectedLinks) {
            selectedLinks.forEach(this.deleteLink);
          }

          if (thereAreSelectedNodes) {
            selectedNodeIds.forEach(this.deleteNode);
          }

          break;

        case 'Escape':
          this.setState({ selectedItems: [] });
          break;

        case 'KeyI':
          selectedItems.forEach(function (id) {
            if (view.node[id] && view.node[id].ins) {
              if (shiftPressed) {
                _this5.deleteInputPin(id);
              } else {
                _this5.createInputPin(id);
              }
            }
          });
          break;

        case 'KeyO':
          selectedItems.forEach(function (id) {
            if (view.node[id] && view.node[id].outs) {
              if (shiftPressed) {
                _this5.deleteOutputPin(id);
              } else {
                _this5.createOutputPin(id);
              }
            }
          });
          break;

        case 'ShiftLeft':
        case 'ShiftRight':
          this.setState({ shiftPressed: true });

          break;

        default:
          break;
      }

      if (thereAreSelectedNodes && isArrowCode) {
        this.dragItems(draggingDelta, selectedNodeIds);

        if (!shiftPressed) this.emitUpdateNodesGeometry();
      }
    }
  }, {
    key: 'onDocumentKeyup',
    value: function onDocumentKeyup(event) {
      var code = event.code;


      var selectedNodeIds = this.selectedNodeIds();
      var thereAreSelectedNodes = selectedNodeIds.length > 0;

      switch (code) {
        case 'ShiftLeft':
        case 'ShiftRight':
          if (thereAreSelectedNodes) this.emitUpdateNodesGeometry();

          this.setState({ shiftPressed: false });

          break;

        default:
          break;
      }
    }
  }, {
    key: 'onDoubleClick',
    value: function onDoubleClick(event) {
      event.preventDefault();
      event.stopPropagation();

      var pointer = this.getCoordinates(event);

      this.setState({
        pointer: pointer,
        showSelector: true
      });
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      var pointer = this.getCoordinates(event);

      this.setState({
        isMouseDown: true,
        rectangularSelection: {
          x: pointer.x,
          y: pointer.y,
          height: 0,
          width: 0
        },
        selectedItems: [],
        showSelector: false
      });
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(event) {
      event.stopPropagation();
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(event) {
      event.preventDefault();
      event.stopPropagation();

      var _state4 = this.state,
          draggedLinkId = _state4.draggedLinkId,
          view = _state4.view;


      var link = Object.assign({}, view.link);

      if (draggedLinkId) delete link[draggedLinkId];

      this.setState({
        draggedLinkId: null,
        isMouseDown: false,
        rectangularSelection: null,
        view: Object.assign({}, view, { link: link })
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(event) {
      event.preventDefault();
      event.stopPropagation();

      var _state5 = this.state,
          isMouseDown = _state5.isMouseDown,
          pointer = _state5.pointer,
          rectangularSelection = _state5.rectangularSelection,
          selectedItems = _state5.selectedItems;


      if (!isMouseDown) return;

      var nextPointer = this.getCoordinates(event);

      var draggingDelta = {
        x: pointer ? nextPointer.x - pointer.x : 0,
        y: pointer ? nextPointer.y - pointer.y : 0
      };

      if (selectedItems.length > 0) {
        this.dragItems(draggingDelta, selectedItems);
      }

      if (rectangularSelection) {
        this.setState({
          pointer: nextPointer,
          rectangularSelection: Object.assign({}, rectangularSelection, {
            height: nextPointer.y - rectangularSelection.y,
            width: nextPointer.x - rectangularSelection.x
          })
        });
      } else {
        this.setState({
          isMouseDraggingItems: true,
          pointer: nextPointer
        });
      }
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(event) {
      event.preventDefault();
      event.stopPropagation();

      var _state6 = this.state,
          draggedLinkId = _state6.draggedLinkId,
          rectangularSelection = _state6.rectangularSelection;


      var view = Object.assign({}, this.state.view);

      if (draggedLinkId) {
        delete view.link[draggedLinkId];

        this.setState({
          draggedLinkId: null,
          isMouseDown: false,
          pointer: null,
          rectangularSelection: null,
          selectedItems: [],
          view: Object.assign({}, view)
        });

        return;
      }

      var isInside = function isInside(rectangularSelection) {
        return function (x, y) {
          var boundsX = rectangularSelection.width >= 0 ? rectangularSelection.x : rectangularSelection.x + rectangularSelection.width;
          var boundsY = rectangularSelection.height >= 0 ? rectangularSelection.y : rectangularSelection.y + rectangularSelection.height;

          return x >= boundsX && x <= boundsX + rectangularSelection.width && y >= boundsY && y <= boundsY + rectangularSelection.height;
        };
      };

      if (rectangularSelection) {
        var _selectedItems = [];

        Object.keys(view.node).forEach(function (nodeId) {
          var _view$node$nodeId = view.node[nodeId],
              x = _view$node$nodeId.x,
              y = _view$node$nodeId.y;

          var nodeIsInside = isInside(rectangularSelection)(x, y);

          if (nodeIsInside) {
            _selectedItems.push(nodeId);
          }
        });

        this.setState({
          draggedLinkId: null,
          isMouseDown: false,
          pointer: null,
          selectedItems: _selectedItems,
          rectangularSelection: null
        });

        return;
      }

      var selectedNodeIds = this.selectedNodeIds();
      var thereAreSelectedNodes = selectedNodeIds.length > 0;

      if (thereAreSelectedNodes) this.emitUpdateNodesGeometry();

      this.setState({
        draggedLinkId: null,
        isMouseDown: false,
        isMouseDraggingItems: false,
        pointer: null
      });
    }
  }, {
    key: 'onWindowScroll',
    value: function onWindowScroll() {
      var scroll = {
        x: window.scrollX,
        y: window.scrollY
      };

      this.setState({ scroll: scroll });
    }
  }, {
    key: 'selectedLinks',
    value: function selectedLinks() {
      var _state7 = this.state,
          view = _state7.view,
          selectedItems = _state7.selectedItems;


      var selectedLinks = Object.keys(view.link).filter(function (id) {
        return selectedItems.indexOf(id) > -1;
      });

      return selectedLinks;
    }
  }, {
    key: 'selectedNodeIds',
    value: function selectedNodeIds() {
      var _state8 = this.state,
          view = _state8.view,
          selectedItems = _state8.selectedItems;


      var selectedNodeIds = Object.keys(view.node).filter(function (id) {
        return selectedItems.indexOf(id) > -1;
      });

      return selectedNodeIds;
    }
  }, {
    key: 'selectedNodes',
    value: function selectedNodes() {
      var view = this.state.view;


      var selectedNodes = {};

      var selectedNodeIds = this.selectedNodeIds();

      selectedNodeIds.forEach(function (id) {
        selectedNodes[id] = Object.assign({}, view.node[id]);
      });

      return selectedNodes;
    }
  }, {
    key: 'selectorCreateNode',
    value: function selectorCreateNode(node) {
      var id = this.createNode(node);

      this.setState({
        selectedItems: [id],
        showSelector: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _props = this.props,
          getTypeOfNode = _props.getTypeOfNode,
          nodeComponent = _props.nodeComponent,
          nodeList = _props.nodeList,
          theme = _props.theme;
      var _state9 = this.state,
          draggedLinkId = _state9.draggedLinkId,
          height = _state9.height,
          pointer = _state9.pointer,
          rectangularSelection = _state9.rectangularSelection,
          selectedItems = _state9.selectedItems,
          showSelector = _state9.showSelector,
          view = _state9.view,
          width = _state9.width;


      var backgroundColor = theme.frame.color.background;
      var primaryColor = theme.frame.color.primary;

      var fontFamily = theme.frame.font.family;
      var fontSize = theme.frame.font.size;
      var pinSize = theme.node.pin.size;

      var selectedFirst = function selectedFirst(a, b) {
        var aIsSelected = selectedItems.indexOf(a) > -1;
        var bIsSelected = selectedItems.indexOf(b) > -1;

        if (aIsSelected && bIsSelected) return 0;

        if (aIsSelected) return 1;
        if (bIsSelected) return -1;
      };

      return _react2.default.createElement(
        'svg',
        {
          fontFamily: fontFamily,
          fontSize: fontSize,
          onClick: this.onClick,
          onDoubleClick: this.onDoubleClick,
          onMouseDown: this.onMouseDown,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave,
          onMouseMove: this.onMouseMove,
          onMouseUp: this.onMouseUp,
          textAnchor: 'start',
          style: { backgroundColor: backgroundColor },
          viewBox: '0 0 ' + width + ' ' + height
        },
        rectangularSelection ? _react2.default.createElement(_RectangularSelection2.default, _extends({
          color: primaryColor
        }, rectangularSelection)) : null,
        Object.keys(view.link).map(function (id, i) {
          var _view$link$id = view.link[id],
              from = _view$link$id.from,
              to = _view$link$id.to;


          var coord = _this6.coordinatesOfLink(view.link[id]);
          var sourceSelected = from ? selectedItems.indexOf(from[0]) > -1 : false;
          var targetSelected = to ? selectedItems.indexOf(to[0]) > -1 : false;

          return _react2.default.createElement(_Link2.default, { key: i,
            deleteLink: _this6.deleteLink,
            from: from,
            id: id,
            createLink: _this6.createLink,
            startDraggingLinkTarget: _this6.startDraggingLinkTarget,
            pinSize: pinSize,
            selected: selectedItems.indexOf(id) > -1,
            selectLink: _this6.selectItem(id),
            sourceSelected: sourceSelected,
            targetSelected: targetSelected,
            theme: theme,
            to: to,
            x1: coord.x1,
            y1: coord.y1,
            x2: coord.x2,
            y2: coord.y2
          });
        }),
        Object.keys(view.node).sort(selectedFirst).map(function (id, i) {
          var node = view.node[id];

          var height = node.height,
              ins = node.ins,
              outs = node.outs,
              text = node.text,
              width = node.width,
              x = node.x,
              y = node.y;


          var nodeType = getTypeOfNode(node);
          var Node = nodeComponent[nodeType];

          return _react2.default.createElement(Node, { key: i, ref: function ref(node) {
              _this6.nodeRef[id] = node;
            },
            connectLinkToTarget: _this6.connectLinkToTarget,
            createInputPin: _this6.createInputPin,
            createLink: _this6.createLink,
            createOutputPin: _this6.createOutputPin,
            draggedLinkId: draggedLinkId,
            deleteInputPin: _this6.deleteInputPin,
            deleteNode: _this6.deleteNode,
            deleteOutputPin: _this6.deleteOutputPin,
            height: height,
            id: id,
            ins: ins,
            multiSelection: selectedItems.length > 1,
            outs: outs,
            pinSize: pinSize,
            selected: selectedItems.indexOf(id) > -1,
            selectNode: _this6.selectItem(id),
            text: text,
            theme: theme,
            width: width,
            x: x,
            y: y
          });
        }),
        _react2.default.createElement(_Selector2.default, {
          createNode: this.selectorCreateNode,
          nodeList: nodeList,
          pointer: showSelector ? pointer : null,
          show: showSelector,
          theme: theme
        })
      );
    }
  }, {
    key: 'selectItem',
    value: function selectItem(id) {
      var _this7 = this;

      return function (event) {
        event.preventDefault();
        event.stopPropagation();

        var _state10 = _this7.state,
            draggedLinkId = _state10.draggedLinkId,
            shiftPressed = _state10.shiftPressed;


        var selectedItems = [].concat(_toConsumableArray(_this7.state.selectedItems));
        var view = Object.assign({}, _this7.state.view);

        var pointer = _this7.getCoordinates(event);

        if (draggedLinkId) {
          delete view.link[draggedLinkId];

          _this7.setState({
            draggedLinkId: null,
            view: view
          });

          return;
        }

        var index = selectedItems.indexOf(id);

        var itemAlreadySelected = index > -1;

        if (shiftPressed) {
          if (itemAlreadySelected) {
            selectedItems.splice(index, 1);
          } else {
            selectedItems.push(id);
          }
        } else {
          if (!itemAlreadySelected) {
            selectedItems = [id];
          }
        }

        _this7.setState({
          isMouseDown: true,
          pointer: pointer,
          selectedItems: selectedItems,
          showSelector: false
        });
      };
    }
  }, {
    key: 'startDraggingLinkTarget',
    value: function startDraggingLinkTarget(id) {
      var from = this.state.view.link[id].from;

      this.deleteLink(id);

      var draggedLinkId = this.createLink({ from: from });
      this.setState({ draggedLinkId: draggedLinkId });
    }
  }]);

  return FlowViewFrame;
}(_react2.default.Component);

FlowViewFrame.defaultProps = {
  getTypeOfNode: function getTypeOfNode() {
    return 'DefaultNode';
  },
  nodeList: [],
  nodeComponent: { DefaultNode: _Node2.default },
  theme: _theme.defaultTheme,
  view: {
    link: {},
    node: {}
  }
};
exports.default = FlowViewFrame;