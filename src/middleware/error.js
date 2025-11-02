export function notFound(req, res) {
  res.status(404).json({ error: 'not found' });
}

export function errorHandler(err, req, res, _next) {
  console.error('ERROR:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'internal error' });
}
