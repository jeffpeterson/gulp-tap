var ES = require('event-stream');
var baseStream = require('stream');

module.exports = function(lambda) {
  var modifyFile;
  var id = 1;
  var cache = {};
  var utils = function(tapStream, file) {
    return {
      /*
      # Routes through another stream. The filter must not be
      # created. This will create the filter as needed and
      # cache when it can.
      #
      # @param filter {stream}
      # @param args {Array} Array containg arguments to apply to filter.
      #
      # @example
      #   t.through coffee, [{bare: true}]
      */

      through: function(filter) {
        var args = [].slice.call(arguments, 1);
        var stream;
        if (filter.__tapId) {
          stream = cache[filter.__tapId];
          if (!stream) {
            cache[filter.__tapId] = null;
          }
        }
        if (stream) {

        } else {
          stream = filter.apply(null, args);
          stream.on("error", function(err) {
            return tapStream.emit("error", err);
          });
          filter.__tapId = "" + id;
          cache[filter.__tapId] = stream;
          id += 1;
          stream.pipe(tapStream);
        }
        stream.write(file);
        return stream;
      }
    };
  };
  modifyFile = function(file) {
    var obj;
    obj = lambda(file, utils(this, file));
    if (!(obj instanceof baseStream)) {
      return this.emit('data', file);
    }
  };
  return ES.through(modifyFile);
};

/*
//@ sourceMappingURL=tap.map
*/
