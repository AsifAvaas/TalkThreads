const express = require('express')
const router = express.Router()
const Blogs = require('../models/BlogModel')
const User = require('../models/UserModel')
const verifyToken = require('../middleware/Authentication')

router.get('/blogs/all', verifyToken, async (req, res) => {
    try {
        const blogs = await Blogs.find().select('blogName blogBody blogPicture authorName likeCount dislikeCount');
        if (blogs) {
            return res.status(200).json({ success: true, blogs: blogs })
        }
        return res.status(401).json({ success: false, error: "Could not fetch blogs" })
    } catch (error) {
        return res.status(401).json({ success: false, error: error })
    }
})


router.get('/blogs/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blogs.findById(req.params.id)
        if (!blog) {
            return res.json({ success: false, error: "No blogs found" })
        }
        return res.json({ success: true, blog: blog })
    } catch (error) {
        return res.json({ success: false, error: error })
    }
})

router.post('/blogs/create', verifyToken, async (req, res) => {
    const { blogName, blogPicture, authorId, blogBody } = req.body
    try {
        const author = await User.findById(authorId)
        if (!author) {
            return res.json({ success: false, error: "No user found" })
        }
        await new Blogs({
            blogName,
            blogPicture,
            blogBody,
            authorId,
            authorName: author.name,
        }).save()

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
    const { commenterId, commenter, comment, blogId } = req.body
    try {
        const blog = await Blogs.findById(blogId)
        if (!blog) {
            return res.json({ success: false, error: "No blog found" })
        }
        const newComment = {
            commenterId,
            commenterName: commenter,
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


module.exports = router