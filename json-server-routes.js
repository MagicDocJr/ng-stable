export default (req, res, next) => {
  if (req.method === 'POST' && req.url === '/auth/login') {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
      return res.json({
        accessToken: 'fake-access-token-' + Date.now(),
        refreshToken: 'fake-refresh-token-' + Date.now(),
      });
    }
    return res.status(401).json({ message: 'invalid credentials' });
  }

  if (req.method === 'POST' && req.url === '/auth/refresh') {
    const { refreshToken } = req.body;

    if (refreshToken && refreshToken.startsWith('fake-refresh-token-')) {
      return res.json({
        accessToken: 'fake-access-token-' + Date.now(),
      });
    }
    return res.status(401).json({ message: 'Refresh token expired' });
  }

  if (req.method === 'POST' && req.url === '/auth/logout') {
    return res.status(200).json({ message: 'Logged out' });
  }
  next();
};
