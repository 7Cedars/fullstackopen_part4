const Blog = require('../models/blog')
const User = require('../models/user')

const usersArray = [
  {
    username: 'AdaL',
    name: 'Ada Lovelace',
    password: 'ThisIsALongPassword'
  },
  {
    username: '7Cedars',
    name: 'Seven Cedars',
    password: 'ThisIsAnotherLongPassword'
  },
  {
    username: 'Ada2',
    name: 'Ada Lovelace the Second',
    password: 'ThisIsAnEvenLongerPassword'
  }
]

const blogsArray = [
  {
    title: "Blog number one",
    author: "Jane Doe",
    url: "BlogsFromJaneDoe.org/43527845278",
    likes: 15
  }, 
  {
    title: "Blog number two",
    author: "John Doe",
    url: "BlogsFromJohnDoe.org/43527845278",
    likes: 15
  }, 
  {
    title: "Blog number three!",
    author: "Someone Else",
    url: "BlogsFromSomeoneElse.org/43527845278",
    likes: 15
  }, 
]

const nonExistingId = async () => {
  const blog = new Blog( {
    title: "This will be deleted",
    author: "No one",
    url: "0000",
    likes: 0
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  usersArray,
  blogsArray,
  blogsInDb, 
  nonExistingId,
  usersInDb, 
}