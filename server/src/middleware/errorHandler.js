export function notFound(req, res) { res.status(404).json({ success: false, message: 'Route not found.' }); }

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
  if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'That record was not found.' });
  const status = err.statusCode || 500;
  if (status >= 500) console.error('Unexpected application error:', err.message);
  res.status(status).json({ success: false, message: status >= 500 ? 'Something went wrong. Please try again.' : err.message, ...(err.details ? { errors: err.details } : {}) });
}
