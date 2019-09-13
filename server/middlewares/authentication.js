const jwt = require('jsonwebtoken');

/**
 * JWT Verification middleare
 */
let verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid'
                }
            });
        }

        req.user = decoded.user;

        next();
    });
};

let verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    }
    else {
        return res.json({
            ok: false,
            err: {
                message: 'The user is not ADMIN'
            }
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdminRole
};
