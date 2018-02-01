
exports.headVal = function(lvalue,rvalue, options) {
  if (lvalue == rvalue) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}