export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Not authorized' });
  };