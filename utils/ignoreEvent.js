"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ignoreEvent = function ignoreEvent(e) {
  e.preventDefault();
  e.stopPropagation();
};

exports.default = ignoreEvent;