import * as mongoose from "mongoose";

var LIMIT = 20;
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 500,
        unique: true
    },
    react: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        required: false,
        maxLength: 1000
    },
    category: {
        type: String,
        required: true,
    },
    thumb: {
        type: String,
        required: true,
    },
    medias: {
        type: [String],
        required: true,
    },
    uris: {
        type: [String],
        required: true,
    },
    tags: {
        type: [String],
        required: false
    },
}, {timestamps: true});

postSchema.statics.reactPost = async function (id) {
    const post = await this.findOne({_id: id});
    post.react += 1;
    post.save();
}
postSchema.statics.createNewPost = async function (data) {
    const post = new Post(data);
    await post.save();
    return post;
}
postSchema.statics.getByCategory = async function (category, page, sortBy, sortDirection) {
    const posts = await this.find({category: category}).sort({[sortBy]: sortDirection}).skip((page - 1) * LIMIT).limit(LIMIT);
    const total = await this.countDocuments();
    const totalPages = Math.ceil(total / LIMIT);
    return {
        posts,
        total,
        totalPages,
        currentPage: page,
        canNext: page + 1 <= totalPages,
        canPrev: page - 1 >= 0
    }

}
postSchema.statics.deletePost = async (id) => {
    this.findOneAndDelete({_id: id});
}
postSchema.statics.updatePost = async function (id, post) {
    this.findOneAndUpdate({_id: id}, {$set: post}, {new: true, runValidators: true});
}
postSchema.statics.getAllPosts = async function (page, sortBy, sortDirection) {
    const posts = await this.find().sort({[sortBy]: sortDirection}).skip((page - 1) * LIMIT).limit(LIMIT);
    const total = await this.countDocuments();
    const totalPages = Math.ceil(total / LIMIT);
    return {
        posts,
        total,
        totalPages,
        currentPage: page,
        canNext: page + 1 <= totalPages,
        canPrev: page - 1 >= 0
    }
}
postSchema.statics.getPostById = async (id) => {
    return this.findOne({_id: id});
}
export const Post = new mongoose.model('Post', postSchema);