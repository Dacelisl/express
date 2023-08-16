export function registeredUser(req, res, next) {
  if (req.session.user?.email) {
    return next()
  }
  req.logger.warning('Authentication Error!')
  return res.status(401).render('error', { error: 'Authentication Error!', code: 401 })
}

export function isAdmin(req, res, next) {
  if (req.session.user?.rol === 'admin') {
    return next()
  }
  req.logger.warning('authorization error')
  return res.status(403).render('error', { error: 'authorization error!', code: 403 })
}
export function isUser(req, res, next) {
  if (req.session.user?.rol !== 'admin') {
    return next()
  }
  req.logger.warning('authorization error')
  return res.status(403).render('error', { error: 'authorization error!', code: 403 })
}
