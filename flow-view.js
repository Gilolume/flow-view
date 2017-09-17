'use strict';

var _Canvas = require('./Canvas');

var _Canvas2 = _interopRequireDefault(_Canvas);

var _Node = require('./components/Node');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = {
  $schema: 'http://json-schema.org/schema#',
  id: 'http://g14n.info/flow-view/schema.json'
};


module.exports = exports.default = { Canvas: _Canvas2.default, Node: _Node2.default, schema: schema };