const express = require('express')
const router = express.Router()
const User = require('../models/UserModel')
const Blogs = require('../models/BlogModel')
const verifyToken = require('../middleware/Authentication')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const cloudinary = require('../utils/cloudinary')
const upload = require('../middleware/multer')




router.get('/profile', verifyToken, async (req, res) => {
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, error: "User not found" })
        }
        return res.status(200).json({ success: true, user })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, error: error })
    }
})

router.put('/profile/update', verifyToken, upload.single('image'), // Move the upload middleware first
    [
        body('name', 'Name must be 4 characters long').isLength({ min: 4 }),
        body('newPassword', 'Password must contain a minimum of 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.')
            .optional()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minNumbers: 1,
                minUppercase: 1,
                minSymbols: 1,
            })
    ], async (req, res) => {
        const { userId, name, oldPassword, newPassword } = req.body

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.json({ errorMessage: result.array() });
        }


        try {
            const user = await User.findById(userId)
            if (!user) {
                return res.json({ success: false, error: "No user Found" })
            }
            let updateFields = { name: name };
            let blogPicture = null;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                blogPicture = result.secure_url;
            }
            if (oldPassword && newPassword) {
                const verify = await bcrypt.compare(oldPassword, user.password)
                if (!verify) {
                    return res.json({ success: false, error: "Password do not match" })
                }
                const salt = await bcrypt.genSalt(10)
                const securePassword = await bcrypt.hash(newPassword, salt)

                updateFields.password = securePassword;
            }

            if (blogPicture) {
                updateFields.profilePic = blogPicture;
            }

            await user.updateOne(updateFields);
            await Blogs.updateMany(
                { authorId: userId },
                { authorName: name }
            );


            return res.json({ success: true, message: "Profile Updated" })
        } catch (error) {
            return res.json({ success: false, error })
        }

    })




module.exports = router