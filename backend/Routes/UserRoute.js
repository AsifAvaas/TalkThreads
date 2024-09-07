const express = require('express')
const router = express.Router()
const User = require('../models/UserModel')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isProduction = process.env.NODE_ENV === 'production';
const Token = require('../models/TokenModel')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const verifyToken = require('../middleware/Authentication')

router.post('/user/create', body('name', 'Name must be 6 charecter Long').isLength({ min: 6 }),
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password must contain minimum of 8 letters, including 1 uppuercase, 1 lowercase, 1 number and 1 spacial symbol.').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
    }), async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.json({ errorMessage: result.array() })
        }

        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.json({ error: "Email ID already exists" })
            }

            const salt = await bcrypt.genSalt(10)
            const securepassword = await bcrypt.hash(req.body.password, salt)

            user = await new User({
                name: req.body.name,
                email: req.body.email,
                password: securepassword,
                profilePic: "",
                isVerified: false
            }).save()

            const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save()

            const url = `${process.env.BACKEND}/auth/${user._id}/verify/${token.token}`
            await sendEmail(user.email, "Verify Email", url)

            res.json({ success: true, message: "An Email has been send to your account. Please verify." });

        } catch (error) {
            console.error(error);
            res.json({ success: false, error: error.message });

        }

    })


router.post('/user/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ error: "User is not registered" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(200).json({ error: "Incorrect Password" });
        }

        if (!user.isVerified) {
            console.log("user is not verified")
            let token = await Token.findOne({ userId: user._id })
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save()
                const url = `${process.env.BACKEND}/auth/${user._id}/verify/${token.token}`
                await sendEmail(user.email, "Verify Email", url)
                console.log("all ok")

            }
            return res.status(200).json({ message: "An Email has been send to your account. Please verify." })
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '30d' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true, secure: isProduction,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, secure: isProduction,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: "Logged in successfully", userId: user._id, accessToken, refreshToken, profilePic: user.profilePic });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }

})

router.post('/google/login', async (req, res) => {
    const { name, email, profilePic } = req.body
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            user = await new User({
                name: name,
                email: email,
                password: "",
                profilePic: profilePic,
                isVerified: true
            }).save()
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '30d' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true, secure: isProduction,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, secure: isProduction,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: "Logged in successfully", userId: user._id, accessToken, refreshToken, profilePic: user.profilePic });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
})



router.post('/user/resend', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ error: "User is not registered" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(200).json({ error: "Incorrect Password" });
        }
        let token = await Token.findOne({ userId: user._id })
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save()



        }
        const url = `${process.env.BACKEND}/auth/${user._id}/verify/${token.token}`
        await sendEmail(user.email, "Verify Email", url)
        res.json({ success: true });



    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
})

// axios.defaults.withCredentials=true


router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(400).json({ message: "Invalid Link" })

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        })
        if (!token)
            return res.status(400).json({ message: "Invalid Link" })

        await user.updateOne({ _id: user._id, isVerified: true })
        await Token.deleteOne({ _id: token._id });
        res.redirect(`${process.env.FrontEnd}/user/login`)
        // res.status(200).json({ message: "Varification successful" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Sevrver Error" })
    }
})




router.post('/logout', async (req, res) => {
    try {
        res.cookie('accessToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        });
        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        });

        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.status(200).json({ success: false, message: 'Loggiong out unsuccessful' });
    }

})


module.exports = router


