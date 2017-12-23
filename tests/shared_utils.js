let check = function(done, f) {
  try {
    f();
    done();
  } catch (e) {
    done(e);
  }
}

module.exports.check = check;