const Blog = require('../models/blogModel');

// Get list of published articles on the blog
const getPublishedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ state: 'published' }).populate('author_id');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get single published article
const getPublishedBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findOne({ _id: blogId, state: 'published' }).populate('author_id');
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Update number of readers
        blog.read_count++;
        await blog.save();

        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create new article on blog
const createBlog = async (req, res) => {
    try {
        const { title, description, tags, body } = req.body;
        const userId = req.user._id;

        const newBlog = new Blog({ title, description, tags, body, author_id: userId });
        await newBlog.save();

        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update article on blog
const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, description, tags, body } = req.body;
        const userId = req.user._id;

        const blog = await Blog.findOne({ _id: blogId, author_id: userId });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        blog.title = title;
        blog.description = description;
        blog.tags = tags;
        blog.body = body;
        await blog.save();

        res.json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete article within the blog
const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findOne({ _id: blogId, author_id: userId });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        await blog.remove();

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get list of blogs with pagination, filtering, searching, and ordering
const getBlogs = async (req, res) => {
    try {
        let { page = 1, limit = 20, state, search, orderBy } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = { state: 'published' };
        if (state) {
            query.state = state;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        let sortQuery = {};
        if (orderBy === 'read_count' || orderBy === 'reading_time' || orderBy === 'timestamp') {
            sortQuery[orderBy] = 1;
        }

        const blogs = await Blog.find(query)
            .populate('author_id')
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getPublishedBlogs, getPublishedBlog, createBlog, updateBlog, deleteBlog, getBlogs };
