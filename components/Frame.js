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

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

var _Selector = require('./Selector');

var _Selector2 = _interopRequireDefault(_Selector);

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


var defaultTheme = require('./theme');

var isShift = function isShift(code) {
  return code === 'ShiftLeft' || code === 'ShiftRight';
};

var createVNode = _inferno2.default.createVNode;

var Frame = function (_Component) {
  _inherits(Frame, _Component);

  function Frame(props) {
    _classCallCheck(this, Frame);

    var _this = _possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(this, props));

    _this.state = {
      dynamicView: { height: null, width: null },
      draggedLinkId: null,
      dragging: false,
      dragMoved: false,
      offset: { x: 0, y: 0 },
      pointer: null,
      scroll: { x: 0, y: 0 },
      showSelector: false,
      selectedItems: [],
      shiftPressed: false
    };
    return _this;
  }

  _createClass(Frame, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          container = _props.container,
          createInputPin = _props.createInputPin,
          createOutputPin = _props.createOutputPin,
          deleteInputPin = _props.deleteInputPin,
          deleteOutputPin = _props.deleteOutputPin,
          dragItems = _props.dragItems,
          view = _props.view;


      var setState = this.setState.bind(this);

      document.addEventListener('keydown', function (_ref) {
        var code = _ref.code;
        var endDragging = _this2.props.endDragging;
        var _state = _this2.state,
            dragMoved = _state.dragMoved,
            selectedItems = _state.selectedItems,
            shiftPressed = _state.shiftPressed;


        if (isShift(code)) {
          setState({ shiftPressed: true });
        }

        if (code === 'Escape') {
          setState({ selectedItems: [] });
        }

        var selectedNodes = Object.keys(view.node).filter(function (id) {
          return selectedItems.indexOf(id) > -1;
        });

        if (selectedNodes.length > 0 && code.substring(0, 5) === 'Arrow') {
          var draggingDelta = { x: 0, y: 0 };
          var unit = shiftPressed ? 1 : 10;

          if (code === 'ArrowLeft') draggingDelta.x = -unit;
          if (code === 'ArrowRight') draggingDelta.x = unit;
          if (code === 'ArrowUp') draggingDelta.y = -unit;
          if (code === 'ArrowDown') draggingDelta.y = unit;

          dragItems(draggingDelta, selectedNodes);

          if (!dragMoved) {
            setState({ dragMoved: true });
          }

          if (!shiftPressed) {
            endDragging(selectedNodes);

            setState({
              dragMoved: false,
              dragging: false
            });
          }
        }

        if (code === 'KeyI') {
          selectedItems.forEach(function (id) {
            if (view.node[id] && view.node[id].ins) {
              if (shiftPressed) {
                deleteInputPin(id);
              } else {
                createInputPin(id);
              }
            }
          });
        }

        if (code === 'KeyO') {
          selectedItems.forEach(function (id) {
            if (view.node[id] && view.node[id].outs) {
              if (shiftPressed) {
                deleteOutputPin(id);
              } else {
                createOutputPin(id);
              }
            }
          });
        }

        // Since state or props are not modified it is necessary to force update.
        _this2.forceUpdate();
      });

      document.addEventListener('keyup', function (_ref2) {
        var code = _ref2.code;
        var endDragging = _this2.props.endDragging;
        var _state2 = _this2.state,
            dragMoved = _state2.dragMoved,
            selectedItems = _state2.selectedItems;


        var selectedNodes = Object.keys(view.node).filter(function (id) {
          return selectedItems.indexOf(id) > -1;
        });

        if (isShift(code)) {
          setState({ shiftPressed: false });

          if (dragMoved && selectedNodes) {
            endDragging(selectedNodes);

            setState({
              dragging: false,
              dragMoved: false
            });
          }
        }
      });

      window.addEventListener('scroll', function () {
        setState({ scroll: {
            x: window.scrollX,
            y: window.scrollY
          } });
      });

      window.addEventListener('resize', function () {
        var rect = container.getBoundingClientRect();

        setState({ dynamicView: {
            height: rect.height,
            width: rect.width
          } });
      });

      var offset = {
        x: container.offsetLeft,
        y: container.offsetTop
      };

      var scroll = {
        x: window.scrollX,
        y: window.scrollY
      };

      setState({ offset: offset, scroll: scroll });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          createInputPin = _props2.createInputPin,
          createLink = _props2.createLink,
          _createNode = _props2.createNode,
          createOutputPin = _props2.createOutputPin,
          custom = _props2.custom,
          deleteInputPin = _props2.deleteInputPin,
          deleteLink = _props2.deleteLink,
          deleteNode = _props2.deleteNode,
          deleteOutputPin = _props2.deleteOutputPin,
          dragItems = _props2.dragItems,
          endDragging = _props2.endDragging,
          model = _props2.model,
          selectLink = _props2.selectLink,
          selectNode = _props2.selectNode,
          updateLink = _props2.updateLink,
          view = _props2.view;
      var _state3 = this.state,
          draggedLinkId = _state3.draggedLinkId,
          pointer = _state3.pointer,
          dynamicView = _state3.dynamicView,
          selectedItems = _state3.selectedItems,
          showSelector = _state3.showSelector;


      var height = dynamicView.height || view.height;
      var width = dynamicView.width || view.width;

      // Remove border, otherwise also server side SVGx renders
      // miss the bottom and right border.
      var border = 1; // TODO frameBorder is 1px, make it dynamic
      height = height - 2 * border;
      width = width - 2 * border;

      var defaultUtil = {
        typeOfNode: function typeOfNode() {
          return 'DefaultNode';
        }
      };

      if ((0, _notDefined2.default)(custom)) {
        custom = {
          theme: null,
          link: null,
          node: null,
          nodeList: [],
          util: defaultUtil
        };
      }

      var theme = custom.theme || defaultTheme;

      var fontSize = theme.fontSize || defaultTheme.fontSize;
      var frameBorder = theme.frameBorder || defaultTheme.frameBorder;
      var fontFamily = theme.fontFamily || defaultTheme.fontFamily;
      var nodeBodyHeight = theme.nodeBodyHeight || defaultTheme.nodeBodyHeight;
      var pinSize = theme.pinSize || defaultTheme.pinSize;

      if ((0, _notDefined2.default)(custom.link)) custom.link = {};
      if ((0, _notDefined2.default)(custom.link.DefaultLink)) custom.link.DefaultLink = _Link2.default;
      var Link = custom.link.DefaultLink;

      if ((0, _notDefined2.default)(custom.node)) custom.node = {};
      if ((0, _notDefined2.default)(custom.node.DefaultNode)) custom.node.DefaultNode = _Node2.default;
      var Node = custom.node.Defaultnode;

      var typeOfNode = custom.util.typeOfNode || defaultUtil.typeOfNode;

      var setState = this.setState.bind(this);

      var coordinatesOfLink = function coordinatesOfLink(_ref3) {
        var from = _ref3.from,
            to = _ref3.to;

        var x1 = null;
        var y1 = null;
        var x2 = null;
        var y2 = null;

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
          // FIXME at first, pointer is null. This trick works, but,
          // it should be reviosioned when implementing creating links
          // in the opposite direction.
          x2 = pointer ? pointer.x - pinSize / 2 : x1;
          y2 = pointer ? pointer.y - pinSize : y1;
        }

        return { x1: x1, y1: y1, x2: x2, y2: y2 };
      };

      var getCoordinates = function getCoordinates(e) {
        var _state4 = _this3.state,
            offset = _state4.offset,
            scroll = _state4.scroll;


        return {
          x: e.clientX - offset.x + scroll.x,
          y: e.clientY - offset.y + scroll.y
        };
      };

      var onClick = function onClick(e) {
        e.preventDefault();
        e.stopPropagation();

        setState({ showSelector: false });
      };

      var onCreateLink = function onCreateLink(link) {
        var draggedLinkId = createLink(link);

        setState({ draggedLinkId: draggedLinkId });
      };

      var onUpdateLink = function onUpdateLink(id, link) {
        updateLink(id, link);

        var disconnectingLink = link.to === null;

        if (disconnectingLink) {
          link.id = id;

          setState({ draggedLinkId: id });
        } else {
          setState({ draggedLinkId: null });
        }
      };

      var onDoubleClick = function onDoubleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        setState({
          pointer: getCoordinates(e),
          showSelector: true
        });
      };

      var onMouseDown = function onMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        // TODO code here to start selectedArea dragging
        setState({
          selectedItems: []
        });
      };

      var onMouseLeave = function onMouseLeave(e) {
        e.preventDefault();
        e.stopPropagation();

        var draggedLinkId = _this3.state.draggedLinkId;
        if (draggedLinkId) delete view.link[draggedLinkId];

        setState({
          dragging: false,
          draggedLinkId: null,
          pointer: null,
          showSelector: false
        });
      };

      var onMouseMove = function onMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        var _state5 = _this3.state,
            dragging = _state5.dragging,
            dragMoved = _state5.dragMoved,
            selectedItems = _state5.selectedItems;


        var nextPointer = getCoordinates(e);

        setState({
          pointer: nextPointer
        });

        if (dragging && selectedItems.length > 0) {
          var draggingDelta = {
            x: pointer ? nextPointer.x - pointer.x : 0,
            y: pointer ? nextPointer.y - pointer.y : 0
          };

          dragItems(draggingDelta, selectedItems);

          if (!dragMoved) {
            setState({ dragMoved: true });
          }
        }
      };

      var onMouseUp = function onMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        var _state6 = _this3.state,
            draggedLinkId = _state6.draggedLinkId,
            dragMoved = _state6.dragMoved,
            selectedItems = _state6.selectedItems;


        if (draggedLinkId) {
          delete view.link[draggedLinkId];

          setState({
            draggedLinkId: null,
            pointer: null
          });
        } else {
          var selectedNodes = Object.keys(view.node).filter(function (id) {
            return selectedItems.indexOf(id) > -1;
          });

          if (dragMoved) {
            endDragging(selectedNodes);

            setState({
              dragging: false,
              dragMoved: false,
              pointer: null
            });
          } else {
            setState({
              pointer: null
            });
          }
        }
      };

      /**
       * Bring up selected nodes.
       */

      var selectedFirst = function selectedFirst(a, b) {
        // FIXME it works, but it would be nice if the selected
        // items keep being up after deselection.
        var aIsSelected = selectedItems.indexOf(a) > -1;
        var bIsSelected = selectedItems.indexOf(b) > -1;

        if (aIsSelected && bIsSelected) return 0;

        if (aIsSelected) return 1;
        if (bIsSelected) return -1;
      };

      var selectItem = function selectItem(id) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          var _state7 = _this3.state,
              draggedLinkId = _state7.draggedLinkId,
              shiftPressed = _state7.shiftPressed;

          // Do not select items when releasing a dragging link.

          if (draggedLinkId) {
            delete view.link[draggedLinkId];

            setState({ draggedLinkId: null });

            return;
          }

          var selectedItems = Object.assign([], _this3.state.selectedItems);

          var index = selectedItems.indexOf(id);

          var itemAlreadySelected = index > -1;

          // Shift key allows multiple selection.

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

          if (!itemAlreadySelected) {
            if (Object.keys(view.node).indexOf(id) > -1) {
              selectNode(id);
            }

            if (Object.keys(view.link).indexOf(id) > -1) {
              selectLink(id);
            }
          }

          setState({
            dragging: true,
            selectedItems: selectedItems
          });
        };
      };

      var startDraggingLinkTarget = function startDraggingLinkTarget(id) {
        // Remember link source.
        var from = view.link[id].from;

        // Delete dragged link so the 'deleteLink' event is triggered.
        deleteLink(id);

        // Create a brand new link, this is the right choice to avoid
        // conflicts, for example the user could start dragging the link
        // target and then drop it again in the same target.
        var draggedLinkId = createLink({ from: from });
        setState({ draggedLinkId: draggedLinkId });
      };

      return createVNode(128, 'svg', {
        'fontFamily': fontFamily,
        'fontSize': fontSize,
        'height': height,
        'textAnchor': 'start',
        'style': { border: frameBorder },
        'width': width
      }, [Object.keys(view.node).sort(selectedFirst).map(function (id, i) {
        var node = view.node[id];

        var height = node.height,
            ins = node.ins,
            outs = node.outs,
            text = node.text,
            width = node.width,
            x = node.x,
            y = node.y;


        var nodeType = typeOfNode(node);
        var Node = custom.node[nodeType];

        return createVNode(16, Node, {
          'createInputPin': createInputPin,
          'createOutputPin': createOutputPin,
          'draggedLinkId': draggedLinkId,
          'deleteInputPin': deleteInputPin,
          'deleteNode': deleteNode,
          'deleteOutputPin': deleteOutputPin,
          'height': height,
          'id': id,
          'ins': ins,
          'model': model,
          'multiSelection': selectedItems.length > 1,
          'onCreateLink': onCreateLink,
          'outs': outs,
          'pinSize': pinSize,
          'selected': selectedItems.indexOf(id) > -1,
          'selectNode': selectItem(id),
          'theme': theme,
          'text': text,
          'updateLink': onUpdateLink,
          'width': width,
          'x': x,
          'y': y
        }, null, null, i);
      }), Object.keys(view.link).map(function (id, i) {
        var _view$link$id = view.link[id],
            from = _view$link$id.from,
            to = _view$link$id.to;


        var coord = coordinatesOfLink(view.link[id]);
        var sourceSelected = from ? selectedItems.indexOf(from[0]) > -1 : false;
        var targetSelected = to ? selectedItems.indexOf(to[0]) > -1 : false;

        return createVNode(16, Link, {
          'deleteLink': deleteLink,
          'from': from,
          'id': id,
          'onCreateLink': onCreateLink,
          'startDraggingLinkTarget': startDraggingLinkTarget,
          'pinSize': pinSize,
          'selected': selectedItems.indexOf(id) > -1,
          'selectLink': selectItem(id),
          'sourceSelected': sourceSelected,
          'targetSelected': targetSelected,
          'theme': theme,
          'to': to,
          'x1': coord.x1,
          'y1': coord.y1,
          'x2': coord.x2,
          'y2': coord.y2
        }, null, null, i);
      }), createVNode(16, _Selector2.default, {
        'createNode': function createNode(node) {
          var id = _createNode(node);

          setState({
            selectedItems: [id],
            showSelector: false
          });
        },
        'nodeList': custom.nodeList,
        'pointer': pointer,
        'show': showSelector
      })], {
        'onClick': onClick,
        'onDoubleClick': onDoubleClick,
        'onMouseDown': onMouseDown,
        'onMouseEnter': _ignoreEvent2.default,
        'onMouseLeave': onMouseLeave,
        'onMouseMove': onMouseMove,
        'onMouseUp': onMouseUp
      });
    }
  }]);

  return Frame;
}(_infernoComponent2.default);

exports.default = Frame;