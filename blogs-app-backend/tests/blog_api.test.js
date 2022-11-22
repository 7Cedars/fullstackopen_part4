const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    // Creates a set of users
    const promiseArrayUser = helper.usersArray.map(user => api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    )
    await Promise.all(promiseArrayUser)

    loggedInUser = await api
        .post('/api/login')
        .send(helper.usersArray[0])
        .expect(200)
    
    // Create three blogs
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loggedInUser.body.token}`) 
        .send(helper.blogsArray[0])
    
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loggedInUser.body.token}`) 
        .send(helper.blogsArray[1])
    
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loggedInUser.body.token}`) 
        .send(helper.blogsArray[2])

})

describe('when user tries to set up a new user name', () => {
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'THDonker',
        name: 'Teije Hidde Donker',
        password: 'AnotherSecretPassword',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).toContain(newUser.username)
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'AdaL',
        name: 'Ada',
        password: 'ThisIsALongPassword'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('username already in use')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  
    test('creation fails if username is too short', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'AL',
        name: 'Ada Lovelace',
        password: 'ThisIsALongPassword'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  
    test('creation fails if password is too short', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: '7Cedars',
        name: 'Seven Cedars',
        password: 'SP'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('Password is shorter than the minimum allowed length (3)')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
})

describe('when user tries to login', () => {

    test('succeeds if password is correct', async () => {    
        const existingUser = helper.usersArray[0]
    
        const result = await api
          .post('/api/login')
          .send(existingUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.username).toContain(existingUser.username)
      })

      test('fails if password is incorrect', async () => {    
        const existingUser = helper.usersArray[0]
        existingUser.password = 'WrongPassword'
    
        await api
          .post('/api/login')
          .send(existingUser)
          .expect(401)
      })
  })

describe('creating blogs works correctly', () => {
   
    test('it returns correct number of blogs', async () => {
        const blogsAtStart = await helper.usersInDb() 
        expect(blogsAtStart).toHaveLength(helper.blogsArray.length)
    })

    test('it names unique identifier as "id" (not "_id")', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toBeDefined()
        expect(Object.keys(response.body[0])).toContain('id')
        expect(Object.keys(response.body[0])).not.toContain('_id')
    })

    test('it saves a (valid) blog correctly', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.usersArray[1])
            .expect(200)
        
        const newSavedBlog =   {
            title: "An added blog",
            author: "Matti Luukkainen",
            url: "How to Make create good MOOCs.",
            likes: 15
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loggedInUser.body.token}`) 
            .send(newSavedBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.blogsArray.length +1) 
    })

    test('New blog with no likes defaults to 0', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.usersArray[2])
            .expect(200)

        const newSavedBlog =   {
            title: "An added blog without likes",
            author: "Matti Luukkainen",
            url: "How to Make create good MOOCs - part 2."
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loggedInUser.body.token}`) 
            .send(newSavedBlog)
            .expect(201)

        const response = await api.get('/api/blogs')
        const lastBlog = response.body.slice(-1)
        expect(lastBlog[0].likes).toEqual(0)
    })

    test('New blog without title or url results in error status 400 bad request', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.usersArray[0])
            .expect(200)

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

            api
                .post('/api/blogs')
                .send(noTitleOrUrl[0])
                .set('Authorization', `bearer ${loggedInUser.body.token}`) 
                .expect(400)
            
            api
                .post('/api/blogs')
                .send(noTitleOrUrl[1])
                .set('Authorization', `bearer ${loggedInUser.body.token}`) 
                .expect(400)
     })
})

describe('deleting blogs works correctly', () => {
    
    test('a blog is deleted if an existing id is provided', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const usersAtStart = await helper.usersInDb()

        const loggedInUser = await api
            .post('/api/login')
            .send(helper.usersArray[0])
            .expect(200)

        const createBlogsUser = usersAtStart.find(
            user => user.username == helper.usersArray[0].username
            ).blogs

        await api
            .delete(`/api/blogs/${createBlogsUser[0].toString()}`)
            .set('Authorization', `bearer ${loggedInUser.body.token}`) 
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    })

    test('if a non existing id is provided, an error is thrown', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const loggedInUser = await api
            .post('/api/login')
            .send(helper.usersArray[0])
            .expect(200)

        await api
            .delete(`/api/blogs/6377687fdbaaa8895c05f20c`)
            .set('Authorization', `bearer ${loggedInUser.body.token}`) 
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })

    test('delete fails if incorrect authorization is provided', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const usersAtStart = await helper.usersInDb()

        const createBlogsUser = usersAtStart.find(
            user => user.username == helper.usersArray[0].username
            ).blogs

        await api
        .delete(`/api/blogs/${createBlogsUser[0].toString()}`)
            .set('Authorization', `bearer ThisTokenISIncorrect`) 
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()        
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
})

describe('updating blogs works correctly', () => {

    test('Blog correctly updates title', async () => {
        const usersAtStart = await helper.usersInDb()
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.usersArray[0])
            .expect(200)

        const createdBlogsUser = usersAtStart.find(
            user => user.username == helper.usersArray[0].username
            ).blogs

        const newTitle = {title: "An Updated Title"} 

        await api
            .put(`/api/blogs/${createdBlogsUser[0].toString()}`)
            .set('Authorization', `bearer ${loggedInUser.body.token}`) 
            .send(newTitle)
            .expect(204)

        const updatedBlogs = await api.get(`/api/blogs`)
        const updatedTitles = updatedBlogs.body.map(blog => blog.title)
        expect(updatedTitles).toContain("An Updated Title")
    })

    test('Blog correctly updates likes', async () => {
        const usersAtStart = await helper.usersInDb()
        const blogsAtStart = await helper.blogsInDb()
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.usersArray[0])
            .expect(200)

        const createdBlogsUser = usersAtStart.find(
            user => user.username == helper.usersArray[0].username
            ).blogs
        const originalBlog = blogsAtStart.find(blog => blog.id == createdBlogsUser[0])

        const newLikes = {likes: originalBlog.likes + 1} 

        await api
            .put(`/api/blogs/${createdBlogsUser[0].toString()}`)
            .set('Authorization', `bearer ${loggedInUser.body.token}`) 
            .send(newLikes)
            .expect(204)

        const updatedBlogs = await helper.blogsInDb()
        const updatedBlog = updatedBlogs.find(blog => blog.id == originalBlog.id)

        expect(originalBlog.likes + 1).toEqual(updatedBlog.likes)
    })

})

afterAll(() => {
    mongoose.connection.close()
})