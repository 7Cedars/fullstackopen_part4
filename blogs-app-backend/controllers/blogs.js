const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  .populate('user', { 
    username: 1, 
    name: 1 }) 
  response.json(blogs)    
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {response.status(404).end()}

  response.json(blog)    
})
  
blogsRouter.post('/', async (request, response) => {
 const blog = new Blog(request.body)
  
  blog.likes ? blog.likes = blog.likes : blog.likes = 0
  blog.user = request.user.id
  const savedBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(savedBlog.id)
  await request.user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const blog = await Blog.findById(request.params.id)
  const userid = request.user.id

  if ( blog.user.toString() === userid.toString() ){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).json(request.params.id)
  } else {
    response.status(401).end()
  }
})

// ok, so this is not the most efficient way.. but it works! 
blogsRouter.put('/:id', async (request, response) => {
  const update = request.body
  const originalBlog = await Blog.findById(request.params.id)
  let updatedBlog = originalBlog

  if (!(originalBlog)) {response.status(404).end()}

  update.title ? updatedBlog.title = update.title : null
  update.author ? updatedBlog.author = update.author : null
  update.url ? updatedBlog.url = update.url : null
  update.likes ? updatedBlog.likes = update.likes : null

  console.log('updatedBlog: ', updatedBlog)

  savedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  response.status(204).json(savedBlog)

})

module.exports = blogsRouter