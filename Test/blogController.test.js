const request = require('supertest');
const app = require('../index'); // Assuming your Express app instance is exported from index.js
const Blog = require('../models/blogModel');

describe('Blog Management Endpoints', () => {
  let authToken;
  beforeAll(async () => {
    // Assuming you have a user authentication mechanism that provides a token upon sign-in
    const res = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@example.com', // Use the credentials of an existing user
        password: 'password123',
      });
    authToken = res.body.token;
  });

  let testBlog;
  beforeEach(async () => {
    // Create a test blog for testing blog endpoints
    testBlog = await Blog.create({
      title: 'Test Blog',
      description: 'This is a test blog',
      tags: ['test', 'example'],
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      author_id: 'userId', // Use the ID of an existing user
      state: 'published',
    });
  });

  afterEach(async () => {
    // Clean up test data after each test
    await Blog.deleteMany();
  });

  it('should get list of published blogs', async () => {
    const res = await request(app)
      .get('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    // Add assertions to validate response body
  });

  it('should get single published blog', async () => {
    const res = await request(app)
      .get(`/api/blogs/${testBlog._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    // Add assertions to validate response body
  });

  it('should create a new blog', async () => {
    const newBlogData = {
      title: 'New Blog',
      description: 'This is a new blog',
      tags: ['new', 'example'],
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    };
    const res = await request(app)
      .post('/api/blogs')
      .send(newBlogData)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(201);
    // Add assertions to validate response body
  });

  it('should update an existing blog', async () => {
    const updatedBlogData = {
      title: 'Updated Blog',
      description: 'This is an updated blog',
      tags: ['updated', 'example'],
      body: 'Updated content...',
    };
    const res = await request(app)
      .put(`/api/blogs/${testBlog._id}`)
      .send(updatedBlogData)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    // Add assertions to validate response body
  });

  it('should delete an existing blog', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${testBlog._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    // Add assertions to validate response body
  });
});
