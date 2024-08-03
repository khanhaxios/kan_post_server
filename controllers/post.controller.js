import express from 'express';
import {Post} from '../models/post.model.js'

export const postRouter = express.Router();

postRouter.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query?.page) || 1;
        const sortBy = req.query?.sortBy || 'title';
        const sortDirection = (req.query?.sortDirection) || 'desc';

        const validSortFields = ['title', 'content', 'age', 'createdAt']; // List of valid fields
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({error: 'Invalid sort field'});
        }
        if (!['desc', 'asc'].includes(sortDirection)) {
            return res.status(400).json({error: 'Invalid sort direction'});
        }
        const result = await Post.getAllPosts(page, sortBy, sortDirection);
        res.json(result).status(200);
    } catch (e) {
        res.status(400).send({error: e});
    }
});
postRouter.post('/', async (req, res) => {
    try {
        const postData = req.body;
        const newPost = await Post.createNewPost(postData);
        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (e) {
        res.status(500).json({
            message: 'Error creating post',
            error: e.message
        });
    }
})

