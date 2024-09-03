const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const token_secret = process.env.ACCESS_SECRET;
const refresh_secret = process.env.REFRESH_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

router.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;  // Get refresh token from HttpOnly cookie
    if (!refreshToken) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(refreshToken, refresh_secret);
        const newToken = jwt.sign({ user: verified.user }, token_secret, { expiresIn: "30m" });

        res.cookie('accessToken', newToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'Strict' : 'Lax',
            maxAge: 15 * 60 * 1000

        });
        res.json({ message: 'Token refreshed successfully' });
    } catch (error) {
        console.error('Invalid or expired refresh token:', error);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});

router.post('/verify-token', (req, res) => {
    const authToken = req.cookies.accessToken;
    if (!authToken) return res.status(401).json({ message: 'No token provided' });

    try {
        jwt.verify(authToken, token_secret);
        res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;