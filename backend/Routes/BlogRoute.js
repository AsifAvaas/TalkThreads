const express = require('express')
const router = express.Router()
const Blogs = require('../models/BlogModel')
const User = require('../models/UserModel')
const cloudinary = require('../utils/cloudinary')
const upload = require('../middleware/multer')
const verifyToken = require('../middleware/Authentication')
const mongoose = require('mongoose')



router.get('/blogs/all', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;

        // Fetch total count of blogs
        const totalBlogs = await Blogs.countDocuments();

        // Fetch paginated blogs
        const blogs = await Blogs.find()
            .select('blogName blogBody blogPicture authorName likeCount dislikeCount')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        if (blogs.length > 0) {
            return res.status(200).json({
                success: true,
                blogs,
                totalBlogs // Include total blog count
            });
        }
        return res.status(404).json({ success: false, error: "No more blogs available" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});



router.get('/blogs/:id', verifyToken, async (req, res) => {
    try {
        const { userId } = req.query;

        const blog = await Blogs.findById(req.params.id)
        if (!blog) {
            return res.json({ success: false, error: "No blogs found" })
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const isLiked = blog.likers.some(likerId => likerId.equals(userObjectId));
        const isDisliked = blog.dislikers.some(dislikerId => dislikerId.equals(userObjectId));

        return res.json({
            success: true, blog: blog, isLiked: isLiked,
            isDisliked: isDisliked
        })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, error: error })
    }
})

router.post('/blogs/create', verifyToken, upload.single('image'), async (req, res) => {
    const { blogName, authorId, blogBody } = req.body


    try {
        const author = await User.findById(authorId)
        if (!author) {
            return res.json({ success: false, error: "No user found" })
        }
        let blogPicture = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            blogPicture = result.secure_url;
        }
        await new Blogs({
            blogName,
            blogPicture, // This will be null if no image is uploaded
            blogBody,
            authorId,
            authorName: author.name,
        }).save();
        return res.status(200).json({ success: true, message: "Blog created successfully" })


    } catch (error) {
        return res.json({ success: false, error: error })
    }

})

router.put('/blogs/update', verifyToken, async (req, res) => {
    const { blogId, blogName, blogPicture, blogBody } = req.body
    try {
        const blog = await Blogs.findByIdAndUpdate(blogId, {
            blogName, blogPicture, blogBody
        }, { new: true })

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        return res.status(200).json({ success: true, blog });
    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({ success: false, message: "An error occurred while updating the blog" });
    }
})

router.delete('/blogs/delete', verifyToken, async (req, res) => {
    const { blogId } = req.body
    try {
        const blog = await Blogs.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        await Blogs.findByIdAndDelete(blogId)
        return res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred while deleting the blog" });
    }
})

router.post('/blogs/comment', verifyToken, async (req, res) => {
    const { commenterId, comment, blogId } = req.body
    try {
        const user = await User.findById(commenterId)
        if (!user) {
            return res.json({ success: false, error: "No user found" })
        }
        const blog = await Blogs.findById(blogId)

        if (!blog) {
            return res.json({ success: false, error: "No blog found" })
        }
        const newComment = {
            commenterId,
            commenterName: user.name,
            commentText: comment,
        };
        blog.comments.push(newComment);

        // Save the updated blog document
        await blog.save();

        return res.status(200).json({ success: true, blog })


    } catch (error) {
        return res.json({ success: false, error: error })
    }
})

router.put('/blogs/comment/update', verifyToken, async (req, res) => {
    const { newComment, userId, commentId, blogId } = req.body
    try {
        const blog = await Blogs.findById(blogId)
        if (!blog) {
            return res.json({ success: false, error: "No blog found" })
        }
        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: "No comment found" });
        }

        if (comment.commenterId.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Commenter doesn't match" });
        }

        comment.commentText = newComment;
        await blog.save();

        return res.status(200).json({ success: true })


    } catch (error) {
        return res.json({ success: false, error: error })
    }
})
router.delete('/blogs/comment/delete', verifyToken, async (req, res) => {
    const { userId, commentId, blogId } = req.body
    try {

        const blog = await Blogs.findById(blogId)
        if (!blog) {
            return res.json({ success: false, error: "No blog found" })
        }
        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: "No comment found" });
        }
        if (comment.commenterId.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Commenter doesn't match" });
        }
        blog.comments.pull(commentId);
        await blog.save();
        return res.status(200).json({ success: true })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, error: error })
    }


})

router.post('/blog/impression/:data', async (req, res) => {
    try {
        const { data } = req.params;
        const { blogId, userId } = req.body;

        const blog = await Blogs.findById(blogId);
        if (!blog) {
            return res.json({ success: false, error: "No blog found" });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        if (data === 'like') {
            const isLiked = blog.likers.some(likerId => likerId.equals(userObjectId));

            if (isLiked) {
                blog.likers.pull(userObjectId);
                blog.likeCount--;
            } else {
                blog.likers.push(userObjectId);
                blog.likeCount++;


                const isDisliked = blog.dislikers.some(dislikerId => dislikerId.equals(userObjectId));
                if (isDisliked) {
                    blog.dislikers.pull(userObjectId);
                    blog.dislikeCount--;
                }
            }
        } else if (data === 'dislike') {
            const isDisliked = blog.dislikers.some(dislikerId => dislikerId.equals(userObjectId));

            if (isDisliked) {
                // Remove the userId from dislikers array
                blog.dislikers.pull(userObjectId);
                blog.dislikeCount--;
            } else {
                // Add the userId to dislikers array
                blog.dislikers.push(userObjectId);
                blog.dislikeCount++;

                // Remove the userId from likers array if it's there
                const isLiked = blog.likers.some(likerId => likerId.equals(userObjectId));
                if (isLiked) {
                    blog.likers.pull(userObjectId);
                    blog.likeCount--;
                }
            }
        }

        // Save the updated blog
        await blog.save();

        return res.json({
            success: true,
            message: `Blog ${data}d successfully`,
            blog: blog,
        });
    } catch (error) {
        return res.json({ success: false, error: error.message || error });
    }

})



module.exports = router