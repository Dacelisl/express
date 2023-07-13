export function isUser(req, res, next) {
    if (req.session.user?.email) {
      return next();
    }
    return res.status(401).render('error', { error: 'error de autenticacion!', code:401 });
  }
  
  export function isAdmin(req, res, next) {
    if (req.session.user?.rol === 'admin') {
      return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!', code:403 });
  }