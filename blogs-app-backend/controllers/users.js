const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { 
      url: 1, 
      title: 1, 
      author: 1, 
      id: 1,
    })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password is shorter than the minimum allowed length (3).'
    })
  }  

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username already in use'
    })
  }

  const saltRounds = 12
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter