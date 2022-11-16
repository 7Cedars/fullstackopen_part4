const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')
  
    const blogObjects = 
        helper.firstBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.firstBlogs.length)
})

test('unique identifier is named "id" (and not "_id")', async () => {
    const response = await api.get('/api/blogs')
    console.log(Object.keys(response.body[0]))

    expect(response.body).toBeDefined()
    expect(Object.keys(response.body[0])).toContain('id')
    expect(Object.keys(response.body[0])).not.toContain('_id')

})

