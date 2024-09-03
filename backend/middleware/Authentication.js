const jwt = require('jsonwebtoken');
const token_secret = process.env.ACCESS_SECRET;
const refresh_secret = process.env.REFRESH_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

const verifyToken = (req, res, next) => {
    let accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;


    if (!accessToken) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(accessToken, token_secret);
        req.user = verified.user;
        next();
    } catch (error) {
        if (refreshToken) {
            try {
                const verifiedRefresh = jwt.verify(refreshToken, refresh_secret);
                const newAccessToken = jwt.sign({ user: verifiedRefresh.user }, token_secret, { expiresIn: '30m' });

                // Set the new access token as an HttpOnly cookie
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: isProduction ? 'Strict' : 'Lax',
                    maxAge: 15 * 60 * 1000
                });

                req.user = verifiedRefresh.user;
                next(); // Proceed with the newly issued access token
            } catch (refreshError) {
                console.error('Invalid or expired refresh token:', refreshError);
                return res.status(401).json({ message: 'Invalid or expired refresh token' });
            }
        } else {
            console.error('Invalid or expired access token and no refresh token provided:', error);
            return res.status(401).json({ message: 'Invalid or expired access token' });
        }

    }
};

module.exports = verifyToken