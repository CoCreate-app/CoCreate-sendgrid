(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client.js"], function(CoCreateSendgrid) {
        	return factory(CoCreateSendgrid)
        });
    } else if (typeof module === 'object' && module.exports) {
      const CoCreateSendgrid = require("./server.js")
      module.exports = factory(CoCreateSendgrid);
    } else {
        root.returnExports = factory(root["./client.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (CoCreateSendgrid) {
  return CoCreateSendgrid;
}));