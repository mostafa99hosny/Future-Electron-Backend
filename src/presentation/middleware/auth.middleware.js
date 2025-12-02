const authMiddleware = (req, res, next) => {
    // TODO: Implement proper authentication
    // For now, set a dummy userId
    req.userId = 'dummy-user-id';
    next();
};

module.exports = authMiddleware;
