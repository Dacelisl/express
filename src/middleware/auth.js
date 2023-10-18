export function registeredUser(req, res, next) {
  if (req.session.user?.email) {
    return next()
  }
  req.logger.warning('Authentication Error!')
  return res.status(401).render('error', { error: 'Authentication Error!', code: 401 })
}

export function adminAccess(req, res, next) {
  if (req.session.user?.rol === 'admin' || req.session.user?.rol === 'premium') {
    return next()
  }
  const ruta = req.originalUrl
  req.logger.warning(`Unauthorized access  ${req.method} ${ruta}`)
  return res.status(403).render('error', { error: 'authorization error!', code: 403 })
}
export function isUser(req, res, next) {
  if (req.session.user?.rol !== 'admin') {
    return next()
  }
  req.logger.warning(`authorization error  ${req.method} ${ruta} from ${funcion}`)
  return res.status(403).render('error', { error: 'authorization error!', code: 403 })
}
