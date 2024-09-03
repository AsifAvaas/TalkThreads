const mongoose = require('mongoose')

const { Schema } = mongoose

const CommentSchema = new Schema({
    commenterId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    commenterName: { type: String, required: true },
    commentText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


const BlogSchema = new Schema({
    blogName: { type: String, required: true },
    blogPicture: { type: String, default: "" },
    blogBody: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    authorName: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    comments: { type: [CommentSchema], default: [] },
    likers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    dislikers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('blogs', BlogSchema)