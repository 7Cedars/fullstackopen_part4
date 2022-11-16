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

describe('creating blogs works correctly', () => {

    test('it returns correct number of blogs', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.firstBlogs.length)
    })

    test('it names unique identifier as "id" (not "_id")', async () => {
        
        const response = await api.get('/api/blogs')
        console.log(Object.keys(response.body[0]))

        expect(response.body).toBeDefined()
        expect(Object.keys(response.body[0])).toContain('id')
        expect(Object.keys(response.body[0])).not.toContain('_id')
    })

    test('it saves a (valid) blog correctly', async () => {
        const newSavedBlog =   {
            title: "An added blog",
            author: "Matti Luukkainen",
            url: "How to Make create good MOOCs.",
            likes: 15
        }

        await api
            .post('/api/blogs')
            .send(newSavedBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.firstBlogs.length + 1) 
    })

    test('New blog with no likes defaults to 0', async () => {
        const newSavedBlog =   {
            title: "An added blog without likes",
            author: "Matti Luukkainen",
            url: "How to Make create good MOOCs - part 2."
        }

        await api
            .post('/api/blogs')
            .send(newSavedBlog)
            .expect(201)

        const response = await api.get('/api/blogs')
        const lastBlog = response.body.slice(-1)
        expect(lastBlog[0].likes).toEqual(0) 
    })

    test('New blog without title or url results in error status 400 bad request', async () => {
        const noTitleOrUrl = [
            {
                author: "Matti Luukkainen",
                url: "How to Make create good MOOCs - part 2.",
                likes: 14
            },
            {
                title: "An added blog without likes",
                author: "Matti Luukkainen",
                likes: 14
            }] 

        const promiseArray = noTitleOrUrl.map(blog => api
            .post('/api/blogs')
            .send(blog)
            .expect(400)
            )
        
        await Promise.all(promiseArray)
    })
})

describe('deleting blogs works correctly', () => {
    
    test('a blog is deleted if an existing id is provided', async () => {
        const response = await api.get('/api/blogs')
        const existingId = response.body[0].id

        await api.delete(`/api/blogs/${existingId}`)
        const response2 = await api.get('/api/blogs')

        expect(response2.body).toHaveLength(response.body.length -1)
    })

    test('if a non existing id is provided, nothing happens', async () => {
        const response = await api.get('/api/blogs')
        const nonExistingId = await helper.nonExistingId()

        console.log("helper.nonExistingId(): ", nonExistingId)

        await api.delete(`/api/blogs/${nonExistingId}`)
        const response2 = await api.get('/api/blogs')

        expect(response2.body).toHaveLength(response.body.length)
    })
})

describe('updating blogs works correctly', () => {

    test('Blog correctly updates title', async () => {
        const existingBlog = await api.get('/api/blogs')
        const existingId = existingBlog.body[0].id

        const newTitle = {title: "An Updated Title"} 

        await api
            .put(`/api/blogs/${existingId}`)
            .send(newTitle)
            .expect(204)

        const updatedBlogs = await api.get(`/api/blogs`)        
        const updatedTitles = updatedBlogs.body.map(blog => blog.title)
        expect(updatedTitles).toContain("An Updated Title")
    })

    test('Blog correctly updates likes', async () => {
        const existingBlog = await api.get('/api/blogs')
        const existingId = existingBlog.body[0].id

        const newLikes = {likes: existingBlog.body[0].likes + 1} 

        await api
            .put(`/api/blogs/${existingId}`)
            .send(newLikes)
            .expect(204)

        const updatedBlogs = await api.get(`/api/blogs`)
        expect(updatedBlogs.body[0].likes + 0).toEqual(existingBlog.body[0].likes + 1)
    })

})

