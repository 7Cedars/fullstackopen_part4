const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when user tries to set up a new user name', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    let _user0 = helper.stockUsers[0]
    let _user1 = helper.stockUsers[1]

    // Setting up a look (like with the blogs) proved challenging. This is why I opted to keep close to the example from the notes app.  
    const passwordHash0 = await bcrypt.hash(_user0.password, 10)
    const user0 = new User({ username: _user0.username, name: _user0.name, passwordHash: passwordHash0 })
    await user0.save()
    
    const passwordHash1 = await bcrypt.hash(_user1.password, 10)
    const user1 = new User({ username: _user1.username, name: _user1.name, passwordHash: passwordHash1 }) 
    await user1.save()

  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'THDonker',
      name: 'Teije Hidde Donker',
      password: 'TestTest3!',
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

    const newUser = helper.stockUsers[0]

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

    const newUser = helper.stockUsers[2]
    newUser.username = '12'

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

    const newUser = helper.stockUsers[2]
    newUser.password = 'pa'

    console.log('newUser:', newUser)

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


afterAll(() => {
  mongoose.connection.close()
})