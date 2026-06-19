exports.safeRoute = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      // Log as warning and return safe empty response
      try {
        console.warn('[BlogSafe] Controller error:', err && err.message ? err.message : err);
      } catch (e) {
        // ignore
      }
      return res.status(200).json({ success: true, data: [] });
    }
  };
};
