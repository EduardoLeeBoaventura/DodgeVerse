module.exports = function checkAuth(req, res, next) {
    if (req.session && req.session.playerId) {
        next();
    } else {
        res.status(401).json({ message: 'Acesso negado.' });
    }
};