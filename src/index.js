(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client.js"], function(Module) {
        	return factory(Module)
        });
    } else if (typeof module === 'object' && module.exports) {
      const Module = require("./server.js")
      module.exports = factory(Module);
    } else {
        root.returnExports = factory(root["./client.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (Module) {
  return Module;
}));