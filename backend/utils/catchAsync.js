/**
 * Catches errors in async routes and passes them to the global error handler.
 */
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
