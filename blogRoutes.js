const express = require('express');
const authenticateUser = require('../middlewares/authMiddleware');
const {
    getPublishedBlogs,
    getPublishedBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogs
} = require('../controllers/blogController');

const router = express.Router();

// Public routes
router.get('/', getPublishedBlogs);
router.get('/:blogId', getPublishedBlog);

// Private routes (require authentication)
router.use(authenticateUser);
router.post('/', createBlog);
router.put('/:blogId', updateBlog);
router.delete('/:blogId', deleteBlog);

router.get('/all', getBlogs);

module.exports = router;
